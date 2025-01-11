import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Projects";
import ProjectReducer from "../reducers/ProjectReducer";
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

export default function ProjectsContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(ProjectReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseProjects = () => useContext(Context);