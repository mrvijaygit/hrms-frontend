import { Dispatch } from "react";

export interface FormType {
    project_member_id:number,
    user_login_id:string | null,
    role:string
}

export interface TableDataType extends FormType {
    s_no:number;
    user_name:string;
    emp_code:string;
    role:string;
    timesheet_entries:number;
    timesheet_hours:string;
}

export interface stateType{
    data:TableDataType[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
    is_updated:boolean,
    editData:FormType | null,
    filter:{
        project_id:string | null,
    }
}

export type actionType = {type:"setPage", payload:number} | {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:TableDataType[], totalRecord:number}} | {type:"isUpdated", payload:{
    is_updated:boolean,
    editData:FormType | null
}} | {type:"filter", payload:{key:string, value:string | Date |null}};

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}