import { ActionIcon, Box , Flex, Image, Title} from "@mantine/core"
import {NavLink} from "react-router-dom";
import {FaUsers, FaCalendar, FaClipboardList, FaMoneyBill, FaBullhorn, FaCalendarCheck, FaXmark} from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";
import favicon  from "../../assets/images/favicon.png";
import LinksGroup from "./LinksGroup";
import { useAppSelector, useAppDispatch } from "../../redux/hook";
import { panelControl } from "../../redux/layoutSlice";

function SideBar() {  

  const m_user_type_id = useAppSelector(state => state.user.m_user_type_id);
  const panelActive = useAppSelector(state => state.layout.panelActive);
  const dispatch = useAppDispatch();
  const locationUrl = window.location.href;

  const NavbarLinks = [
    { label: 'Dashboard', icon: <RxDashboard/>, id:1, link:'/dashboard', access:[1000,100, 20, 1]},
    {
      label: 'Employees',
      icon: <FaUsers/>,
      initiallyOpened: locationUrl.includes('/employees/'),
      group: [
        { label: 'Employee Management', link: '/employees/list', id:2, access:[1000,100]},
        { label: 'Employee Form', link: '/employees/form', id:3, access:[1000,100]},
      ],
      group_access:[1000,100] 
    },
    {
      label: 'Attendance',
      icon: <FaCalendar/>,
      initiallyOpened: locationUrl.includes('/attendance/'),
      group: [
        { label: 'Attendance List', link: '/attendance/list', id:4, access:[1000,100,20,1]},
      ],
      group_access:[1000,100,20,1]
    },
    {
      label: 'Leaves',
      icon: <FaCalendarCheck/>,
      initiallyOpened: locationUrl.includes('/leaves/'),
      group: [
        { label: 'Leave Types', link: '/leaves/types', id:7, access:[1000,100]},
        { label: 'Holidays', link: '/leaves/holidays', id:8, access:[1000,100]},
        { label: 'My Leaves', link: '/leaves/myleaves', id:99, access:[100, 20, 1]},
        { label: 'Leave Requests', link: '/leaves/requests', id:9, access:[1000,100, 20]}
      ],
      group_access:[1000,100, 20, 1]
    },
    {
      label: 'Projects',
      icon: <FaClipboardList/>,
      initiallyOpened: locationUrl.includes('/projects/'),
      group: [
        { label: 'Clients', link: '/projects/clients', id:11, access:[1000,100]},
        { label: 'Project List', link: '/projects/list', id:12, access:[1000,100, 20, 1]},
        { label: 'Team', link: '/projects/team', id:13, access:[1000,100, 20, 1]},
        { label: 'Tasks', link: '/projects/tasks', id:14, access:[1000,100, 20, 1]},
      ],
      group_access:[1000,100, 20, 1]
    },
    {
      label: 'Payroll',
      icon: <FaMoneyBill/>,
      initiallyOpened: locationUrl.includes('/payroll/'),
      group: [
        { label: 'Payroll List', link: '/payroll', id:15, access:[1000,100, 20, 1]}
      ],
      group_access:[1000,100, 20, 1]
    },
    {
      label: 'HR Announcements',
      icon: <FaBullhorn/>,
      initiallyOpened: locationUrl.includes('/announcements/'),
      group: [
        { label: 'Notice', link: '/announcements/notice', id:17, access:[1000,100]},
      ],
      group_access:[1000,100]
    }
  ];
  
  const links = NavbarLinks.map((item) => {
    if(item.group != undefined && item.group_access.includes(m_user_type_id)){
      return <LinksGroup {...item} key={item.label}/>;
    }
    else if(item.link != undefined && item.access.includes(m_user_type_id)){
      return <NavLink className="nav-item" to={item.link} key={item.id}><Box className="nav-item-left">{item.icon}</Box><Box className="nav-item-text">{item.label}</Box></NavLink>;
    }
    return '';
  });

  return (
    <Box className="sidebar">
      <Flex component="header" align='center' justify={{md:'flex-start', base:'space-between'}} px={16} py={8} gap={16}>
        <Image height="40px" fit="contain" src={favicon} className="object-pos-center" />
        {
          window.innerWidth >= 992 && <Title order={3} fw={700}>ZAPSOFTEK</Title>
        }
        {
          window.innerWidth < 992 && <ActionIcon variant='light' color="dark.6" onClick={()=>{dispatch(panelControl(!panelActive))}}><FaXmark/></ActionIcon>
        }
      </Flex>
      <Flex className="navbar" direction='column' py={8} px={16} gap='xs'>{links}</Flex>
    </Box>
  )
}

export default SideBar