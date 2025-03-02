
export interface FormType{
    notice_id:number;
    notice_title:string;
    notice_content:string;
    issue_date:Date | null;
    notice_status:boolean | null
}

export interface TableDataType extends FormType{
    s_no:number;
    issue_date_display:string;
}
