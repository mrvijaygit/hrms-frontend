import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/Team";
import TeamReducer from "../reducers/TeamReducer";
const Context = createContext({} as ContextType);

const initialValues:stateType = {
    page:1,
    show:"10",
    data:[],
    info:"",
    totalPage:1,
    is_updated:false,
    editData:null,
    filter:{
        project_id:null
    }
}

export default function TeamContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(TeamReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseTeam = () => useContext(Context);