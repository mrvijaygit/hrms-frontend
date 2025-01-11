import { Box, Button, Group, Pagination, Paper, Select, Text, Title } from "@mantine/core"
import { FaEye, FaPencil, FaPlus, FaTrash} from "react-icons/fa6"
import {Column} from "react-table";
import { useLayoutEffect, useState, useMemo, useRef, useEffect} from "react";
import BasicTable from "../../components/Table/BasicTable";
import { useNavigate } from "react-router-dom";
import { protectedApi } from "../../utils/ApiService";
import { UseEmployeeList } from "../../contextapi/EmployeeListContext";
import { sortingType } from '../../types/general';
import Filter from "./Filter";
interface UserData {
    s_no:number,
    user_login_id: number;
    employee_id:number;
    user_name: string;
    email_id: string;
    phone_number: string;
    department_name: string;
    designation_name: string;
    user_type: string;
}

function List() {
    const navigate = useNavigate();
    const {state, dispatch} = UseEmployeeList();
    const {data, totalPage, info, show, page, filter} = state;

    const [tableHeight, setTableHeight] = useState<number>(400);
    const [sort, setSort] = useState({} as sortingType);
    const topRef = useRef<HTMLDivElement | null>(null);
    const filterRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);

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
      (async()=>{
        try{
          let response = await protectedApi.get("/user/getUserList", {
            params:{
              currentpage:page,
              postperpage:Number(show),
              sorting:sort,
              filter:filter
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
    
    },[page, show, sort.accessor, sort.direction,  filter.m_department_id, filter.m_designation_id, filter.m_employee_status_id, filter.m_user_type_id]);

    const columns: Column<UserData>[] =  useMemo(()=>[
        {
          Header: '#',
          accessor: 's_no',
          disableSortBy: true,
          width:30
        },
        {
          Header: 'User Name',
          accessor: 'user_name',
          width:'auto',
          sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none'
        },
        {
          Header: 'Email',
          accessor: 'email_id',
          width:160,
          sortDirection: sort.accessor === 'email_id' ? sort.direction : 'none'
        },
        {
          Header: 'Contact No',
          accessor: 'phone_number',
          width:120,
          sortDirection: sort.accessor === 'phone_number' ? sort.direction : 'none'
        },
        {
          Header: 'Department',
          accessor: 'department_name',
          width:200,
          sortDirection: sort.accessor === 'department_name' ? sort.direction : 'none'
        },
        {
          Header: 'Designation',
          accessor: 'designation_name',
          width:200,
          sortDirection: sort.accessor === 'designation_name' ? sort.direction : 'none'
        },
        {
          Header: 'Role',
          accessor: 'user_type',
          width:130,
          sortDirection: sort.accessor === 'user_type' ? sort.direction : 'none'
        },
        {
          Header: 'Action',
          sortable: false,
          width:150,
          Cell: ({row})=> {
            return (
                <Group gap='xs' wrap='nowrap' justify="center">
                    <Button variant="light" color="green" onClick={()=>navigate('/employees/list/profile', {state:{user_login_id:row.original.user_login_id}})}><FaEye/></Button>
                    <Button variant='light' onClick={()=>navigate('/employees/form', {state:{user_login_id:row.original.user_login_id}})}><FaPencil/></Button>
                    <Button variant='light' color="red"><FaTrash/></Button>
                </Group>
            )
          }
        },
    ], [sort]);
  
    const tableData: UserData[] | [] = useMemo(()=>data, [data]); 

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
          <Title order={6} tt='uppercase'>Employees Management</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaPlus/>} onClick={()=>{navigate('/employees/form')}}>Add Employee</Button>
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
        <Filter/>
      </Paper>
      <Paper p='xs' shadow="xs" my='xs'>
        <Box style={{'overflow':'auto'}} h={tableHeight}>
            <BasicTable columns={columns} data={tableData} onHeaderClick= {columnHeaderClick}/>
        </Box>
      </Paper>
      <Paper p='xs' shadow="xs" ref={bottomRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Select data={['10','25','50','100']} size="xs" value={show} onChange={(value) => dispatch({type:'setShow', payload:value})} w={60}/>
          <Text>{info}</Text>
          <Pagination total={totalPage} size='sm' value={page} onChange={(value) => dispatch({type:'setPage', payload:value})}/>
        </Group>
      </Paper>
    </>
  )
}

export default List