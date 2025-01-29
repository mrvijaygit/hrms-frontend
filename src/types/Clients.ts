export interface FormType {
    client_id:number;
    client_name:string;
    contact_person_name:string;
    contact_no:string | number;
    email_id: string;
}

export interface TableDataType extends FormType{
    s_no:number;
}
