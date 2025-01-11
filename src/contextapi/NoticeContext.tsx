import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Notice";
import NoticeReducer from "../reducers/NoticeReducer";
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

export default function NoticeContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(NoticeReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseNotice = () => useContext(Context);