import { Box, Button, Grid, Group, NumberInput,Textarea,TextInput } from "@mantine/core";
import {FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseGoal } from '../../contextapi/GenericContext';
import type { FormType } from '../../types/Goal';
import { DatePickerInput } from '@mantine/dates';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';

export default function Goal() {
  const {state, dispatch}  = UseGoal();
  const location =  useLocation();

  const user_login_id = useAppSelector(state => state?.user.user_login_id);

  const form = useForm<FormType>({
    initialValues:{
        goal_id:-1,
        goal_name:"",
        goal_date:[null, null],
        description:"",
        weightage:0,
        progress:0
    },
    validate:{
        goal_name: (value) => (value.trim().length > 4 ? null : "Required"),
        goal_date:(value) => value[0] != null ? null : "Required",
        description: (value) => (value.trim().length > 4 ? null : "Required"),
        weightage: (value) => (String(value).trim().length > 0 ? null : "Required"),
        progress: (value) => (String(value).trim().length > 0 ? null : "Required"),
    }
  });

  const handleClearReset = () =>{
    if(state.is_updated && state.editData != null){
      form.setValues({...state.editData});
    }
    else{
      form.reset();
    }
  } 

  const handleSubmit = async(values:FormType) =>{
    try{
       let user_id = user_login_id;
      if(location?.state?.user_login_id){
        user_id = location.state.user_login_id;
      }

      let promise = await protectedApi.post("/performance/saveGoal", JSON.stringify({...values, "user_login_id":user_id, "appraisal_cycle_id":1}));
      alert.success(promise.data.msg);
      form.reset();
      dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});
      close();
    //   setTriggerApi((prev) => (prev == false) ? true : false);
    }
    catch(error:any){
      alert.error(error);
    }
  }

  return (
    <>
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Goal" maxLength={100} {...form.getInputProps("goal_name")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerInput type='range' label="Date" {...form.getInputProps("goal_date")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <NumberInput label="Weightage" maxLength={3} min={0} max={100} {...form.getInputProps("weightage")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <NumberInput label="progress" maxLength={3} min={0}  max={100} {...form.getInputProps("progress")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Description" maxLength={255} rows={5} {...form.getInputProps("description")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Group justify="flex-end" gap='sm'>
                  <Button  color="dark.6" leftSection={<FaXmark/>} onClick={()=>handleClearReset()}>{state.is_updated ? "Reset"  : "Clear"}</Button>
                  <Button type='submit' leftSection={<FaFloppyDisk/>}>{state.is_updated ? "Update"  : "Save"}</Button>
                </Group>
              </Grid.Col>
          </Grid>
        </Box>
    </>
  )
}
