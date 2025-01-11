import { Group, Paper, Text } from '@mantine/core';

type cardType = {
    title:string,
    Icon:React.FC<any>,
    total:number,
    count:number
}

function Card({title, Icon, count, total}:cardType) {

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
                    <Text fw={700} fz={24} lh={1}>{count} / {total}</Text>
                </Group>
            </Paper>
        </>
    )
}

export default Card