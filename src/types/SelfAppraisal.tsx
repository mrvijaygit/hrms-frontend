
interface Response {
    compentency_id:number;
    user_rating: number | string;
    user_comment: string;
    self_appraisal_id:number;
    reviewer_rating?:number | string;
    reviewer_comment?:string;
}

export interface FormType {
    responses: Response[];
}

export interface TableDataType extends Response{
    s_no:number;
    compentency_name:string;
    weightage:string | number;
}
