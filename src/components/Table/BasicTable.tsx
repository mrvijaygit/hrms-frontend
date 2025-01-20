import { Box, Table, useMantineTheme} from "@mantine/core"
import { memo } from "react";
import {Column, useTable, useSortBy} from "react-table";

interface TablePropsType<T extends object> {
    columns:Column<T>[],
    data:T[],
    onHeaderClick:Function
}

function TableComponent<T extends object>({columns, data, onHeaderClick}:TablePropsType<T>) {

    const theme = useMantineTheme();

    const tableInstance = useTable({
            columns: columns,
            data:data,
            manualSortBy:true,
        }, useSortBy);
    
    const {getTableProps, getTableBodyProps, headerGroups, prepareRow, rows} = tableInstance;

  return (
    <>
        <Table {...getTableProps()} className="table-layout-fixed">
              <Table.Thead bg={theme.colors.dark[6]} c='white' pos='sticky'>
                  {headerGroups.map((headerGroup, index)=>{
                  return <Table.Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                          {
                              headerGroup.headers.map((column, index)=>{
                                if(column.visible != undefined && column.visible == false){
                                    return null
                                }
                                else{
                                    return  <Table.Th className={column?.headerClassName || ""} {...column.getHeaderProps(column.getSortByToggleProps())} key={index} style={{width:`${column.width}px`}} 
                                    onClick={() => onHeaderClick(column)}>
                                      <Box className={`table-sorting ${column.canSort ? "active" : ""}`} data-sort={column?.sortDirection || ""}>{column.render('Header')}</Box>
                                    </Table.Th>
                                }
                              
                              })
                          }
                      </Table.Tr>
                  })}
              </Table.Thead>
              <Table.Tbody {...getTableBodyProps()}>
                  {rows.map((row, index)=>{
                      prepareRow(row);
                      return(
                          <Table.Tr {...row.getRowProps()} key={index}>
                              {     
                                row.cells.map((cell, index)=>{

                                    if(cell.column.visible != undefined && cell.column.visible == false){
                                        return null;
                                    }
                                    else{
                                        return <Table.Td className={cell.column.headerClassName || ""} {...cell.getCellProps()} key={index}>{cell.render('Cell')}</Table.Td>;
                                    }

                                })
                              }
                          </Table.Tr>
                      )
                  })}
              </Table.Tbody>
          </Table>
    </>
  )
}

const BasicTable = memo(TableComponent) as typeof TableComponent;

export default BasicTable;