import { Dispatch } from "react";

export interface dataType {
    s_no?:number;
    holiday_id:number;
    holiday_title:string;
    holiday_date:Date | null;
    holiday_day?:string
}

export interface stateType{
    data:dataType[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
    is_updated:boolean,
    editData:dataType | null,
}

export type actionType = {type:"setPage", payload:number} | {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:dataType[], totalRecord:number}} | {type:"isUpdated", payload:{
    is_updated:boolean,
    editData:dataType | null
}};

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}