import axios from 'axios'

const url = 'http://localhost:3001/test/'

export type DataItem = {
    id: number
    name: string
    date: Date
    number: boolean
    distance: number
}

export const get_data = async () => {
    let response = await axios.get<DataItem[]>(url)
    return response.data
}