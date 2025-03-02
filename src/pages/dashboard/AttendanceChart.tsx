import { DonutChart } from "@mantine/charts"
import { Badge, Flex, Group, Paper, Text } from "@mantine/core"
import { UseDashboard } from "../../contextapi/DashboardContext";

function AttendanceChart() {
  const {state} = UseDashboard();
  return (
    <>
        <Paper shadow='xs' h='100%'>
           <Flex align='center' direction='column' gap='lg' justify='center' h='100%'>
            <DonutChart data={state.attendanceChart != null ? state.attendanceChart : []} paddingAngle={2} withLabelsLine labelsType="percent" withLabels size={160} thickness={18} tooltipDataSource="segment" chartLabel={"Attendance"} mx="auto"/>
            {
              state.attendanceChart != null && 
              <Group align="center" justify="center">
                  {
                    state.attendanceChart.map((item)=>{
                      return <Group gap='xs' key={item.name}>
                        <Badge size="12" circle color={item.color}/>
                        <Text fz={12} tt='capitalize'>{item.name}</Text>
                      </Group>
                    })
                  }
              </Group>
            }
            </Flex>
        </Paper>
    </>
  )
}

export default AttendanceChart