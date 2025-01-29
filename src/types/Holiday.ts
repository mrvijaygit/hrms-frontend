export interface FormType {
    holiday_id:number;
    holiday_title:string;
    holiday_date:Date | null;
}
export interface TableDataType extends Omit<FormType, "holiday_date">{
    s_no:number;
    holiday_date:string;
    holiday_day:string
}

export type FilterType = {
    m_year_id:string | null
}