import {Box, Button, Flex, Image, PasswordInput, ScrollArea, Text, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useForm} from '@mantine/form';
import { authApi, protectedApi } from '../../utils/ApiService';
import { alert } from '../../utils/Alert';
import { useDispatch } from 'react-redux';
import {login} from "../../redux/userSlice"
import loginImg from "../../assets/images/login.gif";
import logo  from "../../assets/images/login_logo.jpeg";
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
      <Flex wrap='wrap' h={window.innerHeight} p={{lg:'xl', md:'md', base:'xs'}}>
        <Flex w={{lg:'50%'}} bg='#f4f6fa' p={{lg:'lg', md:'md', base:'xs'}} justify='center' align='center'>
            <Image src={loginImg} height={380} fit="contain"/>
        </Flex>
        <Flex flex={{lg:'50%'}} px='sm' direction='column' justify='center' align='center'>
          <Box w={{md:'60%', base:'100%'}}>
            <Image  height="80px" mb="xs" fit="contain" src={logo} className="object-pos-start" />
            <Text c='dimmed' ta='center' my='xs'>Enter your credentials to access your account</Text>
            <Box component='form' mt='lg' onSubmit={form.onSubmit((values)=>handleSubmit(values))}>
              <TextInput label="Email Address" key={form.key('email_id')} {...form.getInputProps('email_id')} />
              <PasswordInput label="Password" key={form.key('pass_word')} {...form.getInputProps('pass_word')} mt="md" />
              <Button type='submit' fullWidth mt="xl">Sign In</Button>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </ScrollArea>

    </>
  )
}

export default Login