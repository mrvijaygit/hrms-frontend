import {createContext, PropsWithChildren, useReducer, useContext} from 'react'
import type { stateType, ContextType} from '../types/EmployeeForm';
import EmployeeFormReducer from '../reducers/EmployeeFormReducer';

const initialState:stateType= {
   isEdit:false,
   user_login_id:-1,
   employee_id:-1,
   employee_education_id:-1,
   employee_bank_id:-1,
   employee_salary_id:-1,
   master:null,
   basic:null,
   bank:null,
   education:null,
   experience:null,
   salary:null,
   documents:null
}
 
const Context  = createContext({} as ContextType);

export default function EmployeeFormContext({children}:PropsWithChildren){

   const [state, dispatch] = useReducer(EmployeeFormReducer, initialState);

   return <Context.Provider value={{state, dispatch}}>{children}</Context.Provider>
}

export const UseEmployeeForm = ()=>useContext(Context);