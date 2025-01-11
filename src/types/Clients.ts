import { Dispatch } from "react";

export type dataType = {
    s_no?:number;
    client_id:number;
    client_name:string;
    contact_person_name:string;
    contact_no:string | number;
    email_id: string;
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