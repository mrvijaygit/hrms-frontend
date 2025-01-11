import { Dispatch } from "react";

export type dataType = {
    s_no?:number;
    leave_id:number;
    user_login_id:string | null;
    user_name?:string;
    m_leave_type_id:string | null;
    leave_type?:string;
    start_date:Date | null;
    end_date:Date | null;
    no_of_days:number | string;
    reason:string;
    m_leave_status_id?:string | null;
    leave_status?:string;
    status_color?:string;
}

export interface stateType{
    data:dataType[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
}

export type actionType = {type:"setPage", payload:number} | {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:dataType[], totalRecord:number}};

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}

export type leaveUpdateForm = {
    leave_id: number | string; 
    m_leave_status_id:String | null; 
    remarks: string
}


export interface basicDetails {
    leave_id: number;
    user_login_id: number;
    user_name: string;
    email_id: string;
    emp_code: string;
    phone_number: string;
    department_name: string;
    designation_name: string;
    m_leave_status_id: number;
    leave_status: string;
    status_color: string;
    leave_type: string;
    user_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    created_on: string;
    updated_on: string;
    updated_by: string;
    remarks: string | null;
}

export type viewDetailType = {
    basic:basicDetails | null
}