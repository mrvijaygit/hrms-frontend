import type { DatesRangeValue } from "@mantine/dates";

export interface FormType {
    goal_id:number;
    goal_name:string;
    goal_date:DatesRangeValue;
    description:string;
    weightage:number;
    progress:number;
}

export interface TableDataType extends FormType{
    s_no:number;
    user_login_id:number;
    start_date:string;
    end_date:string;
    goal_status:string;
}