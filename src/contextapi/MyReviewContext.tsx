import {createContext, useReducer, useContext, PropsWithChildren} from "react";
import type { ContextType, stateType } from "../types/MyReview";
import MyReviewReducer from "../reducers/MyReviewReducer";
const Context = createContext({} as ContextType);

const initialValues:stateType = {
    data:null,
    filter:{
       appraisal_cycle_id:null,
       status_id:null
    }
}

export default function MyReviewContext({children}:PropsWithChildren){
    const [state, dispatch] = useReducer(MyReviewReducer, initialValues);
    return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseMyReview = () => useContext(Context);