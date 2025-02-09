import { Box, Button, CloseButton, Flex, Grid, Group, Image, Paper, Select, Table, Text} from "@mantine/core"
import {Dropzone, PDF_MIME_TYPE, FileWithPath} from "@mantine/dropzone";
import { useForm } from '@mantine/form';
import { FaEye, FaFloppyDisk, FaTrash, FaXmark } from "react-icons/fa6";
import "@mantine/dropzone/styles.css";
import { FaEdit } from "react-icons/fa";
import { UseEmployeeForm } from "../../../contextapi/EmployeeFormContext";
import { DocumentType } from "../../../types/EmployeeForm";
import pdf from "../../../assets/images/pdf.png";
import { protectedApi } from "../../../utils/ApiService";
import { alert } from "../../../utils/Alert";
import { useEffect, useState } from "react";

function DocumentForm() {
  const {state, dispatch} = UseEmployeeForm();
  const [trigger, setTrigger] = useState<Boolean>(false);
  
  const form = useForm<DocumentType>({
    initialValues: {
      employee_document_id:-1,
      document_id:null,
      files:[]
    },
    validate: {
      document_id:(value) =>((value != null && value.length > 0) ? null : "Required"),
      files:(value) =>(value.length > 0 ? null : "Required"),
    },
  });

  const addFiles = (newFile:FileWithPath[]) => {
    console.log(newFile);
    form.setFieldValue('files', newFile);
  }

  const removeFile = () => {
    form.setFieldValue('files', []);
  }

  const previews = form.values.files.map((file, index) => {
    return <Paper p='xs' w={{md:'50%'}} radius='sm' shadow="xs" key={index}>
          <Flex align='center' gap='xs'>
            <Image src={pdf} fit='contain' w='40px' height='40px' />
            <Group align="center" gap='xs' flex={1}>
                <Box flex={1}>
                    <Text size="xs" truncate>{file.name}</Text>
                    <Text fz='xs'>{Math.round(file.size * 0.001)} kb</Text>
                </Box>
                <CloseButton radius='0' onClick={() => removeFile()} />
            </Group>
    </Flex></Paper>;
  });

  const handleSubmit = async(values:DocumentType) => {
    try{
      let formData = new FormData();
      formData.append('employee_document_id', String(values.employee_document_id));
      formData.append('document_id', String(form.values.document_id));
      formData.append('user_login_id', String(state.user_login_id));
      formData.append('file', values.files[0]);

      let response = await protectedApi.post('/user/saveDocument/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert.success(response.data.msg).then(()=>{
        form.reset();
        setTrigger((prev) => prev == false ? true : false);
      });
    }
    catch(err:any){
      alert.error(err);
    }
 
  }


  useEffect(()=>{
      if(state?.user_login_id > 0){
          (async()=>{
              try{
                  let response = await protectedApi.get("/user/documents",{
                      params:{
                          user_login_id:state.user_login_id
                      }
                  });
                  dispatch({type:'setEditFormData', payload:{key:'documents', value:response.data}})
              }
              catch(err:any){
                  alert.error(err);
              }
          })();
      }
  },[trigger]);

  const handleEdit =  (id:number) =>{
    if(state?.documents != null){
        let x = state?.documents.filter(obj => obj.employee_document_id == id)[0];
        form.setValues({
          employee_document_id:x.employee_document_id,
          document_id:String(x.document_id),
        });

        fetch(x.file_path,{mode:'no-cors'}).then((res) => res.blob()).then((blob) =>{
           let file = new File([blob], x.file_name, {type: "application/pdf"});
           addFiles([file]);
        });

    }
  }

  const handleDelete = (id:number) =>{
      try{
        alert.question("Do you Want to delete this record").then(async(res)=>{
          if(res.isConfirmed){
            let promise = await protectedApi.post("/user/saveDocument", JSON.stringify({"employee_document_id":id, "is_deleted":1}));
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
      if(state?.user_login_id > 0 &&  form.values.employee_document_id != -1){
        handleEdit(form.values.employee_document_id);
      }
      else{
        form.reset();
      }
  } 

  return (
    <>
      <Box component="form" onSubmit={form.onSubmit((values)=> handleSubmit(values))}>
        <Grid gutter='sm'>
          <Grid.Col span={{lg:6}}>
            <Select label="Document Name" data={state?.master != null ? state?.master.documentNames : []} {...form.getInputProps('document_id')} w={{lg:'50%'}}/>
            <Dropzone accept={PDF_MIME_TYPE} onDrop={addFiles} {...form.getInputProps('files')} mt='sm'>
                  <Text ta='center'>Upload your file as a PDF.</Text>
            </Dropzone>
            {
              form.errors['files'] && <Text c='red.9' fz='xs'>{ form.errors['files']}</Text>
            }
            {previews}
            <Group justify='flex-end' gap='sm' mt='sm'>
                <Button leftSection={<FaXmark/>} color='dark.6' onClick={() => handleClearReset()}>{form.values.employee_document_id == -1 ? 'Clear' : 'Reset'}</Button>
                <Button leftSection={<FaFloppyDisk/>} type='submit'>{form.values.employee_document_id == -1 ? 'Save' : 'Update'}</Button>
            </Group>
          </Grid.Col>
          <Grid.Col span={{md:6}}>
              <Paper p='xs' shadow="xs">
                  <Table>
                      <Table.Thead bg='blue' c='white'>
                          <Table.Tr>
                              <Table.Th style={{width:'40px'}}>#</Table.Th>
                              <Table.Th>Document Name</Table.Th>
                              <Table.Th style={{width:'160px'}} ta='center'>Action</Table.Th>
                          </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {
                          state.documents != null && <>
                              {
                                state?.documents.map((item)=>{
                                    return  <Table.Tr key={item.s_no}>
                                    <Table.Td>{item.s_no}</Table.Td>
                                    <Table.Td>{item.document_name}</Table.Td>
                                    <Table.Td>
                                        <Group gap='xs' justify="center">
                                            <Button variant="light" color="green" component="a" target="_blank" href={item.file_path}><FaEye/></Button>
                                            <Button variant="light" onClick={() => handleEdit(item.employee_document_id)}><FaEdit/></Button>
                                            <Button variant="light" color="red" onClick={() => handleDelete(item.employee_document_id)}><FaTrash/></Button>
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
          </Grid.Col>
        </Grid>
      </Box>
    </>
  )
}
  
  export default DocumentForm