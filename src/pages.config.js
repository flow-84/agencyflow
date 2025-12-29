import AdminVideoManagement from './pages/AdminVideoManagement';
import Applications from './pages/Applications';
import Apply from './pages/Apply';
import ChatterDashboard from './pages/ChatterDashboard';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Home from './pages/Home';
import ModelDashboard from './pages/ModelDashboard';
import Models from './pages/Models';
import MyDocuments from './pages/MyDocuments';
import MyProfile from './pages/MyProfile';
import MyShifts from './pages/MyShifts';
import MyTraining from './pages/MyTraining';
import SelectRole from './pages/SelectRole';
import Settings from './pages/Settings';
import Shifts from './pages/Shifts';
import TeamChat from './pages/TeamChat';
import Training from './pages/Training';
import TrainingCourse from './pages/TrainingCourse';
import Users from './pages/Users';
import VIPDashboard from './pages/VIPDashboard';
import Welcome from './pages/Welcome';
import Landing from './pages/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AdminVideoManagement": AdminVideoManagement,
    "Applications": Applications,
    "Apply": Apply,
    "ChatterDashboard": ChatterDashboard,
    "Dashboard": Dashboard,
    "Documents": Documents,
    "Home": Home,
    "ModelDashboard": ModelDashboard,
    "Models": Models,
    "MyDocuments": MyDocuments,
    "MyProfile": MyProfile,
    "MyShifts": MyShifts,
    "MyTraining": MyTraining,
    "SelectRole": SelectRole,
    "Settings": Settings,
    "Shifts": Shifts,
    "TeamChat": TeamChat,
    "Training": Training,
    "TrainingCourse": TrainingCourse,
    "Users": Users,
    "VIPDashboard": VIPDashboard,
    "Welcome": Welcome,
    "Landing": Landing,
    "PrivacyPolicy": PrivacyPolicy,
    "TermsOfService": TermsOfService,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};