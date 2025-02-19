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

export interface FilterType{
    project_id:number | null,
}
