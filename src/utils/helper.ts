import { alert } from "./Alert";
import { protectedApi } from "./ApiService";

export const excelDownload = async(endPoint:string, filter={})=>{
    try{
      let response = await protectedApi.get(`/excel/${endPoint}`, {
        responseType:"arraybuffer",
        params:{
          excel:true,
          filter:filter
        }
      });
      const fileName = response.headers['content-disposition'].split('=')[1];
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link and trigger a download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
    catch(error:any){
      alert.error(error);
    }
}

export const directionAccessor = (column:any) =>{
    switch (column.sortDirection) {
        case 'none':
            return { direction: 'ASC', accessor: column.id };
        case 'ASC':
            return { direction: 'DESC', accessor: column.id };
        case 'DESC':
        default:
            return { direction: 'none', accessor: column.id };
    }
}