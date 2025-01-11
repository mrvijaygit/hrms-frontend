import {Box, Button, Group, Pagination, Paper,Select,Text, Title, Tooltip, UnstyledButton } from "@mantine/core";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { protectedApi } from '../../utils/ApiService';
import { UseLeaveRequest } from '../../contextapi/LeaveRequestContext';
import type { dataType } from '../../types/LeaveRequest';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FaAngleDoubleRight, FaInfoCircle } from 'react-icons/fa';
import { useAppSelector } from "../../redux/hook";
import { useNavigate } from 'react-router-dom';

type sortingType = { direction: string, accessor: string};

export default function Requests() {
  const userInfo = useAppSelector(state => state.user);
  const navigate = useNavigate();

  const isEmployee = (userInfo.m_user_type_id == 1);

  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const {state, dispatch}  = UseLeaveRequest();
  const [sort, setSort] = useState({} as sortingType);


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
        let response = await protectedApi.get("/leave/leaveRequest", {
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
  
  },[state.page, state.show, sort]);


  const columns:Column<dataType>[] = useMemo(() => [
    {
      Header:'#',
      accessor:'s_no',
      width: 40,
      headerClassName:"text-center",
      disableSortBy:true
    },
    {
      Header:'Employee Name',
      accessor:'user_name',
      width: 200,
      sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none',
      visible:isEmployee ? false : true,
      Cell:({row})=>{
        return <Group align='center' gap='xs' justify='space-between'>
          <Text>{row.original.user_name}</Text>
          <Tooltip multiline w={250} withArrow label={row.original.reason} color='white' c='black'>
            <UnstyledButton c="blue" fz='xs'><FaInfoCircle/></UnstyledButton></Tooltip>
        </Group>
      }
    },
    {
      Header:'Type',
      accessor:'leave_type',
      width: 100,
      headerClassName:"text-center",
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
      Header:'Action',
      width: 100,
      headerClassName:"text-center",
      Cell:({row})=>{
          return  <Group gap='xs' justify='center'>
            <Button variant='light'  leftSection={<FaAngleDoubleRight/>} onClick={()=>navigate('/leaverequests/view', {state:{'leave_id':row.original.leave_id}})}>Approval</Button>
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
          <Title order={6} tt='uppercase'>Leave Request</Title>
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
    </>
  )
}