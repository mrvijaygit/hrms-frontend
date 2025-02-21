import { Dispatch } from "react"
interface basic{
    appraisee_id: number;
    appraisal_cycle_id: number;
    user_login_id: number;
    overall_score: number;
    self_score: number;
    status_id: number;
    status: string;
    appraisal_name:string;
    is_active: number;
    appraisal_cycle_dates: string;
    user_name: string;
    user_type: string;
    department_name: string;
    designation_name:string;
    emp_code:string;
    date_of_joining:string;
    reporting_id:number;
    reviewer_name:string;
    is_publish:number;
}
export interface stateType{
    data:basic | null,
    filter:{
        appraisal_cycle_id:number | null;
        status_id:number | null;
    },
    trigger:boolean;
}

export type actionType = {type:"response", payload:stateType['data']}
| {type:"filter", payload:{key:string, value:number | null}}
| {type:"trigger", payload:boolean}

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}