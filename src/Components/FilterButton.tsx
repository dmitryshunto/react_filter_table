import classes from './Table.module.css'
import React, { useState } from 'react'
import { ColumnNamesType, FilterConditionType, FilterItemType } from './Table'

type FilterButtonType = {
    filters_conditions: FilterConditionType[]
    columns_headers_names: ColumnNamesType[]
    setFilter: (filter_item: FilterItemType | null) => void
}

const FilterButton: React.FC<FilterButtonType> = (props) => {
    const [filter_mode, set_filter_mode] = useState<boolean>(false)
    const [main_filter_condition, set_filter_condition] = useState<FilterConditionType>(props.filters_conditions[0])
    const [filtered_column_name, set_filtered_column_name] = useState<ColumnNamesType>(props.columns_headers_names[1])
    const [filtered_value, set_filtered_value] = useState<string>('')

    // инпуты для ввода условия фильтрации

    const filter_conditions_inputs = props.filters_conditions.map(filter_condition => {
        return (
            <RadioInput key={filter_condition}
                checked={main_filter_condition === filter_condition}
                value={filter_condition}
                //@ts-ignore
                cb={set_filter_condition} />
        )
    })

    // инпуты для ввода названия колонки

    const columns_names_inputs = props.columns_headers_names.map(column_name => {
        if (column_name === 'id') return
        return (
            <RadioInput key={column_name}
                checked={filtered_column_name === column_name}
                value={column_name}
                //@ts-ignore
                cb={set_filtered_column_name} />
        )
    })

    const filter_handler = () => {
        props.setFilter({
            column_name: filtered_column_name,
            condition: main_filter_condition,
            filtered_value
        })
    }

    return (
        <div className={classes.filter_block}>
            <div>
                <button onClick={() => set_filter_mode(!filter_mode)}>Filter</button>
                {filter_mode &&
                    <div className={classes.filter_mode}>
                        <div className={classes.inputs_block}>
                            <div>
                                {filter_conditions_inputs}
                            </div>
                            <div>
                                {columns_names_inputs}
                            </div>
                        </div>
                        <input type='text' value={filtered_value} onChange={(e) => set_filtered_value(e.target.value)} />
                        <button onClick={filter_handler} disabled={!filtered_value}>Find</button>
                        <button onClick={() => {
                            props.setFilter(null)
                            set_filtered_value('')
                        }}>Reset</button>
                    </div>
                }
            </div>

        </div>
    )
}

type RadioInputType = {
    checked: boolean
    value: FilterConditionType | ColumnNamesType
    cb: (value: FilterConditionType | ColumnNamesType) => void
}

export const RadioInput: React.FC<RadioInputType> = ({ value, cb, checked }) => {
    return (
        <div>
            <input type='radio' id={`${value}`} onChange={() => cb(value)} checked={checked} />
            <label htmlFor={value}>{value}</label>
        </div>
    )
}

export default FilterButton