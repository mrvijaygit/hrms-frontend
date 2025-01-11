import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Holiday";
import HolidayReducer from "../reducers/HolidayReducer";
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

export default function HolidayContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(HolidayReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseHoliday = () => useContext(Context);