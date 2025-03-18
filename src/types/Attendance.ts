import { ComboboxData } from "@mantine/core";
import { Dispatch } from "react";

export type formType = {
  attendance_id:number,
  user_login_id:string | null,
  attendance_date:Date | null,
  punch_in:string,
  punch_out:string | null,
  m_attendance_status_id:string | null,
  att_latitude?:number | null;
  att_longitude?:number | null;
}

export type tableDataType = {
  s_no:number,
  attendance_id:number,
  user_login_id:number,
  user_name:string,
  attendance_date:string,
  punch_in:string,
  punch_out:string | null,
  working_hours:string,
  m_attendance_status_id:number,
  attendance_status:string
}

export interface stateType{
    data:tableDataType[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
    is_updated:boolean,
    editData:formType | null,
    status: ComboboxData | null
    filter:{
        attendance_date:Date | null,
        m_attendance_status_id:string | null,
    }
}

export type actionType = 
{type:"setPage", payload:number} 
| {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:tableDataType[], totalRecord:number}} 
| {type:"isUpdated", payload:{ is_updated:boolean, editData:formType | null}} 
| {type:"filter", payload:{key:string, value:string | Date |null}}
| {type:"setStatus", payload:ComboboxData};

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}