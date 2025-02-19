export interface FormType {
    task_id:number;
    task_name:string;
    task_description:string;
    start_date:Date | null;
    end_date:Date | null;
    task_status_id:number | null;
    projected_hours:number;
}

export interface TableDataType extends Omit<FormType, "start_date" | "end_date"> {
    s_no:number;
    start_date:string;
    end_date:string;
    project_status:string;
    status_color:string;
    task_duration:string;
}

export type FilterType = {
    project_id:number | null,
    task_status_id:number | null,
}

