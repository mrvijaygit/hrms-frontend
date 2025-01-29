export interface TableDataType {
    s_no:number;
    user_name:string;
    [key: string]: number | string | null;
}

export interface FilterType {
    attendance_date:Date | null,
    user_login_id:number | null
}

export type HeaderType = {
    Header:string,
    accessor:string,
}[]