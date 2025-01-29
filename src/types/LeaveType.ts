export interface FormType {
    m_leave_type_id:number;
    leave_type:string;
    no_of_days?:string | number;
}
export interface TableDataType extends Omit<FormType, "holiday_date">{
    s_no:number;
}