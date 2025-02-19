export interface FormType{
    appraisee_id:number;
    user_login_id:number | null;
}

export interface TableDataType extends FormType{
    s_no:number;
    appraisal_cycle_id:number;
    user_name:string;
    department_name:string;
    designation_name:string;
    reviewer_name:string;
    overall_score:number;
    status:string;
}
