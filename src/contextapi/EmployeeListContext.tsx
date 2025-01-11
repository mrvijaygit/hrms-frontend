import {createContext, PropsWithChildren, useReducer, useContext} from 'react'
import type { stateType, ContextType} from '../types/EmployeeList';
import EmpListReducer from '../reducers/EmpListReducer';

const initialState:stateType= {
   data:[],
   show:"10",
   page:1,
   totalPage:2,
   info:"",
   master:null,
   filter:{
      m_user_type_id:null,
      m_department_id:null,
      m_designation_id:null,
      m_employee_status_id:null,
  }
 }
 
const Context  = createContext({} as ContextType);

export default function EmployeeListContext({children}:PropsWithChildren){

   const [state, dispatch] = useReducer(EmpListReducer, initialState);

   return <Context.Provider value={{state,dispatch}}>{children}</Context.Provider>
}

export const UseEmployeeList = ()=>useContext(Context);