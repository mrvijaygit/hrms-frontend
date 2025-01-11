import { Badge, Box, Grid, Group, Paper, ScrollArea, Text, Title } from '@mantine/core'
import { BsCake, BsPin } from "react-icons/bs";

import { UseDashboard } from "../../contextapi/DashboardContext"
function TodayBirthday() {
    const {state} =  UseDashboard();
    return (
        <>
            <Grid.Col span={{ lg: 4 }}>
                <Paper p='sm' shadow='xs'>
                    <Title order={5} mb="sm">Today Birthday </Title>
                    <ScrollArea h={240}>
                    {
                        state?.todayBirthday != null && <>
                            {
                                state?.todayBirthday.map((item, index)=>{
                                    return  <Box key={item.employee_id} className={`${((index+1) == state?.todayBirthday?.length) ? '' : "border-bottom"}`} py='xs'>
                                        <Group gap='xs' justify="space-between" align="center" mb='xs'>
                                            <Box>
                                                <Title order={6} tt='capitalize'>{item.user_name}</Title>
                                                <Text c="dimmed" size="xs">{item.designation_name}</Text>
                                            </Box>
                                            <Badge variant='light'><BsCake/> {item.age}</Badge>
                                        </Group>
                                        <Group gap='xs' justify="space-between" align="center">
                                            <Group align='center' gap="xs">
                                                <BsPin size={14} />
                                                <Text fz='xs' c="gray"> {item.date_of_birth}</Text>
                                            </Group>
                                            <Text size="xs" c='gray'>{item.department_name}</Text>
                                        </Group>
                                </Box>
                                })
                            }
                        </>
                    }                     
                    </ScrollArea>
                </Paper>
            </Grid.Col>
        </>
    )
}

export default TodayBirthday