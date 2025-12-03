import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Users from './pages/Users';
import Shifts from './pages/Shifts';
import Models from './pages/Models';
import Training from './pages/Training';
import Documents from './pages/Documents';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Applications": Applications,
    "Users": Users,
    "Shifts": Shifts,
    "Models": Models,
    "Training": Training,
    "Documents": Documents,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};