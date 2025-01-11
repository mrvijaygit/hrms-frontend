import { Grid, Select } from "@mantine/core"
import { useEffect } from "react"
import { protectedApi } from "../../utils/ApiService";
import { UsePayroll } from "../../contextapi/PayrollContext";
import {MonthPickerInput } from "@mantine/dates";
import { alert } from "../../utils/Alert";
import { useAppSelector } from "../../redux/hook";
function Filter() {
  const userInfo = useAppSelector(state => state.user);

  const {state, dispatch} = UsePayroll();

  const isAdmin:boolean = [1000,100].includes(userInfo.m_user_type_id);

  useEffect(()=>{
    if(isAdmin){
      (async()=>{
          try{
            let resolve = await protectedApi.get('/master/userList'); 
            dispatch({type:"setEmployees", payload:resolve.data});
          }
          catch(err){
              alert.error('Master Error');
          }
      })();
    }
  },[]);

  return (
    <>
        <Grid gutter='xs'>
            <Grid.Col span={{lg:3, md:6}}>
              <MonthPickerInput label="Payroll Month" size="xs" clearable 
              value={state.filter.payroll_month} 
              onChange={(value) => dispatch({type:"filter", payload:{'key':"payroll_month",'value':value}})}/>
            </Grid.Col>
            {
              isAdmin && <Grid.Col span={{lg:3, md:6}}>
                <Select label='Employees' data={state?.employee} size="xs" clearable
                value={state?.filter.user_login_id} 
                onChange={(value) => dispatch({type:"filter", payload:{'key':"user_login_id",'value':value}})}/>
              </Grid.Col>
            }

        </Grid>
    </>
  )
}

export default Filter