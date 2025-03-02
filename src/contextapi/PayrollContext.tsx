import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Payroll";
import PayrollReducer from "../reducers/PayrollReducer";
const Context = createContext({} as ContextType);

const initialValues:stateType = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null,
    employee:[],
    filter:{
        user_login_id:null,
        payroll_month:new Date()
    }
}

export default function PayrollContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(PayrollReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UsePayroll = () => useContext(Context);