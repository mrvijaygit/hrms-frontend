import { Dispatch } from "react";
import type { SalaryType } from "./EmployeeForm";
import { ComboboxData } from "@mantine/core";

export interface formType extends SalaryType {
  payroll_id:number,
  user_login_id:string | null,
  payroll_month:Date | null,
  gross_salary:number | string,
  net_salary:number | string
}

export interface tableDataType{
  s_no:number,
  payroll_id:number,
  user_login_id:number,
  user_name:string,
  payroll_month:string,
  basic_salary:number,
  allowances:number,
  gross_salary:number,
  tax:number,
  other_deduction:number,
  net_salary:number,
}

export interface stateType{
    data:tableDataType[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
    is_updated:boolean,
    editData:formType | null,
    employee:ComboboxData,
    filter:{
      user_login_id:string | null,
      payroll_month: Date | null
    }
}

export type actionType = 
{type:"setPage", payload:number} 
| {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:tableDataType[], totalRecord:number}} 
| {type:"isUpdated", payload:{ is_updated:boolean, editData:formType | null}} 
| {type:"filter", payload:{key:string, value:string | Date |null}}
| {type:"setEmployees", payload:ComboboxData};

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}

export interface payslip extends Omit<tableDataType, 's_no' | 'payroll_id' | 'user_login_id'> {
    emp_code:string,
    designation_name:string,
    department_name:string,
    pan_card_no:string,
    bank_name:string,
    account_number:string,
    ifsc_code:string,
    monthly_working_days:string,
    absent_days:number,
    house_rent_allowance:number,
    medical_allowance:number,
    transport_allowance:number,
    other_allowance:number,
    company_details:{
      company_name:string,
      address:string,
      domain:string,
      cin_no:string,
    }
}