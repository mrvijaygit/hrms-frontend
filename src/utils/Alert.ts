import Swal from 'sweetalert2';

class Alert {
    error = async (values:string, showConfirmBtn:boolean = false)=>{
        return Swal.fire({
            icon:'error',
            title: values,
            allowOutsideClick:false,
            allowEscapeKey:false,
            showConfirmButton: showConfirmBtn,
            timer: showConfirmBtn ? undefined : 1500
        })
    }
    success = async (values:string)=>{
        return Swal.fire({
            icon:'success',
            title: values,
            allowOutsideClick:false,
            allowEscapeKey:false,
            showConfirmButton: false,
            timer: 1500
        })
    }
    question = async (values:string)=>{
        return Swal.fire({
            icon:'question',
            title: values,
            allowOutsideClick:false,
            allowEscapeKey:false,
            showCancelButton:true,
        })
    }
}

export const alert = new Alert();