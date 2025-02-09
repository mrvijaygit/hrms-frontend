import { Paper, Tabs } from "@mantine/core"
import {AiOutlineFile, AiOutlineUser} from 'react-icons/ai'
import { IoSchoolOutline } from "react-icons/io5";
import { BsBriefcase } from "react-icons/bs";
import { PiBankLight } from "react-icons/pi";
import { FaRegMoneyBillAlt } from "react-icons/fa";

import BasicForm from "./forms/BasicForm"
import EducationForm from "./forms/EducationForm";
import BankForm from "./forms/BankForm";
import SalaryForm from "./forms/SalaryForm";
import DocumentForm from "./forms/DocumentForm";
import ExperienceForm from "./forms/ExperienceForm";
import { UseEmployeeForm } from "../../contextapi/EmployeeFormContext";
import { useEffect, useState } from "react";
import { protectedApi } from "../../utils/ApiService";
import { useLocation } from "react-router-dom";
import { alert } from "../../utils/Alert";

function Form() {

  const {state, dispatch} = UseEmployeeForm();

  const location = useLocation();
  const [trigger, setTrigger] = useState<Boolean>(false);

  useEffect(()=>{
    (async()=>{
        try{
          let resolve = await protectedApi.get('/master/employeeFormMasters'); 
          dispatch({type:'setMasters', payload:resolve.data});
          setTrigger((prev) => prev == false ? true : false);
        }
        catch(err){
          dispatch({type:'setMasters', payload:null});
        }
    })();
  },[]);

  useEffect(()=>{
    if(location.state?.user_login_id && state.master != null){
      
    (async()=>{
      try{
        let resolve = await protectedApi.get('/user/profile', {
          params:{
            user_login_id:location.state.user_login_id
          }
        }); 
        dispatch({type:'setPrimaryKey',payload:{...state,
          user_login_id:location.state.user_login_id,
          isEdit:true, 
          employee_id:resolve.data.basic.employee_id,
          employee_bank_id:resolve.data.bank.employee_bank_id,
          employee_education_id:resolve.data.education.employee_education_id,
          employee_salary_id:resolve.data.salary.employee_salary_id
        }});
        dispatch({type:'setEditFormData', payload:{'key':'basic', 'value':resolve.data['basic']}});
        dispatch({type:'setEditFormData', payload:{'key':'bank', 'value':resolve.data['bank']}});
        dispatch({type:'setEditFormData', payload:{'key':'education', 'value':resolve.data['education']}});
        dispatch({type:'setEditFormData', payload:{'key':'experience', 'value':resolve.data['experience']}});
        dispatch({type:'setEditFormData', payload:{'key':'salary', 'value':resolve.data['salary']}});
        dispatch({type:'setEditFormData', payload:{'key':'documents', 'value':resolve.data['documents']}});
      }
      catch(err){
        alert.error('Master Not Found');
      }
  })();
    }
  },[location.state?.user_login_id, trigger]);
  
  return (
    <>
        <Paper p='sm'>
            <Tabs defaultValue='basic_details'>
                <Tabs.List grow> 
                  <Tabs.Tab value="basic_details" leftSection={<AiOutlineUser/>}>Basic Details</Tabs.Tab>
                  <Tabs.Tab value="education" leftSection={<IoSchoolOutline/>} disabled= {state?.user_login_id < 0}>Education</Tabs.Tab>
                  <Tabs.Tab value="experience" leftSection={<BsBriefcase/>} disabled= {state?.user_login_id < 0}>Experience</Tabs.Tab>
                  <Tabs.Tab value="bank_account" leftSection={<PiBankLight/>} disabled= {state?.user_login_id < 0}>Bank Account</Tabs.Tab>
                  <Tabs.Tab value="documents" leftSection={<AiOutlineFile/>} disabled= {state?.user_login_id < 0}>Documents</Tabs.Tab>
                  <Tabs.Tab value="salary" leftSection={<FaRegMoneyBillAlt/>} disabled= {state?.user_login_id < 0}>Salary</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="basic_details" pt='sm'>
                  <BasicForm/>
                </Tabs.Panel>
                <Tabs.Panel value="education" pt='sm'>
                    <EducationForm/>
                </Tabs.Panel>
                <Tabs.Panel value="experience" pt='sm'>
                  <ExperienceForm/>
                </Tabs.Panel>
                <Tabs.Panel value="bank_account" pt='sm'>
                    <BankForm/>
                </Tabs.Panel>
                <Tabs.Panel value="documents" pt='sm'>
                  <DocumentForm/>
                </Tabs.Panel>
                <Tabs.Panel value="salary" pt='sm'>
                    <SalaryForm/>
                </Tabs.Panel>
            </Tabs>
        </Paper>
    </>
  )
}

export default Form