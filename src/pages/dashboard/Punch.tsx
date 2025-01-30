import { Box, Flex, Grid, Paper, Title, useMantineTheme, Text, Button } from "@mantine/core"
import { UseDashboard } from "../../contextapi/DashboardContext"
import { useAppSelector } from "../../redux/hook";

export default function Punch() {
    const { state } = UseDashboard();
    const user_name = useAppSelector((state) => state.user.user_name);
    const theme = useMantineTheme();
    return (
        <>
            <Grid.Col span={{ base: 12, lg: 4 , md:6}}>
                <Paper p='sm' shadow='xs' bg={theme.colors[theme.primaryColor][0]} h='100%'>
                    <Flex direction='column' align='center' justify="space-between" gap='xs' h='100%'>
                        <Box>
                            <Title order={5} mb="xs" c={theme.primaryColor} ta='center'>Attendance</Title>
                            <Title order={5} ta='center'>Thursday, 11 Mar 2025</Title>
                        </Box>
                        <Box>
                            <Text fw='bolder' ta='center'>Hello {user_name}!</Text>
                            <Text c='dimmed' ta='center'>Every great day begins with a punch in.</Text>
                        </Box>
                     

                        <Button color="dark.6" w='100%'>Punch In</Button>
                    </Flex>
                    
                </Paper>
            </Grid.Col>
        </>
    )
}
