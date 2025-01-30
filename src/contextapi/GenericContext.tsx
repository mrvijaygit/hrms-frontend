import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, TState} from "../types/Generic";
import type {TableDataType as HolidayTableDataType, FilterType as HolidayFilterType, FormType as HolidayFormType} from "../types/Holiday";
import type {TableDataType as LeaveTypeTableDataType, FormType as LeaveTypeFormType} from "../types/LeaveType";
import type {TableDataType as ClientsTableDataType, FormType as ClientsFormType} from "../types/Clients";
import type {TableDataType as ProjectsTableDataType, FormType as ProjectsFormType} from "../types/Projects";
import type {TableDataType as TasksTableDataType, FormType as TasksFormType, FilterType as TasksFilterType} from "../types/Tasks";
import type {TableDataType as AReportTableDataType, FilterType as AReportFilterType} from "../types/AttendanceRecord";

import GenericReducer from "../reducers/GenericReducer";

const Holiday = createContext({} as ContextType<HolidayTableDataType, HolidayFormType, HolidayFilterType>);
const LeaveType = createContext({} as ContextType<LeaveTypeTableDataType, LeaveTypeFormType>);
const Clients = createContext({} as ContextType<ClientsTableDataType, ClientsFormType>);
const Projects = createContext({} as ContextType<ProjectsTableDataType, ProjectsFormType>);
const Tasks = createContext({} as ContextType<TasksTableDataType, TasksFormType, TasksFilterType>);
const AReport = createContext({} as ContextType<AReportTableDataType, {}, AReportFilterType>);

const HolidayInitialValues:TState<HolidayTableDataType, HolidayFormType, HolidayFilterType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null,
    filter:{
        m_year_id:null
    }
}

const LeavetypeInitialValues:TState<LeaveTypeTableDataType, LeaveTypeFormType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
}

const ClientsInitialValues:TState<ClientsTableDataType, ClientsFormType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
}

const ProjectsInitialValues:TState<ProjectsTableDataType, ProjectsFormType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
}

const TasksInitialValues:TState<TasksTableDataType, TasksFormType, TasksFilterType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null,
    filter:{
        project_id:null,
        user_login_id:null
    }
}

const AReportInitialValues:TState<AReportTableDataType, {}, AReportFilterType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    filter:{
        attendance_date:new Date(),
        user_login_id:null
    }
}

export function HolidayContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<HolidayTableDataType, HolidayFormType, HolidayFilterType>, HolidayInitialValues);
    return <Holiday.Provider value={{state, dispatch}}>{children}</Holiday.Provider>
}

export function LeaveTypeContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<LeaveTypeTableDataType, LeaveTypeFormType>, LeavetypeInitialValues);
    return <LeaveType.Provider value={{state, dispatch}}>{children}</LeaveType.Provider>
}

export function ClientsContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<ClientsTableDataType, ClientsFormType>, ClientsInitialValues);
    return <Clients.Provider value={{state, dispatch}}>{children}</Clients.Provider>
}

export function ProjectsContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<ProjectsTableDataType, ProjectsFormType>, ProjectsInitialValues);
    return <Projects.Provider value={{state, dispatch}}>{children}</Projects.Provider>
}

export function TasksContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<TasksTableDataType, TasksFormType, TasksFilterType>, TasksInitialValues);
    return <Tasks.Provider value={{state, dispatch}}>{children}</Tasks.Provider>
}

export function AReportContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<AReportTableDataType, {}, AReportFilterType>, AReportInitialValues);
    return <AReport.Provider value={{state, dispatch}}>{children}</AReport.Provider>
}

export const UseHoliday = () => useContext(Holiday);
export const UseLeaveType = () => useContext(LeaveType);
export const UseClients = () => useContext(Clients);
export const UseProjects = () => useContext(Projects);
export const UseTasks = () => useContext(Tasks);
export const UseAReport = () => useContext(AReport);