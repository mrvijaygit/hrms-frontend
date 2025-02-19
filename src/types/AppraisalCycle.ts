import type { DatesRangeValue } from "@mantine/dates";

export interface FormType {
    appraisal_cycle_id:number;
    appraisal_name:string;
    appraisal_date:DatesRangeValue;
    appraisal_status_id:number | null;
}

export interface TableDataType extends Omit<FormType, "appraisal_date">{
    s_no:number;
    appraisal_date:string;
    start_date:string;
    end_date:string;
    appraisal_status:string;
    is_active:boolean;
}