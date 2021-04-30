import React, { useEffect, useState } from 'react'
import { DataItem, get_data } from '../api'
import FilterButton from './FilterButton'
import Paginator from './Paginator'
import classes from './Table.module.css'

type SorterDirection = 'icreasing' | 'decreasing' | null

export type ColumnNamesType = keyof DataItem

type SorterType = {
    sorter_direction: SorterDirection
    column_name: ColumnNamesType
}

export type FilterConditionType = 'more' | 'less' | 'includes' | 'equals'

export const filters_conditions: FilterConditionType[] = ['more', 'less', 'includes', 'equals']

export type FilterItemType = {
    column_name: ColumnNamesType
    condition: FilterConditionType
    filtered_value: string
}

type PropsType = {
    tets_data: DataItem[]
}

const Table: React.FC<PropsType> = (props) => {
    let [data, setData] = useState<DataItem[] | null>(null)
    const [columns_headers_names, set_columns_headers_names] = useState<ColumnNamesType[] | null>(null)
    
    const [sorter, setSorter] = useState<SorterType | null>(null)
    const [filter, setFilter] = useState<FilterItemType | null>(null)
    
    const [page_size, set_page_size] = useState<number>(5)
    const [current_page, set_current_page] = useState<number>(1)

    useEffect(() => {
        // ПОЛУЧЕНИЕ ДАННЫХ ИЗ СЕРВЕРА

        // get_data().then(data => {
        //     setData(data) 
        //     // возьмем названия столбцов таблицы из ключей первого объекта из массива data
        //     set_columns_headers_names(Object.keys(data[0]) as ColumnNamesType[])
        // })

        // ПОЛУЧЕНИЕ ДАННЫХ ИЗ ФАЙЛА (для тестирования таблицы раскоментировать до конца useEffect и закоментировать с начала useEffect)
        
        setData(props.tets_data)
        // возьмем названия столбцов таблицы из ключей первого объекта из массива data
        set_columns_headers_names(Object.keys(props.tets_data[0]) as ColumnNamesType[])
    }, [])

    if (!data || !columns_headers_names) return <EmptyPage />

    // функция с логикой сортировки

    const sort = (column_name: ColumnNamesType) => {
        let sorter_direction: SorterDirection
        if (sorter && sorter.column_name === column_name) {
            sorter_direction = sorter.sorter_direction === 'icreasing' ? 'decreasing'
                : sorter.sorter_direction === 'decreasing' ? null
                    : 'icreasing'
        } else {
            sorter_direction = 'icreasing'
        }
        setSorter({ sorter_direction, column_name })
    }

    // фильтрация данных
    if (filter) {
        const { column_name, filtered_value, condition } = filter
        data = data.filter(item => {
            let item_value = item[column_name]
            let filtering_value = filtered_value
            if (typeof item[column_name] === 'string') {
                item_value = String(item[column_name]).toLowerCase()
                filtering_value = String(filtered_value).toLowerCase()
            } 
            if(typeof item[column_name] === 'number' && condition === 'equals') item_value = String(item[column_name])
            switch (condition) {
                case 'equals': return item_value === filtering_value
                case 'includes': return String(item_value).indexOf(filtering_value) !== -1
                case 'more': return item_value > filtering_value
                case 'less': return item_value < filtering_value
            }
        })
    }

    // сортировка данных

    if (sorter) {
        // если задана sorter_direction пишем логику сортировки, если sorter_direction равно null отсортируем data по id
        if (sorter['sorter_direction']) {
            data = data.sort((a, b) => {
                if (sorter['sorter_direction'] === 'icreasing') {
                    if (a[sorter.column_name] > b[sorter.column_name]) return 1
                    else if (a[sorter.column_name] < b[sorter.column_name]) return -1
                    return 0
                } else {
                    if (a[sorter.column_name] > b[sorter.column_name]) return -1
                    else if (a[sorter.column_name] < b[sorter.column_name]) return 1
                    return 0
                }
            })
        } else data = data.sort((a, b) => a.id - b.id)
    }

    // опрделение начального и конечного индекса отображаемых данных с учетом current_page и page_size

    let showing_items_start_index: number, showing_items_end_index: number 

    if(current_page === 1) {
        showing_items_start_index = 0 
    } else {
        showing_items_start_index = page_size * (current_page - 1)        
    }

    showing_items_end_index = showing_items_start_index + page_size - 1

    const table_content = data.map((row, index) => {
        if(index >= showing_items_start_index && index <= showing_items_end_index) return <TableItem key={row.id} {...row} />
        return null
    })

    return (
        <div className = 'content'>
            <FilterButton filters_conditions={filters_conditions}
                columns_headers_names={columns_headers_names}
                setFilter={setFilter} />
            {!!data.length &&
                <>
                    <TableHeader
                        sorter={sorter}
                        columns_headers_names={columns_headers_names!}
                        sort={sort} />
                    {table_content}
                    <Paginator page_size = {page_size}
                        set_page_size = {set_page_size}
                        current_page = {current_page}
                        set_current_page = {set_current_page}
                        number_of_items = {data.length}
                        page_size_list = {[2, 3 ,5, 10]}/>
                </>
            }
            {!data.length && <EmptyPage />}
        </div>
    )
}

type TableHeaderType = {
    sorter: SorterType | null
    columns_headers_names: ColumnNamesType[]
    sort: (column_name: ColumnNamesType) => void
}

const TableHeader: React.FC<TableHeaderType> = (props) => {
    const columns_headers = props.columns_headers_names.map(column_name => {
        if (column_name === 'id') return // id не отображаем
        let sorter_direction, sort
        if (props.sorter && props.sorter.column_name === column_name) sorter_direction = props.sorter.sorter_direction
        if (column_name !== 'date') sort = props.sort
        return (
            <TableColumnHeader key={column_name}
                sorter_direction={sorter_direction}
                column_name={column_name}
                sort={sort} />)

    })
    return (
        <div className={classes.row}>
            {columns_headers}
        </div>
    )
}

type TableColumnHeaderType = {
    sorter_direction?: SorterDirection
    column_name: ColumnNamesType
    sort?: (column_name: ColumnNamesType) => void
}

const TableColumnHeader: React.FC<TableColumnHeaderType> = (props) => {
    const button_content = props.sorter_direction ? props.sorter_direction : 'sort'
    return (
        <div className={classes.cell}>
            {props.column_name.toUpperCase()}
            {props.sort &&
                <button onClick={() => props.sort!(props.column_name)}>{button_content}</button>
            }
        </div>
    )
}

const TableItem: React.FC<DataItem> = (props) => {
    return (
        <div className={classes.row}>
            <div className={classes.cell}>{props.date}</div>
            <div className={classes.cell}>{props.name}</div>
            <div className={classes.cell}>{props.number}</div>
            <div className={classes.cell}>{props.distance}</div>
        </div>
    )
}

const EmptyPage = () => <div>No data</div>

export default Table