import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import classes from './Table.module.css'

type PaginatorType = {
    number_of_items: number
    page_size: number
    set_page_size: (page_size: number) => void
    current_page: number
    set_current_page: (current_page: number) => void
    page_size_list: number[]
}

const Paginator: React.FC<PaginatorType> = (props) => {

    if (!props.number_of_items) return null

    let number_of_pages

    if (props.number_of_items % props.page_size !== 0) number_of_pages = Math.floor(props.number_of_items / props.page_size) + 1
    else number_of_pages = Math.floor(props.number_of_items / props.page_size)


    const paginator_items = []

    for (let page_number = 1; page_number <= number_of_pages; page_number++) {
        paginator_items.push(<PaginatorItem page_number={page_number}
            key = {page_number}
            is_current={page_number === props.current_page}
            cb={props.set_current_page} />)
    }

    return (
        <div>
            <button disabled={props.current_page === 1}
                onClick={() => props.set_current_page(props.current_page - 1)}>{'<'}</button>
            {paginator_items}
            <button disabled={props.current_page === number_of_pages}
                onClick={() => props.set_current_page(props.current_page + 1)}>{'>'}</button>
            <SetPageSizeButton set_page_size={props.set_page_size}
                page_size={props.page_size}
                page_size_list={props.page_size_list} />
        </div>
    )
}

type PaginatorItemType = {
    page_number: number
    is_current: boolean
    cb: (page_number: number) => void
}

const PaginatorItem: React.FC<PaginatorItemType> = (props) => {
    return (
        <button className={cn({ [classes.bold_font]: props.is_current })}
            onClick={() => props.cb(props.page_number)}>{props.page_number}</button>
    )
}

type SetPageSizeButtonType = {
    set_page_size: (page_size: number) => void
    page_size: number
    page_size_list: number[]
}

const SetPageSizeButton: React.FC<SetPageSizeButtonType> = (props) => {
    const [setting_mode, set_setting_mode] = useState(false)
    const [inner_page_size, set_inner_page_size] = useState(1)

    useEffect(() => {
        set_inner_page_size(props.page_size)
    }, [props.page_size])

    const page_size_inputs = props.page_size_list.map(page_size => {
        const input_id = `${page_size}_page_size_input`
        return (
            <div key = {input_id}>
                <label htmlFor = {input_id}>{page_size}</label>
                <input checked={page_size === inner_page_size}
                    id = {input_id}
                    type={'radio'}
                    name={String(page_size)}
                    value={page_size}
                    onChange={() => set_inner_page_size(page_size)} />
            </div>
        )
    })

    return (
        <div>
            <button onClick={() => set_setting_mode(!setting_mode)}>{`${props.page_size} / page`}</button>
            {setting_mode &&
                <div>
                    {page_size_inputs}
                    <button onClick = {() => {
                        props.set_page_size(inner_page_size)
                        set_setting_mode(false)
                    }}>Set page size</button>
                </div>}
        </div>
    )
}

export default Paginator