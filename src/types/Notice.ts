import { Dispatch } from "react";

export type dataType = {
    s_no?:number;
    notice_id:number;
    notice_title:string;
    notice_content:string;
    issue_date:Date | null;
    issue_date_display?:string;
    notice_status:string | null
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