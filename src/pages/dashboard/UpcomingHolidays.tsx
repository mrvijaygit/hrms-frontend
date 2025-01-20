import { Box, Grid, Group, Paper, ScrollArea, Text, Title, useMantineTheme } from "@mantine/core"
import { UseDashboard } from "../../contextapi/DashboardContext"
function UpcomingHolidays() {
  const {state} =  UseDashboard();
  const theme = useMantineTheme();
  return (
    
        <Grid.Col span={{lg:4}}>
          <Paper p='sm' shadow='xs'>
            <Title order={5} mb='sm' c={theme.primaryColor}>Upcoming Holidays</Title>
            <ScrollArea h={240}>
                   {
                     state?.upcomingHolidays != null && <>
                        {
                            state?.upcomingHolidays.map((item)=>{
                                return <Group py='xs' key={item.holiday_id} gap='sm' justify="space-between">
                                    <Box>
                                        <Title order={6}>{item.holiday_title}</Title> 
                                        <Text fz="xs" c='dimmed'>{item.holiday_day}</Text>
                                    </Box>
                                    <Box>
                                        <Text fz="sm">{item.holiday_date}</Text>
                                    </Box>
                                </Group>
                                
                            })
                        }
                     </>
                   }
            </ScrollArea>
          </Paper>
        </Grid.Col>

  )
}

export default UpcomingHolidays