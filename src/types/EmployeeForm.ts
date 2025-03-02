import { Dispatch } from "react"
import { ComboboxData } from "@mantine/core"
import { FileWithPath } from "@mantine/dropzone"

export type selectType = {
    value: number,
    label: string
}[]

export interface BasicType{
    employee_id?:number;
    emp_code:string;
    first_name:string;
    last_name: string;
    user_name?: string;
    m_gender_id: string | null;
    gender_name?: string;
    date_of_birth: Date | null;
    m_blood_group_id: string | null;
    blood_group?: string;
    email_id: string;
    phone_number: number | string;
    aadhaar_no: number | string;
    pan_card_no: number | string;
    m_user_type_id:string |null,
    user_type?: string | null;
    m_department_id:string | null,
    department_name?: string;
    m_designation_id:string | null,
    designation_name?: string; 
    m_employee_status_id:string | null,
    employee_status?: string;
    date_of_joining:Date | null,
    reporting_id:String | null,
    reporting_user_name?: string;
    permant_address:string,
    current_address:string;
}

export interface ExperienceType{
    s_no?:number,
    employee_experience_id:number,
    previous_job_title: string,
    previous_company_name: string,
    employment_date:[Date | null, Date | null],
    start_date?:string | null,
    end_date?:string | null,
    previous_job_location: string
}

export interface SalaryType {
    employee_salary_id?:number
    basic_salary:string | number,
    house_rent_allowance:string | number,
    medical_allowance:string | number,
    transport_allowance:string | number,
    other_allowance:string | number,
    tax:string | number,
    other_deduction:string | number,
}

export interface EducationType {
    employee_education_id?:number;
    degree_name:string,
    field_of_study: string,
    institution_name:string,
    institution_location: string,
    graduation_year: string | number, 
    cgpa: string | number, 
}

export interface BankType{
    employee_bank_id?:number;
    m_bank_id: string | null;
    bank_name?:string;
    branch_name: string;
    account_holder_name: string;
    account_number: string;
    account_type: string | null;
    account_type_display?:string;
    ifsc_code: string;
}

export interface DocumentType{
    employee_document_id:number,
    document_id: string | null;
    files: FileWithPath[];
}

export interface ProfileType {
    basic:Omit<BasicType, "date_of_birth" | "date_of_joining"> & {date_of_birth:string; date_of_joining:string};
    bank: BankType | null;
    education: EducationType | null;
    experience: ExperienceType[] | null;
    salary:SalaryType | null;
}

export interface EditFormType {
    basic:BasicType;
    bank: BankType;
    education: EducationType;
    experience: ExperienceType[];
    salary:SalaryType;
}

  export type stateType ={
    isEdit:boolean;
    user_login_id:number,
    employee_id?:number,
    employee_bank_id?:number,
    employee_education_id?:number,
    employee_salary_id?:number,
    master:{
        gender:ComboboxData;
        bloodGroup:ComboboxData;
        userType:ComboboxData;
        department:ComboboxData;
        employeeStatus:ComboboxData;
        banks:ComboboxData;
        bankAccountType:ComboboxData;
        documentNames:ComboboxData;
    } | null
    basic:Omit<BasicType, "date_of_birth" | "date_of_joining"> & {date_of_birth:string; date_of_joining:string} | null;
    bank: BankType | null;
    education: EducationType | null;
    experience: ExperienceType[] | null;
    salary:SalaryType | null;
    documents:{s_no:number; employee_document_id:number; file_path:string; file_name:string; document_id:number; document_name: string;}[] | null;
}

export type actionType = {type:'setPrimaryKey', payload:stateType} 
| {type:"setMasters", payload:stateType['master']} 
| {type:"setEditFormData", payload:{key:string, value:stateType['bank'] | stateType['basic'] | stateType['education'] | stateType['salary'] | stateType['experience']}};

export type ContextType = {
    state : stateType,
    dispatch : Dispatch<actionType>
}