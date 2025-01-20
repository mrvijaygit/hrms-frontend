import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/LeaveRequest";
import LeaveRequestReducer from "../reducers/LeaveRequestReducer";
const Context = createContext({} as ContextType);

const initialValues:stateType = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    viewDetais:null
}

export default function LeaveRequestContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(LeaveRequestReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseLeaveRequest = () => useContext(Context);