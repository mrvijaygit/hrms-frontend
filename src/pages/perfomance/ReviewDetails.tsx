import {useMantineTheme, Flex, NumberInput, Paper,Table,Text, Textarea, Box, Group, Avatar} from "@mantine/core"

export default function MyReview() {
  const theme = useMantineTheme();

  return (
    <>
      <Paper p='sm'>
        <Flex gap='xs' justify="space-between" align="center">
            <Text>1.Ensure 100% Participation in Team activities</Text>
            <Text fw={500}>Weightage: 10%</Text>
        </Flex>
        <Box p='xs'>
          <Table withTableBorder withColumnBorders withRowBorders>
            <Table.Thead bg="gray.1">
                <Table.Tr>
                  <Table.Th style={{width:"200px"}}>#</Table.Th>
                  <Table.Th style={{width:"150px"}}>Rating</Table.Th>
                  <Table.Th style={{width:"400px"}}>Comments</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                  <Table.Th>
                    <Group align="center" gap='xs'>
                      <Avatar color={theme.primaryColor} name="Muthu Kumar"/>
                      <Box>
                        <Text fw={500} fz="sm">Muthu Kumar</Text>
                        <Text fw={500} fz="xs" c='dimmed' lh={1}>Employee</Text>
                      </Box>
                    </Group>
                  </Table.Th>
                  <Table.Td>
                    <NumberInput  min={1} max={5} maxLength={1} style={{width:'70px'}} placeholder="" rightSectionWidth="30px" rightSection={<Text> / 5</Text>}/>
                  </Table.Td>
                  <Table.Td>
                    <Textarea rows={4}/>
                  </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Box>
       

      </Paper>

    </>
  )
}
