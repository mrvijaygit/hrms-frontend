import { Box , Flex, Image} from "@mantine/core"
import {NavLink} from "react-router-dom";
import {FaUsers, FaCalendar, FaClipboardList, FaMoneyBill, FaBullhorn, FaCalendarCheck} from "react-icons/fa6";
import { RxDashboard } from "react-icons/rx";

import logo  from "../../assets/images/logo.png";
import favicon  from "../../assets/images/favicon.png";
import LinksGroup from "./LinksGroup";
import { useAppSelector } from "../../redux/hook";


function SideBar() {  

  const m_user_type_id = useAppSelector(state => state.user.m_user_type_id);

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
        { label: 'Attendace List', link: '/attendance/list', id:4, access:[1000,100,20,1]},
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
        { label: 'My Leaves', link: '/myleaves', id:99, access:[100, 20, 1]},
        { label: 'Leave Requests', link: '/leaverequests', id:9, access:[1000,100, 20]}
      ],
      group_access:[1000,100, 20, 1]
    },
    {
      label: 'Projects',
      icon: <FaClipboardList/>,
      initiallyOpened: locationUrl.includes('/projects/'),
      group: [
        { label: 'Clients Management', link: '/clientsManagement', id:11, access:[1000,100]},
        { label: 'Project List', link: '/projects', id:12, access:[1000,100, 20, 1]},
      ],
      group_access:[1000,100, 20, 1]
    },
    {
      label: 'Payroll',
      icon: <FaMoneyBill/>,
      initiallyOpened: locationUrl.includes('/payroll/'),
      group: [
        { label: 'Payroll List', link: '/payroll', id:14, access:[1000,100, 20, 1]}
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
 
  const layout = useAppSelector((state) => state.layout);
  
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
      <Flex component="header" align='center' px={16} py={8}>
        <Image width='100%' height="26px" fit="contain" src={favicon} className="object-pos-start" />
        {
          layout.panelActive == false && <Image width='100%' height="32px" fit="contain" src={logo} className="object-pos-start" />
        }
      </Flex>
      <Flex className="navbar" direction='column' py={8} px={16} gap='xs'>{links}</Flex>
    </Box>
  )
}

export default SideBar