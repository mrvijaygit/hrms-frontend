import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Clients";
import ClientsReducer from "../reducers/ClientsReducer";
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

export default function ClientsContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(ClientsReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseClients = () => useContext(Context);