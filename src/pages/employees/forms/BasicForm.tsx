import { Box, Button, Grid, Group, Select, TextInput, NumberInput, Textarea, Divider, ComboboxData } from "@mantine/core"
import { useForm} from '@mantine/form';
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { DatePickerInput } from '@mantine/dates';
import { BasicType } from "../../../types/EmployeeForm";
import { UseEmployeeForm } from "../../../contextapi/EmployeeFormContext";
import {useState, useEffect } from "react";
import { protectedApi } from "../../../utils/ApiService";
import { alert } from "../../../utils/Alert";

function BasicForm() {
    const {state, dispatch} = UseEmployeeForm();
    const [designation, setDesignation] = useState<ComboboxData>([]);
    const [reportingTo, setReportingTo] = useState<ComboboxData>([]);

    const form = useForm<BasicType>({
      initialValues: {
        emp_code: '',
        first_name: '',
        last_name: '',
        m_gender_id:null,
        date_of_birth:null,
        m_blood_group_id:null,
        email_id:'',
        phone_number:'',
        aadhaar_no:'',
        pan_card_no:'',
        m_user_type_id:null,
        reporting_id:null,
        m_department_id:null,
        m_designation_id:null,
        m_employee_status_id:null,
        date_of_joining:null,
        permant_address:'',
        current_address:''
      },
      validate:{
        emp_code:(value) => (value.length > 0 ? null : 'Required'),
        first_name:(value) => (value.length > 0 ? null : 'Required'),
        last_name: (value) => (value.length > 0 ? null : 'Required'),
        m_gender_id:(value) => (value != null ? null : 'Required'),
        date_of_birth:(value) => (value != null ? null : 'Required'),
        m_blood_group_id:(value) => (value != null ? null : 'Required'),
        email_id:(value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        phone_number:(value) => (String(value).length == 10 ? null : 'Required'),
        aadhaar_no:(value) => (String(value).length == 12 ? null : 'Required'),
        pan_card_no:(value) => (String(value).length == 10  ? null : 'Required'),
        m_user_type_id:(value) => (value != null ? null : 'Required'),
        m_department_id:(value) => (value != null ? null : 'Required'),
        m_designation_id:(value) => (value != null ? null : 'Required'),
        m_employee_status_id:(value) => (value != null ? null : 'Required'),
        date_of_joining:(value) => (value != null ? null : 'Required'),
        permant_address:(value) => (value.trim().length > 0 ? null : 'Required'),
        current_address:(value) => (value.trim().length > 0 ? null : 'Required'),
      },
    });

    useEffect(()=>{
      let m_department_id = form.values.m_department_id;
      if(m_department_id){
        (async()=>{
            try{
              let response = await protectedApi.get(`/master/designation`, {
                "params":{"m_department_id":m_department_id}
              });
              setDesignation(response.data);
            }
            catch(err:any){
              alert.error(err)
            }
        })()
      }
      if(!state.isEdit){
        form.setFieldValue('m_designation_id',null);
      }
      else if(form.values.m_department_id != state.basic?.m_department_id){
        form.setFieldValue('m_designation_id',null);
      }

    },[form.values.m_department_id]);

    useEffect(()=>{
      let m_user_type_id = form.values.m_user_type_id;

      if(m_user_type_id){
        (async()=>{
            try{
              let response = await protectedApi.get(`/master/reportingList`, {
                "params":{"m_user_type_id":m_user_type_id}
              });
              setReportingTo(response.data);
            }
            catch(err:any){
              alert.error(err)
            }
        })()
      }

      if(!state.isEdit){
        form.setFieldValue('reporting_id',null);
      }
      else if(form.values.m_department_id != state.basic?.m_department_id){
        form.setFieldValue('reporting_id',null);
      }

    },[form.values.m_user_type_id]);

    const handleSubmit = async(values:BasicType)=>{
      try{
        let obj = {
          ...values,
          user_login_id:state?.user_login_id,
          employee_id:state?.employee_id
        }
        let response = await protectedApi.post('/user/saveUser', JSON.stringify(obj));
        alert.success(response.data.msg).then(()=>{
          dispatch({"type":"setPrimaryKey","payload":{ ...state,
            user_login_id:response.data.user_login_id,
            employee_id:response.data.employee_id
          }});
        });
      }
      catch(error:any){
        alert.error(error);
      }
    }

    const update = () =>{
      if(state?.basic != null){
        form.setFieldValue('emp_code', state.basic.emp_code);
        form.setFieldValue('first_name', state.basic.first_name);
        form.setFieldValue('last_name', state.basic.last_name);
        form.setFieldValue('m_gender_id', String(state.basic.m_gender_id));
        form.setFieldValue('date_of_birth', new Date(state.basic.date_of_birth));
        form.setFieldValue('m_blood_group_id', String(state.basic.m_blood_group_id));
        form.setFieldValue('email_id', state.basic.email_id);
        form.setFieldValue('phone_number', state.basic.phone_number);
        form.setFieldValue('aadhaar_no', state.basic.aadhaar_no);
        form.setFieldValue('pan_card_no', state.basic.pan_card_no);
        form.setFieldValue('m_user_type_id', String(state.basic.m_user_type_id));
        form.setFieldValue('reporting_id', String(state.basic.reporting_id));
        form.setFieldValue('m_department_id', String(state.basic.m_department_id));
        form.setFieldValue('m_designation_id', String(state.basic.m_designation_id));
        form.setFieldValue('m_employee_status_id', String(state.basic.m_employee_status_id));
        form.setFieldValue('date_of_joining', new Date(state.basic.date_of_joining));
        form.setFieldValue('permant_address', state.basic.permant_address);
        form.setFieldValue('current_address', state.basic.current_address);
      }
    }

    useEffect(()=>{
      if(state?.user_login_id > 0 && state?.isEdit == true && state.basic != null){
        dispatch({type:'setPrimaryKey',payload:{...state, employee_id:state.basic.employee_id}});
        update();
      }
    },[state?.basic?.employee_id]);

    const handleClearReset = () =>{
      if(state?.user_login_id > 0 && state.isEdit && state?.basic != null){
        update();
      }
      else{
        form.reset();
      }
    } 

    return (
      <>
        <Box component="form" onSubmit={form.onSubmit((values)=> handleSubmit(values))}>
          <Grid gutter='sm'>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <TextInput label="Employee Code" maxLength={6} key={form.key('emp_code')} {...form.getInputProps('emp_code')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <TextInput label="First Name" maxLength={100} {...form.getInputProps('first_name')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <TextInput label="Last Name" maxLength={100} {...form.getInputProps('last_name')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <Select data={state?.master != null ? state?.master.gender : []}  label="Gender" {...form.getInputProps('m_gender_id')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <DatePickerInput  label="Date of Birth" {...form.getInputProps('date_of_birth')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <Select data={state?.master != null ? state?.master.bloodGroup : []}  label="Blood Group" {...form.getInputProps('m_blood_group_id')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <TextInput label="Email Id" maxLength={100} {...form.getInputProps('email_id')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Phone Number" maxLength={10} {...form.getInputProps('phone_number')}/>
            </Grid.Col>
          </Grid>
          <Divider variant="dashed" my="sm"/>
          <Grid gutter='sm'>           
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Aadhaar Number" maxLength={12} {...form.getInputProps('aadhaar_no')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <TextInput label="Pan card Number" maxLength={10} {...form.getInputProps('pan_card_no')}/>
            </Grid.Col>
          </Grid>
          <Divider variant="dashed" my="sm"/>

          <Grid gutter='sm'>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <Select data={state?.master != null ? state?.master.userType : []}  label="Role" {...form.getInputProps('m_user_type_id')}/>
            </Grid.Col>
            {
              reportingTo.length > 0 && <Grid.Col span={{xl:3, lg:4, md:6}}>
              <Select data={reportingTo}  label="Reporting To"  {...form.getInputProps("reporting_id")} />
            </Grid.Col>
            }
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <Select data={state?.master != null ? state?.master.department : []}  label="Department"  {...form.getInputProps('m_department_id')} />
            </Grid.Col>
            {
              designation.length > 0 && <Grid.Col span={{xl:3, lg:4, md:6}}>
              <Select data={designation}  label="Designation" {...form.getInputProps('m_designation_id')}/>
            </Grid.Col>
            }
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <Select data={state?.master != null ? state?.master.employeeStatus : []}  label="Status" {...form.getInputProps('m_employee_status_id')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <DatePickerInput  label="Date of Joining" {...form.getInputProps('date_of_joining')}/>
            </Grid.Col>
          </Grid>

          <Divider variant="dashed" my="sm"/>

          <Grid gutter='sm'>
            <Grid.Col span={{lg:6, md:12}}>
              <Textarea  label="Permanent Address" {...form.getInputProps('permant_address')}/>
            </Grid.Col>
            <Grid.Col span={{lg:6, md:12}}>
              <Textarea  label="Current Address" {...form.getInputProps('current_address')}/>
            </Grid.Col>
            <Grid.Col span={{base:12}}>
              <Group justify='flex-end' gap='sm'>
                  <Button leftSection={<FaXmark/>} color='dark.6' type='button' onClick={() => handleClearReset()}>{state?.employee_id == -1 ? 'Clear' : 'Reset'}</Button>
                  <Button leftSection={<FaFloppyDisk/>} type='submit'>{state?.employee_id == -1 ? 'Save' : 'Update'}</Button> 
              </Group>
            </Grid.Col>
          </Grid>
        </Box>
      </>
    )
  }
  
  export default BasicForm