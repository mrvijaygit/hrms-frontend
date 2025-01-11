import { useState } from 'react';
import {Collapse, UnstyledButton, Box} from '@mantine/core';
import { FaAngleRight } from 'react-icons/fa6';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from "../../redux/hook";

interface LinksGroupProps {
  icon: React.ReactNode;
  label: string;
  initiallyOpened?: boolean;
  group: { label: string; link: string; id:number, access:number[]}[];
}

export default function LinksGroup({ icon: Icon, label, initiallyOpened, group}: LinksGroupProps) {

  const [opened, setOpened] = useState(initiallyOpened || false);

  const m_user_type_id = useAppSelector(state => state.user.m_user_type_id);


  const items = group.map((link) => {
    if(link.access.includes(m_user_type_id)){
       return   <NavLink key={link.id} to={link.link} className='nav-link'>{link.label}</NavLink>
    }
    return '';
  });

  return (
    <>
      <Box className={`nav-dropdown ${opened ? 'active' : ''}`}>
        <UnstyledButton className="nav-item"  onClick={() => setOpened((o) => !o)}><Box className="nav-item-left">{Icon}</Box><Box className='nav-item-text'>{label}</Box> <Box className="nav-item-right">{<FaAngleRight/>}</Box> </UnstyledButton>
        <Collapse className="nav-drop-menu" pt='xs' in={opened}>{items}</Collapse>
      </Box>
    </>
  );
}

