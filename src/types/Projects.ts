import { Dispatch } from "react";

export type dataType = {
    s_no?:number;
    project_id:number;
    project_name:string;
    project_description:string;
    client_id:string | null;
    client_name?:string;
    project_manager_id: string | null;
    project_manager?:string;
    start_date: Date | null;
    deadline: Date | null;
    project_value:string | number;
    project_status_id:string | null;
    project_status?:string;
    status_color?:string;
    department_name?:string;
}

export interface stateType{
    data:dataType[] | [],
    show:string | null,
    page:number,
    totalPage:number,
    info:string,
    is_updated:boolean,
    editData:dataType | null,
}

export type actionType = {type:"setPage", payload:number} | {type:"setShow", payload:string | null} 
| {type:"response", payload:{data:dataType[], totalRecord:number}} | {type:"isUpdated", payload:{
    is_updated:boolean,
    editData:dataType | null
}};

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
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
    basic:Omit<dataType, 'start_date' | 'deadline'> & { start_date:string; 
        deadline:string;
    },
    teamMembers:TeamMemberType[]
}