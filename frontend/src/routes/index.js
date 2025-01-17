import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
import LandingPage from "../pages/LandingPage/LandingPage"
import HomePage from "../pages/HomePage/HomePage"
import LoginPage from "../pages/LoginPage/LoginPage"
import RegisterPage from "../pages/RegisterPage/RegisterPage"
import MyAccountPage from "../pages/MyAccountPage/MyAccountPage"
import HistoryPage from "../pages/HistoryPage/HistoryPage"
import ServicePage from "../pages/ServicePage/ServicePage"
import BuyPage from "../pages/BuyPage/BuyPage"
import BuySuccessPage from "../pages/BuySuccessPage/BuySuccessPage"
import BuyErrorPage from "../pages/BuyErrorPage/BuyErrorPage"
import ReportPage from "../pages/ReportPage/ReportPage"
import SupportPage from "../pages/SupportPage/SupportPage"
import AdminHistoryPage from "../pages/AdminHistoryPage/AdminHistoryPage"
import AdminSystemSettingPage from "../pages/AdminSystemSettingPage/AdminSystemSettingPage"
import AdminHome from "../pages/AdminHome/AdminHome"
import ManageUserPage from "../pages/ManageUserPage/ManageUserPage"
import ManagePrinterPage from "../pages/ManagePrinterPage/ManagePrinterPage"

export const routes = [
    {
        path: '/',
        page: LandingPage,
    },
    {
        path: '/home',
        page: HomePage,
        isShowDashboard: true,
        pageIndex: 1,
    },
    {
        path: '/auth/login',
        page: LoginPage,
    },
    {
        path: '/auth/register',
        page: RegisterPage,
    },
    {
        path: '/myaccount',
        page: MyAccountPage, 
        isShowDashboard: true,
        pageIndex: 2,
    },
    {
        path: '/service',
        page: ServicePage, 
        isShowDashboard: true,
        pageIndex: 3,
    },
    {
        path: '/history',
        page: HistoryPage, 
        isShowDashboard: true,
        pageIndex: 4,
    },
    {
        path: '/buy',
        page: BuyPage,
        isShowDashboard: true,
        pageIndex: 5,
    },
    {
        path: '/buy/success',
        page: BuySuccessPage,
        isShowDashboard: true,
        pageIndex: 5,
    },
    {
        path: '/buy/error',
        page: BuyErrorPage,
        isShowDashboard: true,
        pageIndex: 5,
    },
    {
        path: '/support',
        page: SupportPage,
        isShowDashboard: true,
        pageIndex: 6,
    },
    {
        path: '/admin/home',
        page: AdminHome,
        isShowDashboardAdmin: true,
        pageIndex: 1,
    },
    {
        path: '/admin/user-management',
        page: ManageUserPage,
        isShowDashboardAdmin: true,
        pageIndex: 2,
    },
    {
        path: '/admin/printer-management',
        page: ManagePrinterPage,
        isShowDashboardAdmin: true,
        pageIndex: 3,
    },
    {
        path: '/admin/print-history',
        page: AdminHistoryPage,
        isShowDashboardAdmin: true,
        pageIndex: 4,
    },
    {
        path: '/admin/usage-reports',
        page: ReportPage,
        isShowDashboardAdmin: true,
        pageIndex: 5,
    },
    {
        path: '/admin/system-settings',
        page: AdminSystemSettingPage,
        isShowDashboardAdmin: true,
        pageIndex: 6,
    },
    {
        path: '*',
        page: NotFoundPage
    }
]