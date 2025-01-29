import { useDisclosure } from '@mantine/hooks';
import { Box, Button, Drawer, Grid, Group, NumberInput, Pagination, Paper,Select,Text,TextInput, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaFileExcel, FaFloppyDisk, FaPencil, FaPlus, FaTrash, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseLeaveType } from '../../contextapi/GenericContext';
import { excelDownload , directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type { FormType, TableDataType } from '../../types/LeaveType';

export default function LeaveType() {
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseLeaveType();
  const [sort, setSort] = useState({} as SortingType);

  const form = useForm<FormType>({
    initialValues:{
      m_leave_type_id:-1,
      leave_type:'',
      no_of_days:'',
    },
    validate:{
      leave_type: (value) => (value.trim().length > 2 ? null : "Required"),
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
        let response = await protectedApi.get("/leave/leaveType", {
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
        let response = await protectedApi.get("/leave/viewLeaveType", {
          params:{
            "m_leave_type_id":id
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

  const handleSubmit = async(values:FormType) =>{
    try{
      let promise = await protectedApi.post("/leave/saveLeaveType", JSON.stringify(values));
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
          let promise = await protectedApi.post("/leave/saveLeaveType", JSON.stringify({"m_leave_type_id":id, "is_deleted":1}));
          alert.success(promise.data.msg);
          setTriggerApi((prev) => (prev == false) ? true : false);
        }
      });
    }
    catch(error:any){
      alert.error(error);
    }
  }

  const columns:Column<TableDataType>[] = useMemo(() => [
    {
      Header:'#',
      accessor:'s_no',
      width: 40,
      disableSortBy:true
    },
    {
      Header:'Title',
      accessor:'leave_type',
      width:"auto",
      sortDirection: sort.accessor === 'leave_type' ? sort.direction : 'none'
    },
    {
      Header:'No of Days',
      accessor:"no_of_days",
      width: 150,
      sortDirection: sort.accessor === 'no_of_days' ? sort.direction : 'none'
    },
    {
      Header:'Action',
      width: 150,
      headerClassName:"text-center",
      Cell:({row})=>{
          return <Group gap='xs' justify='center'>
            <Button variant='light' onClick={()=>handleEdit(row.original.m_leave_type_id)}><FaPencil/></Button>
            <Button variant='light' color="red" onClick={()=>handleDelete(row.original.m_leave_type_id)}><FaTrash/></Button>
          </Group>;
      }
    },
  ], [sort]);

  const data:TableDataType[] = useMemo(()=>state.data, [state.data]);

  const columnHeaderClick = async (column:any) => {
    setSort(directionAccessor(column));
  };

  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs' ref={topRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Title order={6} tt='uppercase'>Leave Type</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Add Leave Type</Button>
            <Button leftSection={<FaFileExcel/>} color='green' onClick={()=>excelDownload("leaveType")}>Excel</Button>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Leave Type"  : "Add Leave Type"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <TextInput label="Title" maxLength={20} {...form.getInputProps('leave_type')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <NumberInput label="No. of Days" maxLength={3} {...form.getInputProps("no_of_days")}/>
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
