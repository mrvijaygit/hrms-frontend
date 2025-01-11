import { ComboboxData, Grid, Select } from "@mantine/core"
import { useEffect, useState } from "react"
import { protectedApi } from "../../utils/ApiService";
import { UseEmployeeList } from "../../contextapi/EmployeeListContext";
import { alert } from "../../utils/Alert";

function Filter() {

    const {state, dispatch} = UseEmployeeList();
    const [designation, setDesignation] = useState<ComboboxData | null>(null);

  useEffect(()=>{
    (async()=>{
        try{
          let resolve = await protectedApi.get('/master/employeeFormMasters'); 
          dispatch({type:'setMasters', payload:resolve.data});
        }
        catch(err){
          dispatch({type:'setMasters', payload:null});
        }
    })();
  },[]);

   useEffect(()=>{
        let m_department_id = state?.filter.m_department_id;
        setDesignation(null);
        if(m_department_id){
        
            (async()=>{
                try{
                    let response = await protectedApi.get(`/master/designation`, {
                        "params":{"m_department_id":m_department_id}
                    });
                    setDesignation(response.data);
                }
                catch(err:any){
                    alert.error(err);
                }
            })()
        }
        

    },[state?.filter.m_department_id]);

    const handleChange = (key:string, value:string|null) =>{
        dispatch({type:"filter", payload:{'key':key,'value':value}});
    }

  return (
    <>
        <Grid gutter='xs'>
            <Grid.Col span={{lg:3, md:6}}>
              <Select label='Role' data={state?.master != null ? state?.master.userType : []} size="xs" clearable 
              value={state?.filter.m_user_type_id} onChange={(value) => handleChange('m_user_type_id', value)}/>
            </Grid.Col>
            <Grid.Col span={{lg:3, md:6}}>
              <Select label='Department' data={state?.master != null ? state?.master.department : []} size="xs" clearable
              value={state?.filter.m_department_id} onChange={(value) => {
                dispatch({type:"filter", payload:{key:'m_designation_id',value:null}});
                handleChange('m_department_id', value);}}/>
            </Grid.Col>
            {
                designation != null && <Grid.Col span={{lg:3, md:6}}>
                <Select label='Designation' data={designation} size="xs" clearable 
                value={state?.filter.m_designation_id} onChange={(value) => handleChange('m_designation_id', value)}/>
              </Grid.Col>
            }
            <Grid.Col span={{lg:3, md:6}}>
              <Select label='Status' data={state?.master != null ? state?.master.employeeStatus : []} size="xs" clearable
              value={state?.filter.m_employee_status_id} onChange={(value) => handleChange('m_employee_status_id', value)}/>
            </Grid.Col>
        </Grid>
    </>
  )
}

export default Filter