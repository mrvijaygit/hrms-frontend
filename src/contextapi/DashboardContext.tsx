import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Dashboard";
import DashboardReducer from "../reducers/DashboardReducer";
const Context = createContext({} as ContextType);

const initialValues:stateType = {
    notice:null,
    upcomingHolidays:null,
    todayBirthday:null,
    newHires:null,
    workAnniversary:null
}

export default function DashboardContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(DashboardReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseDashboard = () => useContext(Context);