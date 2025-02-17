export interface FormType {
    task_id:number;
    task_name:string;
    task_description:string;
    task_date:[Date | null, Date | null];
    task_status_id:number | null;
    projected_hours:number;
}

export interface TableDataType extends FormType {
    s_no:number;
    start_date:string;
    end_date:string;
    task_status:string;
    status_color:string;
    spent_time:string;
}

export type FilterType = {
    project_id:number | null,
    task_status_id:number | null,
}

