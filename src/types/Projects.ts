export type FormType = {
    project_id:number;
    project_name:string;
    project_description:string;
    client_id:string | null;
    project_manager_id: string | null;
    start_date: Date | null;
    end_date: Date | null;
    project_value:string | number;
    project_status_id:string | null;
}
export type TableDataType = Omit<FormType, 'start_date' | 'end_date'> & {
    s_no:number;
    start_date:string; 
    end_date:string;
    members:number;
    tasks:number;
    work_done:string;
    project_status:string;
    status_color:string;
    department_name:string;
    project_manager:string;
    client_name:string;
}


