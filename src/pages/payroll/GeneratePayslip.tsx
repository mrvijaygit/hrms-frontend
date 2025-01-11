import { ActionIcon, Box, Flex, Group, Paper, ScrollArea, Table, Text, Title, UnstyledButton} from "@mantine/core";
import { FaAngleLeft, FaDownload } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from "react";
import { protectedApi } from "../../utils/ApiService";
import { alert } from "../../utils/Alert";
import type { payslip } from "../../types/Payroll";

function pdfs(data:payslip) {
  let doc = new jsPDF();
  autoTable(doc, {
    body: [
        [
            {
                content: `${data.company_details.company_name}`,
                styles: {
                  fontSize: 14,
                  halign:'center',
                  fontStyle:'bold'
                }
            }
        ],
        [
            {
                content: `${data.company_details.address}`,
                styles: {
                  fontSize: 10,
                  halign:'center',
                }
            }
        ],
        [
            {
                content: `${data.company_details.domain}; CIN: ${data.company_details.cin_no}`,
                styles: {
                  fontSize: 10,
                  halign:'center',
                }
            }
        ],
        [
            {
                content: ` Pay Slip for the Month of ${data?.payroll_month}`,
                styles: {
                  fontSize: 12,
                  halign:'center',
                }
            }
        ]
    ], 
    theme: 'plain',
});
  autoTable(doc, {
    html: "#table1",
    theme: "plain",
    headStyles: {
      fillColor: false,
      textColor:'#000',
      lineColor:'#ccc',
      lineWidth:0.1,
      halign:'center'
    },
    columnStyles:{
      0:{
        lineWidth : {
          left:0.1, right:0.1, top:0, bottom:0
       },
       fontStyle:"bold"
      },
      1:{
        lineWidth : {
          left:0, right:0.1, top:0, bottom:0
       },
      },
      2:{
        lineWidth : {
          left:0, right:0.1, top:0, bottom:0
       },
       fontStyle:"bold"
      },
      3:{
        lineWidth : {
          left:0, right:0.1, top:0, bottom:0
       },
      },
    },
    didDrawCell: function (data) {
      if (data.row.index > -1) {
          // Add bottom border for the last cell in each column
          if (data.row.index === data.table.body.length - 1) {
              doc.setDrawColor("#ccc");
              doc.setLineWidth(0.1);  
              // Draw a horizontal line at the bottom of the last cell in the column
              doc.line(
                  data.cell.x,                  // Left edge X position
                  data.cell.y + data.cell.height, // Bottom edge Y position
                  data.cell.x + data.cell.width, // Right edge X position
                  data.cell.y + data.cell.height  // Same bottom edge Y position
              );
          }
      }
  },
  });

  autoTable(doc, {
    html: "#table2",
    theme: "plain",
    headStyles: {
      fillColor: false,
      textColor:'#000',
      lineColor:'#ccc',
      lineWidth:0.1
    },
    didParseCell: (hookData) => {
      if (hookData.section === 'head' || hookData.section === 'foot') {
          if (hookData.column.index === 1 || hookData.column.index === 3) {
              hookData.cell.styles.halign = 'right';
          }
      }
   },
    columnStyles:{
      0:{
        lineWidth : {
          left:0.1, right:0.1, top:0, bottom:0
       },
       lineColor:'#ccc',
       fontStyle:"bold"
      },
      1:{
        lineWidth : {
          left:0, right:0.1, top:0, bottom:0
       },
       lineColor:'#ccc',
       halign:'right'
      },
      2:{
        lineWidth : {
          left:0, right:0.1, top:0, bottom:0
       },
       lineColor:'#ccc',
       fontStyle:"bold"
      },
      3:{
        lineWidth : {
          left:0, right:0.1, top:0, bottom:0
       },
       lineColor:'#ccc',
        halign:'right'
      },
    },
    footStyles: {
      fillColor: false,
      textColor:'#000',
      lineColor:'#ccc',
      lineWidth:0.1,
    },
  });

  autoTable(doc, {
      body: [
          [
              {
                  content: `This is computer generated and no signature is required.`,
                  styles: {
                      fontSize: 10,
                  }
              }
          ]
      ], theme: 'plain'
  });
  doc.save(`${data.user_name} ${data.payroll_month}.pdf`);
}

