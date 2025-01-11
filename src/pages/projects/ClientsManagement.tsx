import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Drawer, Grid, Group, NumberInput, Pagination, Paper,Select,Text,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseClients } from '../../contextapi/ClientsContext';
import type { dataType } from '../../types/Clients';


type sortingType = { direction: string, accessor: string};

export default function LeaveType() {
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseClients();
  const [sort, setSort] = useState({} as sortingType);

  const form = useForm<dataType>({
    initialValues:{
      client_id:-1,
      client_name:"",
      contact_person_name:"",
      contact_no:"",
      email_id:""
    },
    validate:{
      client_name: (value) => (value.trim().length > 4 ? null : "Required"),
      contact_person_name: (value) => (value.trim().length > 4 ? null : "Required"),
      contact_no: (value) => (String(value).trim().length == 10 ? null : "Required"),
      email_id: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    }
  });

  useLayoutEffect(() => {
    const calculateTableHeight = () => {
      let h1 = 0;
      if (topRef.current) {
        h1 =  topRef.current.clientHeight + 58 + 56; 
        if(bottomRef.current){
          h1 += bottomRef.current.clientHeight;
        }
        const height = window.innerHeight - h1;
        setTableHeight(height);
      }
    };
    calculateTableHeight();

    window.addEventListener('resize', calculateTableHeight);

    return () => window.removeEventListener('resize', calculateTableHeight);
  }, []);

  useEffect(()=>{
    (async()=>{
      try{
        let response = await protectedApi.get("/project/clients", {
          params:{
            currentpage:state.page,
            postperpage:Number(state.show),
            sorting:sort
          }
        });
        dispatch({type:"response", payload:{
          data:response.data.data,
          totalRecord:response.data.totalRecord
        }});
      }
      catch(err){

      }
    })()
  
  },[state.page, state.show, triggerApi, sort]);

  const handleEdit = async(id:number) =>{
      try{
        let response = await protectedApi.get("/project/viewClient", {
          params:{
            "client_id":id
          }
        });
        let obj = {...response.data[0]};
        dispatch({type:"isUpdated", payload:{is_updated:true, editData:obj}});
        form.setValues(obj);
        open();
      }
      catch(error:any){
        alert.error(error);
      }
  }

  const handleClearReset = () =>{
    if(state.is_updated && state.editData != null){
      form.setValues({...state.editData});
    }
    else{
      form.reset();
    }
  } 

  const handleSubmit = async(values:dataType) =>{
    try{
      let promise = await protectedApi.post("/project/saveClient", JSON.stringify(values));
      alert.success(promise.data.msg);
      form.reset();
      dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});
      close();
      setTriggerApi((prev) => (prev == false) ? true : false);
    }
    catch(error:any){
      alert.error(error);
    }
  }

  const handleDelete = (id:number) =>{
    try{
      alert.question("Do you Want to delete this record").then(async(res)=>{
        if(res.isConfirmed){
          let promise = await protectedApi.post("/project/saveClient", JSON.stringify({"client_id":id, "is_deleted":1}));
          alert.success(promise.data.msg);
          setTriggerApi((prev) => (prev == false) ? true : false);
        }
      });
    }
    catch(error:any){
      alert.error(error);
    }
  }

  const columns:Column<dataType>[] = useMemo(() => [
    {
      Header:'#',
      accessor:'s_no',
      width: 40,
      disableSortBy:true
    },
    {
      Header:'Name',
      accessor:'client_name',
      width:"auto",
      sortDirection: sort.accessor === 'client_name' ? sort.direction : 'none'
    },
    {
      Header:'Contact Person',
      accessor:"contact_person_name",
      width: 250,
      sortDirection: sort.accessor === 'contact_person_name' ? sort.direction : 'none'
    },
    {
      Header:'Contact No.',
      accessor:"contact_no",
      width: 150,
      sortDirection: sort.accessor === 'contact_no' ? sort.direction : 'none'
    },
    {
      Header:'Email ID',
      accessor:"email_id",
      width: 250,
      sortDirection: sort.accessor === 'email_id' ? sort.direction : 'none'
    },
    {
      Header:'Action',
      width: 100,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.client_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.client_id)}><FaTrash/></Button>
          </Group>;
      }
    },
  ], [sort]);

  const data:dataType[] = useMemo(()=>state.data, [state.data]);

  const columnHeaderClick = async (column:any) => {
 
    switch (column.sortDirection) {
      case 'none':
        setSort({ direction: 'ASC', accessor: column.id });
        break;
      case 'ASC':
        setSort({ direction: 'DESC', accessor: column.id });
        break;
      case 'DESC':
        setSort({ direction: 'none', accessor: column.id });
        break;
    }
  };

  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs' ref={topRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Title order={6} tt='uppercase'>Clients</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Client</Button>
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow="xs" my='xs'>
        <Box style={{'overflow':'auto'}} h={tableHeight}>
            <BasicTable columns={columns} data={data} onHeaderClick= {columnHeaderClick}/>
        </Box>
      </Paper>
      <Paper p='xs' shadow="xs" ref={bottomRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Select data={['10','25','50','100']} size="xs" value={state.show} onChange={(value) => dispatch({type:'setShow', payload:value})} w={60}/>
          <Text>{state.info}</Text>
          <Pagination total={state.totalPage} size='sm' value={state.page} onChange={(value) => dispatch({type:'setPage', payload:value})}/>
        </Group>
      </Paper>
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Client"  : "Add Client"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Client Name" maxLength={50} {...form.getInputProps("client_name")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput label="Contact Person Name" maxLength={30} {...form.getInputProps("contact_person_name")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput label="Email Id" maxLength={50} {...form.getInputProps("email_id")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <NumberInput label="Contact Number" minLength={10} maxLength={10} {...form.getInputProps("contact_no")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Group justify="flex-end" gap='sm'>
                  <Button  color="red" leftSection={<FaXmark/>} onClick={()=>handleClearReset()}>{state.is_updated ? "Reset"  : "Clear"}</Button>
                  <Button type='submit' color="green" leftSection={<FaFloppyDisk/>}>{state.is_updated ? "Update"  : "Save"}</Button>
                </Group>
              </Grid.Col>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}
