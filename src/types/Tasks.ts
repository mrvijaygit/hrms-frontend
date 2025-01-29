export interface FormType {
    task_id:number;
    task_name:string;
    task_description:string;
    start_date:Date | null;
    end_date:Date | null;
    task_status_id:string | null;
    projected_days:string | null;
    projected_hours:string | null;
    projected_minutes:string | null;
}

export interface TableDataType extends Omit<FormType, "start_date" | "end_date"> {
    s_no:number;
    start_date:string;
    end_date:string;
    task_status:string;
    projected_time:string;
    spent_time:string;
}

export type FilterType = {
    project_id:string | null,
    user_login_id:string | null,
}