function GeneratePayslip() {
  const location = useLocation();
  const navigate =  useNavigate();
  const [data, setData] = useState<payslip | null>(null);

  useEffect(()=>{
    if(location.state.payroll_id){
        (async()=>{
           try{
            let response = await protectedApi.get("/payroll/payslip", {
              params:{
                payroll_id:location.state.payroll_id
              }
            });
            if(response.data.length > 0){
              setData(response.data[0]);
            }
           }
           catch(err:any){
             alert.error(err);
           }

        })();
    }
    else{
      navigate('/payroll');
    }
  },[]);

  return (
    <>
      <Box pos="relative">

      <UnstyledButton fz='sm' pos="absolute" top={8} left={8}   c="blue" onClick={() => navigate("/payroll")}>
        <Group gap='xs' align="center"><FaAngleLeft /> Back</Group>
      </UnstyledButton>
      <ActionIcon pos="absolute" top={8} right={8}  color="green" onClick={() => data != null ? pdfs(data) : {}}><FaDownload /></ActionIcon>

      <Paper p="xs" shadow="xs">
        <Flex direction="column" align="center">
          <Title order={5}>{data?.company_details.company_name}</Title>
          <Text fz={12}>{data?.company_details.address}</Text>
          <Text fz={12}>{data?.company_details.domain}; CIN: {data?.company_details.cin_no}</Text>
        </Flex>
        <Text ta="center" my="sm">
          Pay Slip for the Month of {data?.payroll_month}
        </Text>
        <ScrollArea>
          <Table
            withTableBorder
            withColumnBorders
            withRowBorders={false}
            className="table-nowrap"
            id="table1"
          >
            <Table.Thead>
              <Table.Tr style={{ borderBottom: "1px solid #dee2e6" }}>
                <Table.Th colSpan={4} ta="center" fw={500}>
                  Employee Details
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td w={200} fw={500}>
                  Name
                </Table.Td>
                <Table.Td w={200}>{data?.user_name}</Table.Td>
                <Table.Td w={200} fw={500}>
                  Payment Mode
                </Table.Td>
                <Table.Td w={200}>Direct Bank Transfer</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Employee Code</Table.Td>
                <Table.Td>{data?.emp_code}</Table.Td>
                <Table.Td fw={500}>Bank</Table.Td>
                <Table.Td>{data?.bank_name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Designation</Table.Td>
                <Table.Td>{data?.designation_name}</Table.Td>
                <Table.Td fw={500}>Bank A/c No</Table.Td>
                <Table.Td>{data?.account_number}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Department</Table.Td>
                <Table.Td>{data?.department_name}</Table.Td>
                <Table.Td fw={500}>IFSC</Table.Td>
                <Table.Td>{data?.ifsc_code}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>PAN</Table.Td>
                <Table.Td>{data?.pan_card_no}</Table.Td>
                <Table.Td fw={500}>Monthly Working Days</Table.Td>
                <Table.Td>{data?.monthly_working_days}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Loss of Pay days</Table.Td>
                <Table.Td>{data?.absent_days}</Table.Td>
                <Table.Td fw={500}>Salaried Days</Table.Td>
                <Table.Td>{ data != null ? Number(data.monthly_working_days) - Number(data.absent_days) : 0}</Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Table
            withTableBorder
            withColumnBorders
            withRowBorders={false}
            className="table-nowrap"
            id="table2"
            mt='sm'
          >
            <Table.Thead>
              <Table.Tr style={{ borderBottom: "1px solid #dee2e6" }}>
                <Table.Th w={200} fw={500}>
                  Earnings
                </Table.Th>
                <Table.Th w={200} fw={500}>
                  Amount in INR
                </Table.Th>
                <Table.Th w={200} fw={500}>
                  Deductions
                </Table.Th>
                <Table.Th w={200} fw={500}>
                  Amount in INR
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td fw={500}>Basic Salary</Table.Td>
                <Table.Td ta="end">{data?.basic_salary}</Table.Td>
                <Table.Td fw={500}>Tax</Table.Td>
                <Table.Td ta="end">{data?.tax}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>House Rent Allowance</Table.Td>
                <Table.Td ta="end">{data?.house_rent_allowance}</Table.Td>
                <Table.Td fw={500}>Other Deduction</Table.Td>
                <Table.Td ta="end">{data?.other_deduction}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Transport Allowance</Table.Td>
                <Table.Td ta="end">{data?.transport_allowance}</Table.Td>
                <Table.Td></Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Medical Allowance</Table.Td>
                <Table.Td ta="end">{data?.medical_allowance}</Table.Td>
                <Table.Td></Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td fw={500}>Other Allowances</Table.Td>
                <Table.Td ta="end">{data?.other_allowance}</Table.Td>
                <Table.Td></Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
            </Table.Tbody>
            <Table.Tfoot>
              <Table.Tr style={{ borderTop: "1px solid #dee2e6" }}>
                <Table.Th fw={500}>Total Earnings</Table.Th>
                <Table.Th ta="end">{data?.gross_salary}</Table.Th>
                <Table.Th fw={500}>Total Deductions</Table.Th>
                <Table.Th ta="end">{data != null ? Number(data.tax) + Number(data.other_deduction) : 0}</Table.Th>
              </Table.Tr>
              <Table.Tr style={{ borderTop: "1px solid #dee2e6" }}>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
                <Table.Th fw={500}>Net Pay for the month</Table.Th>
                <Table.Th ta="end">{data?.net_salary}</Table.Th>
              </Table.Tr>
            </Table.Tfoot>
          </Table>
        </ScrollArea>
      </Paper>
      </Box>
    </>
  );
}

export default GeneratePayslip;
