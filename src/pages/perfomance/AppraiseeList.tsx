import { useDisclosure } from '@mantine/hooks';
import { Box, Button, ComboboxData, Drawer, Grid, Group, Pagination, Paper,Select,Text,Title } from "@mantine/core";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaFileExcel, FaEye, FaPlus, FaXmark, FaFloppyDisk, FaAngleLeft, FaTrash, FaCheck} from "react-icons/fa6";
import { Column } from "react-table"
import BasicTable from "../../components/Table/BasicTable";
import { useForm } from "@mantine/form";
import { protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { UseAppraisee } from '../../contextapi/GenericContext';
import { excelDownload , directionAccessor} from '../../utils/helper';
import type { SortingType } from '../../types/Generic';
import type {FormType, TableDataType } from '../../types/AppraiseeList';
import { useNavigate , useLocation} from "react-router-dom";
import CustomSelect from "../../components/CustomSelect";

export default function AppraiseeList() {
    const [tableHeight, setTableHeight] = useState<number>(400);
    const topRef = useRef<HTMLDivElement | null>(null);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [opened, { open, close }] = useDisclosure(false); 
    const {state, dispatch}  = UseAppraisee();
    const [triggerApi, setTriggerApi] = useState<Boolean>(true);
    const [sort, setSort] = useState({} as SortingType);
    const navigate = useNavigate();
    const location = useLocation();
    const [employees, setEmployees] = useState<ComboboxData | null>(null);

    const form = useForm<FormType>({
      initialValues:{
        appraisee_id:-1,
        user_login_id:null,
      },
      validate:{
        user_login_id: (value) => (value != null ? null : "Required"),
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
            let resolve = await protectedApi.get('/master/employeeList', {
              params:{
                'appraisal_cycle_id':location?.state?.appraisal_cycle_id
              }
            }); 
            setEmployees(resolve.data);
          }
          catch(err:any){
            alert.error(err);
          }
      })();
    },[triggerApi]);

    useEffect(()=>{
        (async()=>{
          try{
              let response = await protectedApi.get("/performance/appraiseelist", {
              params:{
                  currentpage:state.page,
                  postperpage:Number(state.show),
                  sorting:sort,
                  appraisal_cycle_id:location?.state?.appraisal_cycle_id
              }
              });
              dispatch({type:"response", payload:{
                data:response.data.data,
                totalRecord:response.data.totalRecord
              }});
          }
          catch(err:any){
              alert.error(err);
          }
        })()
    
    },[state.page, state.show, sort, triggerApi]);

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
        let promise = await protectedApi.post("/performance/saveAppraiseelist", JSON.stringify({...values, 'appraisal_cycle_id':location?.state?.appraisal_cycle_id}));
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
            let promise = await protectedApi.post("/performance/saveAppraiseelist", JSON.stringify({"appraisee_id":id, "is_deleted":1}));
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
            Header:'Employee',
            accessor:'user_name',
            width:200,
            Cell:({row, value}) => {
                return <>
                    <Text mb={4}>{value}</Text>
                    <Text fz={13} c='dimmed'>{row.original.designation_name}</Text>
                </>
            },
            sortDirection: sort.accessor === 'user_name' ? sort.direction : 'none'
        },
        {
            Header:'Department',
            accessor:"department_name",
            width: 150,
            sortDirection: sort.accessor === 'department_name' ? sort.direction : 'none'
        },
        {
            Header:'Reviewer',
            accessor:"reviewer_name",
            width: 150,
            sortDirection: sort.accessor === 'reviewer_name' ? sort.direction : 'none'
        },
        {
            Header:'Score',
            accessor:"overall_score",
            width: 100,
            disableSortBy:true
        },
        {
            Header:'Status',
            accessor:"status",
            width: 100,
            headerClassName:"text-center",
            disableSortBy:true
        },
        {
            Header:'Action',
            width: 100,
            headerClassName:"text-center",
            disableSortBy:true,
            Cell:({row})=>{
                return <Group gap='xs' justify='center'>
                    <Button variant='light' color='green' onClick={()=>navigate('/performance/myreview', {state:{'appraisal_cycle_id':row.original.appraisal_cycle_id}})}><FaEye/></Button>
                    <Button variant='light' color='red' onClick={()=>handleDelete(row.original.appraisee_id)}><FaTrash/></Button>
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
                <Title order={6} tt='uppercase'>Appraisee List</Title>
                <Group align="center" gap='xs'>
                    <Button leftSection={<FaPlus/>} onClick={open}>Add</Button>
                    <Button leftSection={<FaFileExcel/>} color='green' onClick={()=>excelDownload("leaveType")}>Excel</Button>
                    <Button leftSection={<FaAngleLeft/>} onClick={()=>navigate(-1)} color='dark.6'>Back</Button>
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
            <Drawer opened={opened} onClose={()=>{form.reset(); close(); dispatch({type:"isUpdated", payload:{is_updated:false, editData:null}});}} title={state.is_updated ? "Update Appraisee"  : "Add Appraisee"} closeOnClickOutside={false} position="right" offset={8} radius="sm">
                  {
                    employees != null ? employees.length == 0 ? <Text>All Employee Include in this Appraisal Cycle</Text>
                    :    <Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))}>
                    <Grid gutter='sm' align='flex-end'>
                        <Grid.Col span={12}>
                          <CustomSelect data={employees !} label="Employee" {...form.getInputProps('user_login_id')}/>
                        </Grid.Col>
                        <Grid.Col span={12}>
                            <Group justify="flex-end" gap='sm'>
                                <Button  color="dark.6" leftSection={<FaXmark/>} onClick={()=>handleClearReset()}>{state.is_updated ? "Reset"  : "Clear"}</Button>
                                <Button type='submit' leftSection={<FaFloppyDisk/>}>{state.is_updated ? "Update"  : "Save"}</Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                  </Box> : ""
                  }

                 

            </Drawer>
        </>
    )
}
