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
    work_done:number;
    project_status:string;
    status_color:string;
    department_name:string;
    project_manager:string;
    client_name:string;
}

export type TeamMemberFormType = {
    project_member_id:number,
    user_login_id:string | null,
    role:string,
    start_date:Date | null,
    end_date:Date | null,
}

export type TeamFormStateType = {
    isUpdated:boolean;
    editData:TeamMemberFormType | null
}

type TeamMemberType = Omit<TeamMemberFormType, 'start_date' | 'end_date'> & {
    start_date:string; 
    end_date:string;
    email_id:string;
    phone_number:string;
    user_name:string;
}

export interface ProjectDetailsType{
    basic:Omit<TableDataType, 's_no'>,
    teamMembers:TeamMemberType[]
}