import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import { UseDashboard } from "../../contextapi/DashboardContext";
import * as Icons from 'react-icons/fa6';
import type { cardType } from '../../types/Dashboard';

function Card({title, icon, count}:cardType) {
    const Icon = Icons[icon as keyof typeof Icons];
    return (
        <>
            <Paper key={title} p='sm' shadow='xs'>
                <Group justify="space-between">
                    <Text fz="xs" fw={700} tt='uppercase'>
                        {title}
                    </Text>
                    <Text c='dimmed'><Icon/></Text>
                </Group>

                <Group align="flex-end" gap="xs" mt={25}>
                    <Text fw={700} fz={24} style={{lineHeight:1}}>{count}</Text>
                </Group>
            </Paper>
        </>
    )
}

function AdminCard(){
    const {state} = UseDashboard();
    console.log(state.adminCard)
    return (
        <>
            <SimpleGrid cols={{xs: 2, md: 3 }} spacing="xs" verticalSpacing="xs" h='100%'>
            {
                state.adminCard != null &&  state.adminCard.map((item)=>{
                return <Card key={item.id} {...item}/>
                })
            }
            </SimpleGrid>
        </>
    )
}

export default AdminCard