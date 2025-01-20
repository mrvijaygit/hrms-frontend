import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Checkbox, Drawer, Grid, Group, Pagination, Paper,Select,Text,Textarea,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseNotice } from '../../contextapi/NoticeContext';
import type { dataType } from '../../types/Notice';
import { DatePickerInput } from '@mantine/dates';


type sortingType = { direction: string, accessor: string};

export default function Notice() {
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseNotice();
  const [sort, setSort] = useState({} as sortingType);

  const form = useForm<dataType>({
    initialValues:{
      notice_id:-1,
      notice_title:'',
      notice_content:'',
      issue_date:null,
      notice_status:null
    },
    validate:{
      notice_title: (value) => (value.trim().length > 2 ? null : "Required"),
      notice_content: (value) => (value.trim().length > 2 ? null : "Required"),
      issue_date: (value) => (value != null ? null : "Required"),
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
        let response = await protectedApi.get("/announcement/notice", {
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
        let response = await protectedApi.get("/announcement/viewNotice", {
          params:{
            "notice_id":id
          }
        });
        let obj = {...response.data[0],notice_status:String(response.data[0]['notice_status']),  issue_date:new Date(response.data[0]['issue_date_display'])};
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
      let promise = await protectedApi.post("/announcement/saveNotice", JSON.stringify(values));
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
          let promise = await protectedApi.post("/announcement/saveNotice", JSON.stringify({"notice_id":id, "is_deleted":1}));
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
      Header:'Title',
      accessor:"notice_title",
      width:200,
      sortDirection: sort.accessor === 'notice_title' ? sort.direction : 'none'
    },
    {
      Header:'Content',
      accessor:"notice_content",
      width: "auto",
      sortDirection: sort.accessor === 'notice_content' ? sort.direction : 'none'
    },
    {
      Header:'Start Date',
      accessor:"issue_date_display",
      headerClassName:"text-center",
      width: 150,
      sortDirection: sort.accessor === 'issue_date_display' ? sort.direction : 'none'
    },
    {
      Header:'Status',
      accessor:"notice_status",
      headerClassName:"text-center",
      width: 120,
      sortDirection: sort.accessor === 'notice_status' ? sort.direction : 'none',
      Cell:({value}) => <Text size="sm" c={String(value) == "Active" ? "green" : "red"}>{value}</Text>
    },
    {
      Header:'Action',
      width: 120,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.notice_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.notice_id)}><FaTrash/></Button>
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
          <Title order={6} tt='uppercase'>Notices</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Notice</Button>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Notice"  : "Add Notice"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Title" maxLength={50} {...form.getInputProps("notice_title")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Notice Content" rows={8} {...form.getInputProps("notice_content")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <DatePickerInput label="Issue Date" {...form.getInputProps("issue_date")}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Checkbox label="Is Active ?"  {...form.getInputProps("notice_status")} />
              </Grid.Col>
              <Grid.Col span={12}>
                <Group justify="flex-end" gap='sm'>
                  <Button  color="dark.6" leftSection={<FaXmark/>} onClick={()=>handleClearReset()}>{state.is_updated ? "Reset"  : "Clear"}</Button>
                  <Button type='submit' leftSection={<FaFloppyDisk/>}>{state.is_updated ? "Update"  : "Save"}</Button>
                </Group>
              </Grid.Col>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}
