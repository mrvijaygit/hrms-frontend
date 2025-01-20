import { Box, Button, Grid, Group, NumberInput} from "@mantine/core"
import { useForm } from '@mantine/form';
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { SalaryType } from "../../../types/EmployeeForm";
import { UseEmployeeForm } from "../../../contextapi/EmployeeFormContext";
import { protectedApi } from "../../../utils/ApiService";
import { alert } from "../../../utils/Alert";
import { useEffect } from "react";

function SalaryForm() {
    const {state, dispatch} = UseEmployeeForm();
    const form = useForm<SalaryType>({
      initialValues: {
        basic_salary:'',
        house_rent_allowance:'',
        medical_allowance:'',
        transport_allowance:'',
        other_allowance:'',
        tax:'',
        other_deduction:'',
      },
      validate: {
        basic_salary:(value) => (String(value).length > 0 ? null : 'Required'),
        house_rent_allowance:(value) => (String(value).length > 0 ? null : 'Required'),
        medical_allowance:(value) => (String(value).length > 0 ? null : 'Required'),
        transport_allowance:(value) => (String(value).length > 0 ? null : 'Required'),
        other_allowance:(value) => (String(value).length > 0 ? null : 'Required'),
        tax:(value) => (String(value).length > 0 ? null : 'Required'),
        other_deduction:(value) => (String(value).length > 0 ? null : 'Required'),
      },
    });

    const handleSubmit = async(values:SalaryType)=>{
      try{
        let obj = {
          ...values,
          user_login_id:state?.user_login_id,
          employee_salary_id:state?.employee_salary_id
        }
        let response = await protectedApi.post('/user/saveSalary', JSON.stringify(obj));
        alert.success(response.data.msg).then(()=>{
          dispatch({"type":"setPrimaryKey","payload":{ ...state,
            employee_salary_id:response.data.employee_salary_id
          }});
        });
      }
      catch(error:any){
        alert.error(error);
      }
    }

    const update = () =>{
      if(state?.salary != null){
        form.setFieldValue('basic_salary', state.salary.basic_salary);
        form.setFieldValue('house_rent_allowance', state.salary.house_rent_allowance);
        form.setFieldValue('medical_allowance', state.salary.medical_allowance);
        form.setFieldValue('transport_allowance', state.salary.transport_allowance);
        form.setFieldValue('other_allowance', state.salary.other_allowance);
        form.setFieldValue('tax', state.salary.tax);
        form.setFieldValue('other_deduction', state.salary.other_deduction);
      }
    }

    useEffect(()=>{
      if(state?.user_login_id > 0 && state.isEdit && state?.salary != null){
        dispatch({type:'setPrimaryKey',payload:{...state,
          employee_salary_id:state?.salary.employee_salary_id,
        }});
        update();
      }
    },[state?.salary]);

    const handleClearReset = () =>{
      if(state?.user_login_id > 0 && state.isEdit && state?.salary != null){
        update();
      }
      else{
        form.reset();
      }
    } 

    return (
      <>
        <Box component="form" onSubmit={form.onSubmit((values)=> handleSubmit(values))}>
          <Grid gutter='sm' align="flex-end">
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Basic Salary" maxLength={10} {...form.getInputProps('basic_salary')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="House Rent Allowance" maxLength={10} {...form.getInputProps('house_rent_allowance')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Medical Allowance" maxLength={10} {...form.getInputProps('medical_allowance')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Transport Allowance" maxLength={10} {...form.getInputProps('transport_allowance')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Other Allowance" maxLength={10} {...form.getInputProps('other_allowance')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Tax" maxLength={10} {...form.getInputProps('tax')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Other Deduction" maxLength={10} {...form.getInputProps('other_deduction')}/>
            </Grid.Col>
            <Grid.Col span={{base:12}}>
              <Group justify='flex-end' gap='sm'>
                <Button leftSection={<FaXmark/>} color='dark.6' type='button' onClick={() => handleClearReset()}>{state?.employee_salary_id == -1 ? 'Clear' : 'Reset'}</Button>
                <Button leftSection={<FaFloppyDisk/>} type='submit'>{state?.employee_salary_id == -1 ? 'Save' : 'Update'}</Button> 
              </Group>
            </Grid.Col>
          </Grid>
        </Box>
      </>
    )
  }
  
  export default SalaryForm