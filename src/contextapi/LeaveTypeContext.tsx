import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/LeaveType";
import LeaveTypeReducer from "../reducers/LeaveTypeReducer";
const Context = createContext({} as ContextType);

const initialValues:stateType = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null
}

export default function LeaveTypeContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(LeaveTypeReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseLeaveType = () => useContext(Context);