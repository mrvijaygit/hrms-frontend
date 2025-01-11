import { useDisclosure } from '@mantine/hooks';
import {Box, Button, ComboboxData, Drawer, Grid, Group, NumberInput, Pagination, Paper,Select,Text, Textarea, Title } from "@mantine/core";
import { FaFloppyDisk, FaPlus, FaXmark } from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseLeaveRequest } from '../../contextapi/LeaveRequestContext';
import type { dataType } from '../../types/LeaveRequest';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { useAppSelector } from "../../redux/hook";

type sortingType = { direction: string, accessor: string};

export default function Requests() {
  const userInfo = useAppSelector(state => state.user);
  const logger_id = userInfo.user_login_id;

  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [triggerApi, setTriggerApi] = useState<Boolean>(true);
  const {state, dispatch}  = UseLeaveRequest();
  const [sort, setSort] = useState({} as sortingType);
  const [leaveType, setLeaveType] = useState<ComboboxData | null>(null);

  const form = useForm<dataType>({
    initialValues:{
      leave_id:-1,
      user_login_id:String(logger_id),
      m_leave_type_id:null,
      start_date:null,
      end_date:null,
      no_of_days:'',
      reason:"",
    },
    validate:{
      m_leave_type_id: (value) => (value != null ? null : "Required"),
      start_date: (value) => (value != null ? null : "Required"),
      end_date: (value, values) => {
        if(value != null && values.start_date != null){
          if(value < values.start_date){
            return "End date must be greater than start date";
          }
        }
        return null;
      },
      no_of_days: (value) => (String(value).trim().length > 0 ? null : "Required"),
      reason: (value) => (value.trim().length > 0 ? null : "Required")
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
        let response = await protectedApi.get("/leave/myleaves", {
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

  useEffect(()=>{
    (async()=>{
      try{
        let leaveType = await protectedApi.get("/master/leaveType");
        setLeaveType(leaveType.data);
      }
      catch(err:any){
        alert.error(err);
      }
    })();
  },[]);


  const handleSubmit = async(values:dataType) =>{
    try{
      let promise = await protectedApi.post("/leave/saveLeaveRequest", JSON.stringify(values));
      alert.success(promise.data.msg);
      form.reset();
      close();
      setTriggerApi((prev) => (prev == false) ? true : false);
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
      Header:'Type',
      accessor:'leave_type',
      width: 100,
      sortDirection: sort.accessor === 'leave_type' ? sort.direction : 'none'
    },
    {
      Header:'Start Date',
      accessor:'start_date',
      width: 100,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'start_date' ? sort.direction : 'none'
    },
    {
      Header:'End Date',
      accessor:'end_date',
      width: 100,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'end_date' ? sort.direction : 'none'
    },
    {
      Header:'Status',
      accessor:'leave_status',
      width: 100,
      headerClassName:"text-center",
      sortDirection: sort.accessor === 'leave_status' ? sort.direction : 'none',
      Cell:({row})=>{
          return <Text fw={500} c={row.original.status_color}>{row.original.leave_status}</Text>
      }
    },
    {
        Header:'Reason',
        accessor:'reason',
        width: 300,
        disableSortBy:true,
    }
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
          <Title order={6} tt='uppercase'>My Leave</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={open}>Apply Leave</Button>
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
      <Drawer opened={opened} onClose={()=>{form.reset(); close();}} title="Add Leave Type" closeOnClickOutside={false} position="right" offset={8} radius="sm">
        <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
          <Grid gutter='sm' align='flex-end'>
              <Grid.Col span={12}>
                <Select data={leaveType != null ? leaveType : []} label="Leave Type" {...form.getInputProps('m_leave_type_id')}/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="Start Date" {...form.getInputProps('start_date')} clearable/>
              </Grid.Col>
              <Grid.Col span={6}>
                <DatePickerInput label="End Date" {...form.getInputProps('end_date')} clearable/>
              </Grid.Col>
              <Grid.Col span={6}>
                <NumberInput label="Number of Days" maxLength={2} {...form.getInputProps('no_of_days')}/>
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea label="Reason" rows={5} {...form.getInputProps('reason')}/>
              </Grid.Col>              
              <Grid.Col span={12}>
                <Group justify="flex-end" gap='sm'>
                  <Button  color="red" leftSection={<FaXmark/>} onClick={()=>form.reset()}>Clear</Button>
                  <Button type='submit' color="green" leftSection={<FaFloppyDisk/>}>Save</Button>
                </Group>
              </Grid.Col>
          </Grid>
        </Box>
      </Drawer>
    </>
  )
}