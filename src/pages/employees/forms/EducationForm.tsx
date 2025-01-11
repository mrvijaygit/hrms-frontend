import { Box, Button, Grid, Group, TextInput, NumberInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import { FaFloppyDisk, FaXmark } from "react-icons/fa6";
import { EducationType } from "../../../types/EmployeeForm";
import { protectedApi } from "../../../utils/ApiService";
import { alert } from "../../../utils/Alert";
import { UseEmployeeForm } from "../../../contextapi/EmployeeFormContext";
import { useEffect } from "react";

function EducationForm() {
   const {state, dispatch} = UseEmployeeForm();
    const form = useForm<EducationType>({
      initialValues: {
        degree_name:'',
        field_of_study: '',
        institution_name: '',
        institution_location: '',
        graduation_year: "", 
        cgpa: "", 
      },
      validate: {
        degree_name:(value) => (value.trim().length > 0 ? null : 'Required'),
        field_of_study:(value) => (value.trim().length > 4 ? null : 'Required'),
        institution_name:(value) => (value.trim().length > 4 ? null : 'Required'),
        institution_location:(value) => (value.trim().length > 4 ? null : 'Required'),
        graduation_year:(value) => (String(value).trim().length == 4 ? null : 'Required'),
        cgpa:(value) => (String(value).trim().length > 0 ? null : 'Required'),
      },
    
    });

    const handleSubmit = async(values:EducationType)=>{
        try{
          let obj = {
            ...values,
            user_login_id:state?.user_login_id,
            employee_education_id:state?.employee_education_id
          }
          let response = await protectedApi.post('/user/saveEducation', JSON.stringify(obj));
          alert.success(response.data.msg).then(()=>{
            dispatch({"type":"setPrimaryKey","payload":{...state, employee_education_id:response.data.employee_education_id}});
          });
        }
        catch(error:any){
          alert.error(error);
        }
    }

    const update = () =>{
      if(state?.education != null){
        form.setFieldValue("degree_name", state.education.degree_name);
        form.setFieldValue("institution_name", state.education.institution_name);
        form.setFieldValue("institution_location", state.education.institution_location);
        form.setFieldValue("field_of_study", state.education.field_of_study);
        form.setFieldValue("cgpa", state.education.cgpa);
        form.setFieldValue("graduation_year", state.education.graduation_year);
      }
    }

    useEffect(()=>{
        if(state?.user_login_id > 0 && state?.isEdit == true && state?.education != null){
          dispatch({type:'setPrimaryKey',payload:{...state,
            employee_education_id:state?.education.employee_education_id,
          }});
          update();
        }
    },[state?.education]);

    const handleClearReset = () =>{
      if(state?.user_login_id > 0 && state.isEdit && state?.education != null){
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
            <Grid.Col span={{lg:2, md:3}}>
              <TextInput label="Degree" maxLength={10} {...form.getInputProps('degree_name')}/>
            </Grid.Col>
            <Grid.Col span={{lg:10, md:9}}>
              <TextInput label="Field of Study" maxLength={100} {...form.getInputProps('field_of_study')}/>
            </Grid.Col>
            <Grid.Col span={{base:12}}>
              <TextInput label="Institution/University Name" maxLength={100} {...form.getInputProps('institution_name')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <TextInput label="Location of Institution" maxLength={50} {...form.getInputProps('institution_location')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="Graduation Year" minLength={4} maxLength={4} {...form.getInputProps('graduation_year')}/>
            </Grid.Col>
            <Grid.Col span={{xl:3, lg:4, md:6}}>
              <NumberInput label="CGPA/Percentage"  maxLength={5} min={10} max={100} {...form.getInputProps('cgpa')}/>
            </Grid.Col>
            <Grid.Col span={{base:12}}>
              <Group justify='flex-end' gap='sm'>
                <Button leftSection={<FaXmark/>} color='red' type='button' onClick={() => handleClearReset()}>{state?.employee_education_id == -1 ? 'Clear' : 'Reset'}</Button>
                <Button leftSection={<FaFloppyDisk/>} color='green' type='submit'>{state?.employee_education_id == -1 ? 'Save' : 'Update'}</Button> 
              </Group>
            </Grid.Col>
          </Grid>
        </Box>
      </>
    )
  }
  
  export default EducationForm