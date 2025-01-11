import { Box, Button, Grid, Group, Pagination, Paper, Select, Text, Title } from "@mantine/core";
import {MonthPickerInput} from "@mantine/dates";
import { useLayoutEffect, useRef, useState } from "react";
import { FaFileExcel} from "react-icons/fa6";


export default function OverallReport() {

  const [tableHeight, setTableHeight] = useState<number>(400);
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

    // const columns:Column<dataType>[] = useMemo(() => [
    //   {
    //     Header:'#',
    //     accessor:'s_no'
    //   },
    //   {
    //     Header:'Employee Name',
    //     accessor:'employee_name'
    //   },
    // ], []);

    // const data:dataType[] = useMemo(()=>[], []);

    // const columnHeaderClick = async (column:any) => {

    //   switch (column.sortDirection) {
    //     case 'none':
    //       setSort({ direction: 'ASC', accessor: column.id });
    //       break;
    //     case 'ASC':
    //       setSort({ direction: 'DESC', accessor: column.id });
    //       break;
    //     case 'DESC':
    //       setSort({ direction: 'none', accessor: column.id });
    //       break;
    //   }
    // };

  return (
    <>
      <Paper p='xs' mb='xs' shadow='xs' ref={topRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Title order={6} tt='uppercase'>Attendance Monthly Report</Title>
          <Group align="center" gap='xs'>
            <Button leftSection={<FaFileExcel/>} color="green">Excel</Button>
          </Group>
        </Group>
      </Paper>
      <Paper p='xs' shadow='xs' mb='xs' ref={filterRef}>
         <Grid gutter='xs'>
            <Grid.Col span={{xl:2, lg:3, md:6}}>
              <MonthPickerInput label="Month" size="xs"/>
            </Grid.Col>
            <Grid.Col span={{lg:3, md:6}}>
              <Select label='Role' data={[]} size="xs"/>
            </Grid.Col>
         </Grid>
      </Paper>
      <Paper p='xs' shadow="xs" my='xs'>
        <Box style={{'overflow':'auto'}} h={tableHeight}>
           
        </Box>
      </Paper>
      <Paper p='xs' shadow="xs" ref={bottomRef}>
        <Group align="center" justify="space-between" gap='xs'>
          <Select data={['10','25','50','100']} size="xs" defaultValue={'10'} w={60}/>
          <Text>Showing 1 - 10 of 10 entries</Text>
          <Pagination total={10} size='sm'/>
        </Group>
      </Paper>
    </>
  )
}
