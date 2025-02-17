import type { Dispatch } from "react";
export interface TState<T, E={}, F={}>{
    data:T[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
    is_updated:boolean,
    editData?:E | null,
    filter?:F
}

export type TAction<T, E={}, F={}> = {type:"setPage", payload:number} 
| {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:T[], totalRecord:number}} 
| {type:"isUpdated", payload:{ is_updated:boolean, editData:E | null}}
| {type:"filter", payload:{key: keyof F , value:number | string | null | Date}};

export type ContextType<T, E={}, F={}> = {
    state:TState<T,E, F>,
    dispatch:Dispatch<TAction<T, E, F>>
}

export type SortingType = { direction: string, accessor: string};
