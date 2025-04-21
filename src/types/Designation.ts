export interface FormType {
    m_designation_id:number;
    m_department_id:number | null;
    designation_name:string;
}
export interface TableDataType extends FormType{
    s_no:number;
    department_name:string;
}