import { Flex, Title, UnstyledButton, Menu, Group, Text, Box, Avatar , useMantineTheme} from "@mantine/core"
import { FaBars } from "react-icons/fa6";
import { useState } from "react";
import cx from 'clsx';
import { GoGear } from "react-icons/go";
import { IoLogOutOutline } from "react-icons/io5";
import { LiaExchangeAltSolid } from "react-icons/lia";

import classes from '../../assets/css/Header.module.scss';
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import { panelControl } from "../../redux/layoutSlice";
import { logout } from "../../redux/userSlice";

function Titlebar() {

  const navigate = useNavigate();
  const theme = useMantineTheme();

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user);
  const layout = useAppSelector((state) => state.layout);

  const [userMenuOpened, setUserMenuOpened] = useState(false);


  return (
    <Flex component="header" justify='space-between' align='center' px='sm' py='xs' bg='white'>
      <UnstyledButton onClick={()=>{dispatch(panelControl(!layout.panelActive))}}><FaBars/></UnstyledButton>
      <Title order={5}>HRMS</Title>
      <Flex gap='xs' align='center'>
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
          >
            <Menu.Target>
              <UnstyledButton py={0} className={cx(classes.user, { [classes.userActive]: userMenuOpened })}>
                <Group align="center" gap='xs'>
                  <Avatar color={theme.primaryColor} name={userInfo.user_name}/>
                  <Box>
                    <Text fw={500} fz="sm">{userInfo.user_name}</Text>
                    <Text fw={500} fz="xs" c='dimmed' lh={1}>{userInfo.user_type}</Text>
                  </Box>
                </Group>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item leftSection={<GoGear/>} onClick={()=>{navigate("/profile")}}>
                Account settings
              </Menu.Item>
              <Menu.Item leftSection={<LiaExchangeAltSolid/>}>
                Change Password
              </Menu.Item>
              <Menu.Divider/>
              <Menu.Item color="red" leftSection={<IoLogOutOutline/>} onClick={()=>{dispatch(logout()); navigate('/')}}>Logout</Menu.Item>
            </Menu.Dropdown>
        </Menu>
      </Flex>
      
    </Flex>
  )
}

export default Titlebar