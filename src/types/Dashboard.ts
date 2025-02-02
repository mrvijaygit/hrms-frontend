import { dataType as noticeType } from "./Notice"
import { FormType as holidayFormType } from "./Holiday";
import { formType as attendanceFormType } from "./Attendance";
import { Dispatch } from "react";

interface holidayTypeModify extends Omit<holidayFormType, "holiday_date">{
    holiday_date: string
}

interface attendanceType extends Omit<attendanceFormType, "user_login_id">{
    total_hours:number;
    user_login_id:number;
}

interface todayBirthday {
    employee_id : number;
    user_login_id: number;
    user_name:string;
    department_name:string;
    designation_name:string;
    date_of_birth:string;
    age:number
} 

interface newHires extends Omit<todayBirthday, "date_of_birth" | "age">{
    date_of_joining: string
}
interface workAnniversary extends newHires{
    anniversary_year:number
}

export type cardType = {
    title:string;
    icon:string;
    count:number;
    id:string;
}

export type stateType ={
    attendance:attendanceType | null
    adminCard:cardType[] | null
    notice: noticeType[] | null,
    upcomingHolidays: holidayTypeModify[] | null,
    todayBirthday: todayBirthday[] | null,
    newHires:  newHires[] | null,
    workAnniversary:  workAnniversary[] | null,
}

export type actionType = {type:"setAll", payload:stateType['attendance'] | Omit<stateType, 'attendance'>}

export type ContextType = {
    state:stateType,
    dispatch:Dispatch<actionType>
}

export type NoticeCardtype = {
    title:string,
    date:string,
    content:string,
    isLast:boolean
}