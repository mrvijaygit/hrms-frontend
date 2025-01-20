import {Box, Divider, Flex, Grid, Group, Paper, Text, Title, Button, useMantineTheme } from "@mantine/core"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { alert } from "../../utils/Alert";
import { protectedApi } from "../../utils/ApiService";
import { ProfileType } from "../../types/EmployeeForm";
import { FaAngleLeft } from "react-icons/fa6";
function Profile() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const [data, setData] = useState<ProfileType | null>(null);
  useEffect(()=>{
    if(location.state.user_login_id){
       (async()=>{
          try{
            let response = await protectedApi.get('/user/profile',{
              params:{
                user_login_id : location.state.user_login_id
              }
            });
            setData(response.data);
          }
          catch(err:any){
            alert.error(err);
          }
       })()
    }
    else{
      navigate('/employee/list');
    }
  },[]);
  return (
    <>

      <Grid gutter='xs'>
          <Grid.Col span={12}>
            <Paper p='sm' pt='xs' shadow="xs">
              <Group justify="space-between" gap="xs" align='center'>
                <Text c={theme.primaryColor} fw={500}>Basic Details</Text>
                <Button color={theme.colors.dark[6]} leftSection={<FaAngleLeft/>}  onClick={()=>history.go(-1)}><Group align="center" gap={2}>Back</Group></Button>
              </Group>
              <Divider variant="dashed" mb='xs' mt='xs' />
              <Grid>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Name</Text><Text fw={500}>{data?.basic.user_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Employee Code</Text><Text fw={500}>{data?.basic.emp_code}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Date of Joining</Text><Text fw={500}>{data?.basic.date_of_joining}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Status</Text><Text fw={500}>{data?.basic.employee_status}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Designation</Text><Text fw={500}>{data?.basic.designation_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Department</Text><Text fw={500}>{data?.basic.department_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Gender</Text><Text fw={500}>{data?.basic.gender_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Date of Birth</Text><Text fw={500}>{data?.basic.date_of_birth}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Blood Group</Text><Text fw={500}>{data?.basic.blood_group}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Phone Number</Text><Text fw={500}>{data?.basic.phone_number}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Aadhaar Number</Text><Text fw={500}>{data?.basic.aadhaar_no}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Pan card Number</Text><Text fw={500}>{data?.basic.pan_card_no}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:6}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Permant Address</Text><Text fw={500}>{data?.basic.permant_address}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:6}}>
                <Text fz="xs" c='dark.3' tt="uppercase">Current Address</Text><Text fw={500}>{data?.basic.current_address}</Text>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{lg:6}}>
            <Paper p='sm' shadow="xs">
              <Text c={theme.primaryColor} fw={500}>Bank Details</Text>
              <Divider variant="dashed" my='xs'/>
              <Grid>
                <Grid.Col span={{lg:6,md:12}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Bank Name</Text><Text fw={500}>{data?.bank.bank_name}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:6,md:12}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Branch Name</Text><Text fw={500}>{data?.bank.branch_name}</Text>
                </Grid.Col>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Account Number</Text><Text fw={500}>{data?.bank.account_number}</Text>
                </Grid.Col>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Account holder name</Text><Text fw={500}>{data?.bank.account_holder_name}</Text>
                </Grid.Col>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Account Type</Text><Text fw={500}>{data?.bank.account_type_display}</Text>
                </Grid.Col>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">IFSC Code</Text><Text fw={500}>{data?.bank.ifsc_code}</Text>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{lg:6}}>
            <Paper p='sm' shadow="xs">
              <Text c={theme.primaryColor} fw={500}>Education Details</Text>
              <Divider variant="dashed" my='xs'/>
              <Grid>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Field of Study</Text><Text fw={500}><Text component="span">{data?.education.degree_name}</Text> {data?.education.field_of_study}</Text>
                </Grid.Col>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Graduation Year</Text><Text fw={500}>{data?.education.graduation_year}</Text>
                </Grid.Col>
                <Grid.Col span={{md:12}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Institution Name</Text><Text fw={500}>{data?.education.institution_name}</Text>
                </Grid.Col>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Institute Location</Text><Text fw={500}>{data?.education.institution_location}</Text>
                </Grid.Col>
                <Grid.Col span={{md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">CGPA</Text><Text fw={500}>{data?.education.cgpa}</Text>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>
          <Grid.Col span={12}>
            <Paper p='sm' shadow="xs">
              <Text c={theme.primaryColor} fw={500}>Salary Details</Text>
              <Divider variant="dashed" my='xs'/>
              <Grid>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Basic Salary</Text><Text fw={500}>{data?.salary.basic_salary}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">House Rent Allowance</Text><Text fw={500}>{data?.salary.house_rent_allowance}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Medical Allowance</Text><Text fw={500}>{data?.salary.medical_allowance}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Transport Allowance</Text><Text fw={500}>{data?.salary.transport_allowance}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Other Allowance</Text><Text fw={500}>{data?.salary.other_allowance}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Tax</Text><Text fw={500}>{data?.salary.tax}</Text>
                </Grid.Col>
                <Grid.Col span={{lg:3,md:6}}>
                  <Text fz="xs" c='dark.3' tt="uppercase">Other Deduction</Text><Text fw={500}>{data?.salary.other_deduction}</Text>
                </Grid.Col>
              </Grid>
            </Paper>
          </Grid.Col>
          {
                      data?.experience != null && <>
                  {
                      data?.experience.map((item)=>{
                          return <Grid.Col span={{lg:4, md:6}} key={item.employee_experience_id}>
                          <Paper h='100%' p='sm' shadow="xs">
                              <Box mb="sm">
                                  <Title order={6}>{item.previous_company_name}</Title>
                              </Box>
                          
                              <Flex gap='xs' justify="space-between" align='center'>
                                  <Box>
                                      <Text fz='xs' c='dark.3'>Role</Text>
                                      <Text>{item.previous_job_title}</Text>
                                  </Box>
                                  <Box>
                                      <Text fz='xs' c='dark.3'>Location</Text>
                                      <Text>{item.previous_job_location}</Text>
                                  </Box>
                              </Flex>
                              <Divider variant="dashed" my='xs' />
                              <Flex gap='xs' justify="space-between" align='center'>
                                  <Group align='center' gap="xs">
                                      <Text fz='xs' c="dark.3" lh={0}>SD:</Text>
                                      <Text>{item.start_date}</Text>
                                  </Group>
                                  {
                                      item.end_date != null &&  <Group align='center' gap="xs">
                                          <Text fz='xs' c="dark.3" lh={0}>ED:</Text>
                                          <Text>{item.end_date}</Text>
                                      </Group>
                                  }
                                  
                              </Flex>
                          </Paper>
                        </Grid.Col>
                      })
                  }
              </>
          }
      </Grid>

  
    </>
  )
}

export default Profile