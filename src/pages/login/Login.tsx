import {Box, Button, Flex, Image, Paper, PasswordInput, ScrollArea, TextInput, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm} from '@mantine/form';
import { authApi, protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { useDispatch } from 'react-redux';
import {login} from "../../redux/userSlice"
import logo  from "../../assets/images/login_logo.jpeg";
import { FaUser, FaKey } from 'react-icons/fa6';

type LoginFormType = {
  email_id : string;
  pass_word : string;
}

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const form = useForm<LoginFormType>({
      mode: 'uncontrolled',
      initialValues: {
        email_id:'',
        pass_word:''
      },
      validate: {
        email_id: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        pass_word:(value) => (value.length > 5 ? null : 'Required')
      },
    });

    const handleSubmit = async(values:LoginFormType) => {
        let data = JSON.stringify(values);
         try{

          let res = await authApi.post('/auth/login', data);

          const {access_token, msg, refresh_token} = res.data;
          const {user_name, user_type, m_user_type_id, user_login_id} = JSON.parse(atob(access_token.split('.')[1]));

          protectedApi.defaults.headers['Authorization'] = `Bearer ${access_token}`;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          localStorage.setItem('user_info', btoa(JSON.stringify({user_name, user_type, m_user_type_id, user_login_id})));

          dispatch(login({user_name, user_type, m_user_type_id, user_login_id}));

          alert.success(msg).then(()=>{
            navigate('/dashboard', {replace:true});
          });

         }
         catch(error:any){
            alert.error(error);
         }
        
       
    };

  return (
    <>
    <ScrollArea h={window.innerHeight}>
      <Flex wrap='wrap' h={window.innerHeight} w="100%" className='login-bg' justify='center' align='center' p="sm">
          <Paper shadow='md' w={{lg:"400px", base:'100%'}} bg='gold.7' p='md' radius="lg">
            <Paper w='140px' h='100px' bg='white' radius='md' style={{overflow:"hidden"}} p='xs' m='auto'>
              <Image width="100%" height="100%" fit="contain" src={logo} className="object-pos-start" />
            </Paper>
            <Title order={5}  ta='center' my='lg' tt='uppercase'>Login to Continue</Title>
            <Box component='form' onSubmit={form.onSubmit((values)=>handleSubmit(values))}>
              <TextInput radius='lg' leftSection={<FaUser size={12}/>} placeholder="Email Address" key={form.key('email_id')} {...form.getInputProps('email_id')} />
              <PasswordInput radius='lg' leftSection={<FaKey size={12}/>} style={{borderRadius:"32px"}} placeholder="Password" key={form.key('pass_word')} {...form.getInputProps('pass_word')} mt="md" />
              <Button color='dark.6' type='submit' style={{borderRadius:"32px"}} fullWidth mt="xl">Login</Button>
            </Box>
          </Paper>
      </Flex>
    </ScrollArea>

    </>
  )
}

export default Login