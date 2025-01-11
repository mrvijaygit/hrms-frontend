import { Dispatch } from "react";
import { ComboboxData } from "@mantine/core";

export interface UserData {
    s_no:number,
    user_login_id: number;
    employee_id:number;
    user_name: string;
    email_id: string;
    phone_number: string;
    department_name: string;
    designation_name: string;
    user_type: string;
}

export interface stateType{
    data:UserData[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
    master:{
        gender:ComboboxData;
        bloodGroup:ComboboxData
        userType:ComboboxData
        department:ComboboxData
        employeeStatus:ComboboxData
        banks:ComboboxData
        bankAccountType:ComboboxData
        documentNames:ComboboxData
    } | null
    filter:{
        m_user_type_id:string | null,
        m_department_id:string | null,
        m_designation_id:string | null,
        m_employee_status_id:string | null
    }
}

export type actionType = {type:"setPage", payload:number} 
| {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:UserData[], totalRecord:number}} 
| {type:"filter", payload:{key:string, value:string|null}} 
| {type:"setMasters", payload:stateType['master']};


export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}