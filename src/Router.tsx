import{ lazy} from 'react';
import { Route, Routes} from 'react-router-dom';

import RequiredAuth from './utils/RequiredAuth';


import Login from './pages/login/Login';
import Layout from './components/layout/Layout';
import DashboardContext from "./contextapi/DashboardContext";
import EmployeeFormContext from "./contextapi/EmployeeFormContext";
import EmployeeListContext from "./contextapi/EmployeeListContext";
import { HolidayContext, LeaveTypeContext , ClientsContext, ProjectsContext, TeamContext, TasksContext, AReportContext, ACycleContext, AppraiseeContext, CompetencyContext, TimeContext} from './contextapi/GenericContext';
import NoticeContext from './contextapi/NoticeContext';
import AttendanceContent from './contextapi/AttendanceContent';
import PayrollContext from './contextapi/PayrollContext';
import LeaveRequestContext from './contextapi/LeaveRequestContext';
import MyReviewContext from './contextapi/MyReviewContext';

import EmployeesForm from "./pages/employees/Form";
import Dashboard from './pages/dashboard/Dashboard';
const NotFound = lazy(()=> import('./pages/NotFound'));

const EmployeesList = lazy(()=> import('./pages/employees/List'));

const Holidays = lazy(()=> import('./pages/leaves/Holidays'));
const LeaveType = lazy(()=> import('./pages/leaves/LeaveType'));
const MyLeaves = lazy(()=> import('./pages/leaves/MyLeaves'));
const LeavesRequests = lazy(()=> import('./pages/leaves/Requests'));
const LeavesRequestsView = lazy(()=> import('./pages/leaves/View'));

const AttendanceList = lazy(()=> import('./pages/attendance/List'));
const AttendanceReport = lazy(()=> import('./pages/attendance/Report'));

const Clients = lazy(()=> import('./pages/projects/Clients'));
const ProjectsList = lazy(()=> import('./pages/projects/List'));
const ProjectView = lazy(()=> import('./pages/projects/View'));
const Team = lazy(()=> import('./pages/projects/Team'));
const Tasks = lazy(()=> import('./pages/projects/Tasks'));
const TimeSheets = lazy(()=> import('./pages/projects/TimeSheets'));

const GeneratePayslip = lazy(()=> import('./pages/payroll/GeneratePayslip'));
const PayrollList = lazy(()=> import('./pages/payroll/List'));

const Notices = lazy(()=> import('./pages/announcements/Notice'));

const Profile = lazy(()=> import('./pages/employees/Profile'));

const AppraisalCycle = lazy(()=> import('./pages/perfomance/AppraisalCycle'));
const AppraiseeList = lazy(()=> import('./pages/perfomance/AppraiseeList'));
const Competency = lazy(()=> import('./pages/perfomance/Competency'));
const MyReview = lazy(()=> import('./pages/perfomance/MyReview'));

export default function Router(){

    return (
        <Routes>
            <Route path='*' element={<NotFound />} />
            <Route path='/' element={<Login />} />

            <Route element={<Layout/>} >
                <Route path='/dashboard' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><DashboardContext><Dashboard /></DashboardContext></RequiredAuth>} />

                <Route path='/employees/form' element={<RequiredAuth m_user_type_id={[1000, 100]}><EmployeeFormContext><EmployeesForm /></EmployeeFormContext></RequiredAuth>} />
                <Route path='/employees/list' element={<RequiredAuth m_user_type_id={[1000, 100]}><EmployeeListContext><EmployeesList /></EmployeeListContext></RequiredAuth>} />

                <Route path='/leaves/holidays' element={<RequiredAuth m_user_type_id={[1000, 100]}><HolidayContext><Holidays /></HolidayContext></RequiredAuth>} />
                <Route path='/leaves/types' element={<RequiredAuth m_user_type_id={[1000, 100]}><LeaveTypeContext><LeaveType /></LeaveTypeContext></RequiredAuth>} />
                <Route path='/leaves/myleaves' element={<RequiredAuth m_user_type_id={[100, 20, 1]}><LeaveRequestContext><MyLeaves /></LeaveRequestContext></RequiredAuth>} />
                <Route path='/leaves/requests' element={<RequiredAuth m_user_type_id={[1000, 100, 20]}><LeaveRequestContext><LeavesRequests /></LeaveRequestContext></RequiredAuth>} />
                <Route path='/leaves/requests/view' element={<RequiredAuth m_user_type_id={[1000, 100, 20]}><LeavesRequestsView/></RequiredAuth>} />

                <Route path='/attendance/list' element={<RequiredAuth m_user_type_id={[1000, 100,20,1]}><AttendanceContent><AttendanceList /></AttendanceContent></RequiredAuth>} />
                <Route path='/attendance/report' element={<RequiredAuth m_user_type_id={[1000, 100]}> <AReportContext><AttendanceReport /></AReportContext></RequiredAuth>} />

                <Route path='/projects/clients' element={<RequiredAuth m_user_type_id={[1000, 100]}><ClientsContext><Clients /></ClientsContext></RequiredAuth>} />
                <Route path='/projects/list' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><ProjectsContext><ProjectsList /></ProjectsContext></RequiredAuth>} />
                <Route path='/projects/view' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><ProjectView /></RequiredAuth>} />
                <Route path='/projects/team' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><TeamContext><Team/></TeamContext></RequiredAuth>} />
                <Route path='/projects/tasks' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><TasksContext><Tasks/></TasksContext></RequiredAuth>} />
                <Route path='/projects/timesheets' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><TimeContext><TimeSheets/></TimeContext></RequiredAuth>} />

                <Route path='/payroll/generatePayslip' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><GeneratePayslip /></RequiredAuth>} />
                <Route path='/payroll' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><PayrollContext><PayrollList /></PayrollContext></RequiredAuth>} />

                <Route path='/announcements/notice' element={<RequiredAuth m_user_type_id={[1000, 100]}><NoticeContext><Notices /></NoticeContext></RequiredAuth>} />

                <Route path='/employees/list/profile' element={<RequiredAuth m_user_type_id={[1000, 100, 20, 1]}><Profile /></RequiredAuth>} />

                <Route path='/performance/appraisalcycle' element={<RequiredAuth m_user_type_id={[1000]}><ACycleContext><AppraisalCycle /></ACycleContext></RequiredAuth>} />
                <Route path='/performance/appraisalcycle/appraiseelist' element={<RequiredAuth m_user_type_id={[1000,100,20]}><AppraiseeContext><AppraiseeList /></AppraiseeContext></RequiredAuth>} />
                <Route path='/performance/competency' element={<RequiredAuth m_user_type_id={[1000]}><CompetencyContext><Competency /></CompetencyContext></RequiredAuth>} />
                <Route path='/performance/myreview' element={<RequiredAuth m_user_type_id={[1000,100,20,1]}><MyReviewContext><MyReview /></MyReviewContext></RequiredAuth>} />
            </Route>

        </Routes>
    );
}





