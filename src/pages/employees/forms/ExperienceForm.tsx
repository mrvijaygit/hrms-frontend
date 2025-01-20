import { Box, Button, Grid, Group, Paper, Table, TextInput } from "@mantine/core"
import { useForm } from '@mantine/form';
import {FaFloppyDisk, FaTrash, FaXmark } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { DatePickerInput } from '@mantine/dates';
import type { ExperienceType } from "../../../types/EmployeeForm";
import { alert } from "../../../utils/Alert";
import { protectedApi } from "../../../utils/ApiService";
import { UseEmployeeForm } from "../../../contextapi/EmployeeFormContext";
import { useEffect, useState } from "react";
function ExperienceForm() {

    const {state, dispatch} = UseEmployeeForm();
    const [trigger, setTrigger] = useState<Boolean>(false);

    const form = useForm<ExperienceType>({
        initialValues: {
            employee_experience_id:-1,
            previous_job_title: '',
            previous_company_name: '',
            employment_date:[null, null],
            previous_job_location: ''
        },
        validate: {
            previous_job_title:(value) => (value.trim().length > 0 ? null : 'Required'),
            previous_company_name:(value) => (value.trim().length > 4 ? null : 'Required'),
            employment_date:(value) => (value[0] != null ? null : 'Required'),
            previous_job_location:(value) => (value.trim().length > 4 ? null : 'Required')
        },
    });

    useEffect(()=>{
        if(state?.user_login_id > 0){
            (async()=>{
                try{
                    let response = await protectedApi.get("/user/experience",{
                        params:{
                            user_login_id:state.user_login_id
                        }
                    });
                   dispatch({type:'setEditFormData', payload:{key:'experience', value:response.data}})
                }
                catch(err:any){
                    alert.error(err);
                }
            })();
        }
    },[trigger]);

    const handleSubmit = async(values:ExperienceType)=>{
        try{
            let obj = {...values,user_login_id:state?.user_login_id};
            let response = await protectedApi.post('/user/saveExperience', JSON.stringify(obj));
            alert.success(response.data.msg).then(()=>{
                form.reset();
                setTrigger((prev) => prev == false ? true : false);
            });
        }
        catch(error:any){
            alert.error(error);
        }
    }

    const handleEdit = (id:number) =>{
        if(state?.experience != null){
            let x = state?.experience.filter(obj => obj.employee_experience_id == id)[0];
            if(x.start_date && x.end_date){
                form.setValues({...x, employment_date:[new Date(x.start_date), new Date(x.end_date)]})
            }
        }
    }

    const handleDelete = (id:number) =>{
        try{
          alert.question("Do you Want to delete this record").then(async(res)=>{
            if(res.isConfirmed){
              let promise = await protectedApi.post("/user/saveExperience", JSON.stringify({"employee_experience_id":id, "is_deleted":1}));
              alert.success(promise.data.msg);
              setTrigger((prev) => (prev == false) ? true : false);
            }
          });
        }
        catch(error:any){
          alert.error(error);
        }
    }

    const handleClearReset = () =>{
        if(state?.user_login_id > 0 &&  form.values.employee_experience_id != -1){
            handleEdit(form.values.employee_experience_id);
        }
        else{
          form.reset();
        }
      } 

    return (
        <>
            <Box component="form" onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <Grid gutter='sm'>
                    <Grid.Col span={{md:6}}>
                        <TextInput label="Previous Job Title" maxLength={30} {...form.getInputProps('previous_job_title')}/>
                    </Grid.Col>
                    <Grid.Col span={{md:6}}>
                        <TextInput label="Previous Company Name" maxLength={50} {...form.getInputProps('previous_company_name')}/>
                    </Grid.Col>
                    <Grid.Col span={{md:6}}>
                        <DatePickerInput type="range" label="Employment Date Range" {...form.getInputProps('employment_date')}/>
                    </Grid.Col>
                    <Grid.Col span={{md:6}}>
                        <TextInput label="Previous Job Location" maxLength={30} {...form.getInputProps('previous_job_location')}/>
                    </Grid.Col>
                    <Grid.Col span={{base:12}}>
                        <Group justify='flex-end' gap='sm'>
                            <Button leftSection={<FaXmark/>} color='dark.6' type='button' onClick={() => handleClearReset()}>{form.values.employee_experience_id == -1 ? 'Clear' : 'Reset'}</Button>
                            <Button leftSection={<FaFloppyDisk/>} type='submit'>{form.values.employee_experience_id == -1 ? 'Save' : 'Update'}</Button> 
                        </Group>
                    </Grid.Col>
                </Grid>
            </Box>

            <Paper p='xs' shadow="xs" mt='sm'>
                <Table>
                    <Table.Thead bg='blue' c='white'>
                        <Table.Tr>
                            <Table.Th style={{ width: '40px' }}>#</Table.Th>
                            <Table.Th>Job Title</Table.Th>
                            <Table.Th>Company Name</Table.Th>
                            <Table.Th>Start Date</Table.Th>
                            <Table.Th>End Date</Table.Th>
                            <Table.Th>Location</Table.Th>
                            <Table.Th style={{ width: '160px' }} ta='center'>Action</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {
                            state?.experience != null && <>
                                {
                                    state?.experience.map((item)=>{
                                        return    <Table.Tr key={item.employee_experience_id}>
                                        <Table.Td>{item.s_no}</Table.Td>
                                        <Table.Td>{item.previous_job_title}</Table.Td>
                                        <Table.Td>{item.previous_company_name}</Table.Td>
                                        <Table.Td>{item.start_date}</Table.Td>
                                        <Table.Td>{item.end_date}</Table.Td>
                                        <Table.Td>{item.previous_job_location}</Table.Td>
                                        <Table.Td>
                                            <Group gap='xs' justify="center">
                                                <Button variant="light" onClick={()=>handleEdit(item.employee_experience_id)}><FaEdit /></Button>
                                                <Button variant="light" color="red" onClick={()=>handleDelete(item.employee_experience_id)}><FaTrash /></Button>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                    })
                                }
                            </>
                        }
                     

                    </Table.Tbody>
                </Table>
            </Paper>
        </>
    )
}

export default ExperienceForm