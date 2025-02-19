export interface FormType {
    timesheet_id:number;
    task_id:number | null;
    project_member_id:number | null;
    start_date_time:Date | null;
    end_date_time:Date | null;
    comments:string
}
export interface TableDataType extends Omit<FormType, "start_date_time" | "end_date_time">{
    s_no:number;
    project_id:number;
    start_date_time:string;
    end_date_time:string;
    display_start_date_time:string;
    display_end_date_time:string;
    task_name:string;
    user_name:string;
    task_duration:string;
}

export type FilterType = {
    project_id:number | null;
    task_id:number | null;
    project_member_id:number | null;
}