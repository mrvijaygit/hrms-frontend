import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, TState} from "../types/Generic";
import type {TableDataType as HolidayTableDataType, FilterType as HolidayFilterType, FormType as HolidayFormType} from "../types/Holiday";
import type {TableDataType as LeaveTypeTableDataType, FormType as LeaveTypeFormType} from "../types/LeaveType";
import type {TableDataType as ClientsTableDataType, FormType as ClientsFormType} from "../types/Clients";
import type {TableDataType as ProjectsTableDataType, FormType as ProjectsFormType} from "../types/Projects";
import type {TableDataType as TeamTableDataType, FormType as TeamFormType, FilterType as TeamFilterType} from "../types/Team";
import type {TableDataType as TasksTableDataType, FormType as TasksFormType, FilterType as TasksFilterType} from "../types/Tasks";
import type {TableDataType as AReportTableDataType, FilterType as AReportFilterType} from "../types/AttendanceRecord";
import type {TableDataType as ACycleTableDataType, FormType as ACycleFormType} from "../types/AppraisalCycle";
import type {TableDataType as AppraiseeTableDataType, FormType as AppraiseeFormType} from "../types/AppraiseeList";
import type {TableDataType as CompetencyTableDataType, FormType as CompetencyFormType} from "../types/Competency";
import type {TableDataType as TimeTableDataType, FormType as TimeFormType, FilterType as TimeFilterType} from "../types/TimeSheets";
import type {TableDataType as NoticeTableDataType, FormType as NoticeFormType} from "../types/Notice";

import GenericReducer from "../reducers/GenericReducer";

const Holiday = createContext({} as ContextType<HolidayTableDataType, HolidayFormType, HolidayFilterType>);
const LeaveType = createContext({} as ContextType<LeaveTypeTableDataType, LeaveTypeFormType>);
const Clients = createContext({} as ContextType<ClientsTableDataType, ClientsFormType>);
const Projects = createContext({} as ContextType<ProjectsTableDataType, ProjectsFormType>);
const Team = createContext({} as ContextType<TeamTableDataType, TeamFormType, TeamFilterType>);
const Tasks = createContext({} as ContextType<TasksTableDataType, TasksFormType, TasksFilterType>);
const AReport = createContext({} as ContextType<AReportTableDataType, {}, AReportFilterType>);
const ACycle = createContext({} as ContextType<ACycleTableDataType, ACycleFormType>);
const Appraisee = createContext({} as ContextType<AppraiseeTableDataType, AppraiseeFormType>);
const Competency = createContext({} as ContextType<CompetencyTableDataType, CompetencyFormType>);
const Time = createContext({} as ContextType<TimeTableDataType, TimeFormType, TimeFilterType>);
const Notice = createContext({} as ContextType<NoticeTableDataType, NoticeFormType>);

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

const TeamInitialValues:TState<TeamTableDataType, TeamFormType, TeamFilterType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null,
    filter:{
        project_id:null,
    }
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
        task_status_id:null
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

const ACycleInitialValues:TState<ACycleTableDataType, ACycleFormType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
}

const AppraiseeInitialValues:TState<AppraiseeTableDataType, AppraiseeFormType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
}

const CompetencyInitialValues:TState<CompetencyTableDataType, CompetencyFormType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
}

const TimeInitialValues:TState<TimeTableDataType, TimeFormType, TimeFilterType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null,
    filter:{
        project_id:null,
        task_id:null,
        project_member_id:null
    }
}

const NoticeInitialValues:TState<NoticeTableDataType, NoticeFormType> = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
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

export function TeamContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<TeamTableDataType, TeamFormType, TeamFilterType>, TeamInitialValues);
    return <Team.Provider value={{state, dispatch}}>{children}</Team.Provider>
}

export function TasksContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<TasksTableDataType, TasksFormType, TasksFilterType>, TasksInitialValues);
    return <Tasks.Provider value={{state, dispatch}}>{children}</Tasks.Provider>
}

export function AReportContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<AReportTableDataType, {}, AReportFilterType>, AReportInitialValues);
    return <AReport.Provider value={{state, dispatch}}>{children}</AReport.Provider>
}

export function ACycleContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<ACycleTableDataType, ACycleFormType>, ACycleInitialValues);
    return <ACycle.Provider value={{state, dispatch}}>{children}</ACycle.Provider>
}

export function AppraiseeContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<AppraiseeTableDataType, AppraiseeFormType>, AppraiseeInitialValues);
    return <Appraisee.Provider value={{state, dispatch}}>{children}</Appraisee.Provider>
}

export function CompetencyContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<CompetencyTableDataType, CompetencyFormType>, CompetencyInitialValues);
    return <Competency.Provider value={{state, dispatch}}>{children}</Competency.Provider>
}

export function TimeContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<TimeTableDataType, TimeFormType, TimeFilterType>, TimeInitialValues);
    return <Time.Provider value={{state, dispatch}}>{children}</Time.Provider>
}

export function NoticeContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(GenericReducer<NoticeTableDataType, NoticeFormType>, NoticeInitialValues);
    return <Notice.Provider value={{state, dispatch}}>{children}</Notice.Provider>
}

export const UseHoliday = () => useContext(Holiday);
export const UseLeaveType = () => useContext(LeaveType);
export const UseClients = () => useContext(Clients);
export const UseProjects = () => useContext(Projects);
export const UseTeam = () => useContext(Team);
export const UseTasks = () => useContext(Tasks);
export const UseAReport = () => useContext(AReport);
export const UseACycle = () => useContext(ACycle);
export const UseAppraisee = () => useContext(Appraisee);
export const UseCompetency = () => useContext(Competency);
export const UseTime = () => useContext(Time);
export const UseNotice = () => useContext(Notice);