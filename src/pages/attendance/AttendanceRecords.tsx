import { Box, Button, Grid, Group, Pagination, Paper,Select,Text, Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {FaFileExcel, FaCheck, FaXmark, FaCircleInfo} from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { MonthPickerInput } from '@mantine/dates';
import { protectedApi } from '../../utils/ApiService';
import { UseARecord } from '../../contextapi/GenericContext';
import { excelDownload , directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type { TableDataType, HeaderType } from '../../types/AttendanceRecord';

export default function AttendanceRecords() {
  const [tableHeight, setTableHeight] = useState<number>(400);
  const topRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const {state, dispatch}  = UseARecord();
  const [sort, setSort] = useState({} as SortingType);
  const [header, setheader] = useState<HeaderType | []>([]);
  useLayoutEffect(() => {
    const calculateTableHeight = () => {
      let h1 = 0;
      if (topRef.current && filterRef.current) {
        h1 =  topRef.current.clientHeight + filterRef.current.clientHeight + 58 + 56; 
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
    if(state.filter?.attendance_date != null){
      (async()=>{
        try{
          let response = await protectedApi.get("/attendance/attendanceReport", {
            params:{
              currentpage:state.page,
              postperpage:Number(state.show),
              sorting:sort,
              filter:state.filter
            },
          });
          setheader(response.data.header);
          dispatch({type:"response", payload:{
            data:response.data.data,
            totalRecord:response.data.totalRecord
          }});
        }
        catch(err){
  
        }
      })();
    }
  
  },[state.page, state.show, sort, state.filter?.attendance_date]);

  const TableIcon = (value:number) => {
    switch(value){
      case 1:
        return <FaCheck color="green"/>;
      case 2:
        return <FaXmark color="red"/>;
      case 3:
        return <FaCircleInfo color="orange"/>;
      default:
        return <>-</>;
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
      Header:'Employee Name',
      accessor:'user_name',
      width:150,
      sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none',
      Cell:({row}:any) => <>
        <Text>{row.original.user_name}</Text>
        <Text fz={12} c='dimmed'>{row.original.user_type}</Text>
      </>
    },
    ...header.map((item)=>{
      return {
         Header:item.Header,
         accessor:item.accessor,
         width:60,
         headerClassName:"text-center",
         disableSortBy:true,
         Cell:({row}:any) => TableIcon(row.original[item.accessor])
      }
    })
  ], [sort, header]);

  const data:TableDataType[] = useMemo(()=>state.data, [state.data]);

  const columnHeaderClick = async (column:any) => {
    setSort(directionAccessor(column));
  };

  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs' ref={topRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Title order={6} tt='uppercase'>Attendance Report</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaFileExcel/>} color='green' onClick={()=>excelDownload("holiday", state?.filter)}>Excel</Button>
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
        <Grid gutter={{lg:"xs"}}>
          <Grid.Col span={{lg:2, md:3}}>
            <MonthPickerInput maxDate={new Date()} label="Month" size='xs' value={state?.filter?.attendance_date}
            onChange={(value) => dispatch({'type':'filter', payload:{'key':'attendance_date', "value":value}})}/>
          </Grid.Col>
        </Grid>
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
