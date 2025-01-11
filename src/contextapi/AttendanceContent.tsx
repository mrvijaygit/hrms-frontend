import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Attendance";
import AttendanceReducer from "../reducers/AttendanceReducer";
const Context = createContext({} as ContextType);

const initialValues:stateType = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null,
    status:null,
    filter:{
        attendance_date:null,
        m_attendance_status_id:null,
    }
}

export default function AttendanceContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(AttendanceReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseAttendance = () => useContext(Context);