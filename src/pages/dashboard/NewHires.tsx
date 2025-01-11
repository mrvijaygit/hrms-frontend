import {Box, Grid, Group, Paper, ScrollArea, Text, Title } from '@mantine/core'
import { BsPin } from "react-icons/bs";
import { UseDashboard } from "../../contextapi/DashboardContext"
function NewHires() {
    const {state} =  UseDashboard();
    return (
        <>
            <Grid.Col span={{base:12, lg:4}}>
                <Paper p='sm' shadow='xs'>
                    <Title order={5} mb="sm">New Hires <Text component='small' fz={10} c='dimmed' tt='uppercase' fw={700}>( Last 30 days ) </Text></Title>
                    <ScrollArea h={240}>
                    {
                        state?.newHires != null && <>
                            {
                                state?.newHires.map((item, index)=>{
                                    return  <Box key={item.employee_id} className={`${((index+1) == state?.newHires?.length) ? '' : "border-bottom"}`} py='xs'>
                                        <Group gap='xs' justify="space-between" align="center" mb='xs'>
                                            <Box>
                                                <Title order={6} tt='capitalize'>{item.user_name}</Title>
                                                <Text c="dimmed" size="xs">{item.designation_name}</Text>
                                            </Box>
                        
                                        </Group>
                                        <Group gap='xs' justify="space-between" align="center">
                                            <Group align='center' gap="xs">
                                                <BsPin size={14} />
                                                <Text fz='xs' c="gray"> {item.date_of_joining}</Text>
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

export default NewHires