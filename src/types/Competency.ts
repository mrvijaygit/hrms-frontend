export interface FormType {
    compentency_id:number;
    compentency_name:string;
    weightage:string | number;
}

export interface TableDataType extends FormType{
    s_no:number;
}