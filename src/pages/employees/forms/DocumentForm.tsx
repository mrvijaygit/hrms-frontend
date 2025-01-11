import { Box, Button, CloseButton, Flex, Grid, Group, Image, Paper, Select, Table, Text} from "@mantine/core"
import {Dropzone, PDF_MIME_TYPE, FileWithPath} from "@mantine/dropzone";
import { useForm } from '@mantine/form';
import { FaEye, FaFloppyDisk, FaTrash, FaXmark } from "react-icons/fa6";
import "@mantine/dropzone/styles.css";
import { FaEdit } from "react-icons/fa";
import { UseEmployeeForm } from "../../../contextapi/EmployeeFormContext";
import { DocumentType } from "../../../types/EmployeeForm";
import pdf from "../../../assets/images/pdf.png";

function DocumentForm() {
  const {state} = UseEmployeeForm();

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
      let formData = new FormData();
      formData.append('file', values.files[0]);
      formData.append('employee_document_id', String(values.employee_document_id));
      formData.append('document_id', String(form.values.document_id));
      formData.append('user_login_id', String(state.user_login_id));
    
      // let response = await protectedApi.post('/user/saveDocument/', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
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
                  <Button leftSection={<FaXmark/>} color='red' onClick={() => form.reset()}>Clear</Button>
                  <Button leftSection={<FaFloppyDisk/>} color='green' type='submit'>Save</Button>
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
                            <Table.Tr>
                                <Table.Td>1</Table.Td>
                                <Table.Td>Aadhaar card</Table.Td>
                                <Table.Td>
                                    <Group gap='xs' justify="center">
                                        <Button variant="light" color="green"><FaEye/></Button>
                                        <Button variant="light"><FaEdit/></Button>
                                        <Button variant="light" color="red"><FaTrash/></Button>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
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