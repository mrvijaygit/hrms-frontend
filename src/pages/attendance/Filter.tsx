import { Grid, Select } from "@mantine/core"
import { useEffect } from "react"
import { protectedApi } from "../../utils/ApiService";
import { UseAttendance } from "../../contextapi/AttendanceContent";
import { DatePickerInput } from "@mantine/dates";
import { alert } from "../../utils/Alert";

function Filter() {

    const {state, dispatch} = UseAttendance();

  useEffect(()=>{
    (async()=>{
        try{
          let resolve = await protectedApi.get('/master/attendanceStatus'); 
          dispatch({type:"setStatus", payload:resolve.data});
        }
        catch(err){
            alert.error('Master Error');
        }
    })();
  },[]);


  return (
    <>
        <Grid gutter='xs'>
            <Grid.Col span={{lg:3, md:6}}>
              <DatePickerInput label="Attendance Date" size="xs" maxDate={new Date()} clearable 
              value={state.filter.attendance_date} 
              onChange={(value) => dispatch({type:"filter", payload:{'key':"attendance_date",'value':value}})}/>
            </Grid.Col>
            <Grid.Col span={{lg:3, md:6}}>
              <Select label='Status' data={state?.status != null ? state?.status : []} size="xs" clearable
              value={state?.filter.m_attendance_status_id} 
              onChange={(value) => dispatch({type:"filter", payload:{'key':"m_attendance_status_id",'value':value}})}/>
            </Grid.Col>
        </Grid>
    </>
  )
}

export default Filter