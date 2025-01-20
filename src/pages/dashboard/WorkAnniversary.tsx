import { Badge, Box, Grid, Group, Paper, ScrollArea, Text, Title, useMantineTheme } from '@mantine/core'
import {BsPin } from "react-icons/bs";
import { FaTrophy } from 'react-icons/fa6';

import { UseDashboard } from "../../contextapi/DashboardContext"
function WorkAnniversary() {
    const {state} =  UseDashboard();
    const theme = useMantineTheme();
    return (
        <>
            <Grid.Col span={{ lg: 4 }}>
                <Paper p='sm' shadow='xs'>
                    <Title order={5} mb="sm" c={theme.primaryColor}>Work Anniversary</Title>
                    <ScrollArea h={240}>
                    {
                        state?.workAnniversary != null && <>
                            {
                                state?.workAnniversary.map((item, index)=>{
                                    return  <Box key={item.employee_id} className={`${((index+1) == state?.workAnniversary?.length) ? '' : "border-bottom"}`} py='xs'>
                                        <Group gap='xs' justify="space-between" align="center" mb='xs'>
                                            <Box>
                                                <Title order={6} tt='capitalize'>{item.user_name}</Title>
                                                <Text c="dimmed" size="xs">{item.designation_name}</Text>
                                            </Box>
                                            <Badge variant='light' c='black' bg='green.1'>
                                                <Group align='center' gap={2}>
                                                    <FaTrophy/> {item.anniversary_year}
                                                </Group>
                                            </Badge>
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

export default WorkAnniversary