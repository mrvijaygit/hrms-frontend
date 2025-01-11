import { Box, Button, Grid, Group, TextInput, NumberInput, Select } from "@mantine/core"
import { useForm } from '@mantine/form';
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { UseEmployeeForm } from "../../../contextapi/EmployeeFormContext";
import { BankType } from "../../../types/EmployeeForm";
import { protectedApi } from "../../../utils/ApiService";
import { alert } from "../../../utils/Alert";
import { useEffect } from "react";
function BankForm() {

    const {state, dispatch} = UseEmployeeForm();

    const form = useForm<BankType>({
      initialValues: {
        m_bank_id:null,
        branch_name: '', 
        account_holder_name: '',
        account_number: '',
        account_type: null,
        ifsc_code: '', 
      },
      validate: {  
        m_bank_id:(value) => (value != null ? null : 'Required'),
        branch_name:(value) => (value.length > 3 ? null : 'Required'),
        account_holder_name:(value) => (value.length > 3 ? null : 'Required'),
        account_number:(value) => (String(value).length  > 0 ? null : 'hi'),
        account_type:(value) => (value != null ? null : 'Required'),
        ifsc_code:(value) => (value.length > 10 ? null : 'Required'),
      },
    });

    const handleSubmit = async(values:BankType)=>{
      try{
        let obj = {
          ...values,
          user_login_id:state?.user_login_id,
          employee_bank_id:state?.employee_bank_id
        }
        let response = await protectedApi.post('/user/saveBankDetails', JSON.stringify(obj));
        alert.success(response.data.msg).then(()=>{
          dispatch({"type":"setPrimaryKey","payload":{ ...state,employee_bank_id:response.data.employee_bank_id}});
        });
      }
      catch(error:any){
        alert.error(error);
      }
    }

    const update = () =>{
      if(state?.bank != null){
        form.setFieldValue('m_bank_id', String(state.bank.m_bank_id));
        form.setFieldValue('branch_name', state.bank.branch_name);
        form.setFieldValue('account_holder_name', state.bank.account_holder_name);
        form.setFieldValue('account_number', state.bank.account_number);
        form.setFieldValue('account_type', String(state.bank.account_type));
        form.setFieldValue('ifsc_code', state.bank.ifsc_code); 
      }
    }

    useEffect(()=>{
      if(state?.user_login_id > 0 && state.isEdit && state?.bank != null){
        dispatch({type:'setPrimaryKey',payload:{...state,
          employee_bank_id:state?.bank.employee_bank_id,
        }});
        update(); 
      }
    },[state?.bank]);

    const handleClearReset = () =>{
      if(state?.user_login_id > 0 && state.isEdit && state?.bank != null){
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
            <Grid.Col span={{lg:6}}>
              <Select data={state?.master != null ? state?.master.banks : []}  label="Bank Name" {...form.getInputProps('m_bank_id')}/>
            </Grid.Col>
            <Grid.Col span={{lg:6}}>
              <TextInput label="Branch Name" maxLength={100} {...form.getInputProps('branch_name')}/>
            </Grid.Col>
            <Grid.Col span={{md:6}}>
              <TextInput label="Account Holder Name" maxLength={50} {...form.getInputProps('account_holder_name')}/>
            </Grid.Col>
            <Grid.Col span={{md:6}}>
              <NumberInput label="Account Number" {...form.getInputProps('account_number')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
                <Select data={state?.master != null ? state?.master.bankAccountType : []}  label="Account Type" {...form.getInputProps('account_type')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <TextInput label="IFSC Code" maxLength={11} {...form.getInputProps('ifsc_code')}/>
            </Grid.Col>
            <Grid.Col span={{base:12}}>
              <Group justify='flex-end' gap='sm'>
                <Button leftSection={<FaXmark/>} color='red' type='button' onClick={() => handleClearReset()}>{state?.employee_bank_id == -1 ? 'Clear' : 'Reset'}</Button>
                <Button leftSection={<FaFloppyDisk/>} color='green' type='submit'>{state?.employee_bank_id == -1 ? 'Save' : 'Update'}</Button> 
              </Group>
            </Grid.Col>
          </Grid>
        </Box>
      </>
    )
  }
  
  export default BankForm