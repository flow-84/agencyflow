import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Users from './pages/Users';
import Shifts from './pages/Shifts';
import Models from './pages/Models';
import Training from './pages/Training';
import Documents from './pages/Documents';
import ChatterDashboard from './pages/ChatterDashboard';
import MyShifts from './pages/MyShifts';
import MyTraining from './pages/MyTraining';
import ModelDashboard from './pages/ModelDashboard';
import MyProfile from './pages/MyProfile';
import MyDocuments from './pages/MyDocuments';
import Settings from './pages/Settings';
import Apply from './pages/Apply';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Applications": Applications,
    "Users": Users,
    "Shifts": Shifts,
    "Models": Models,
    "Training": Training,
    "Documents": Documents,
    "ChatterDashboard": ChatterDashboard,
    "MyShifts": MyShifts,
    "MyTraining": MyTraining,
    "ModelDashboard": ModelDashboard,
    "MyProfile": MyProfile,
    "MyDocuments": MyDocuments,
    "Settings": Settings,
    "Apply": Apply,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};