import { createBrowserRouter } from "react-router-dom";

import ApplyJobs from "../component/users/internEmployee/ApplyJobs";
import TimeSheet from "../component/users/internEmployee/TimeSheet";
import TestInput from "../component/users/internEmployee/TestInput";
import RoleSelector from "../component/authentication/roleSelector/RoleSelector";
import InternRegister from "../component/authentication/internRegister/InternRegister";
import SignIn from "../component/authentication/signIn/SignIn";
import PasswordRecovery from "../component/authentication/signIn/PasswordRecovery";
import ResetPassword from "../component/authentication/signIn/ResetPassword";
import BankAccount from "../component/users/internEmployee/BankAccount";
import TempMainLayout from "../component/layouts/tempEmployeeLayout/TempMainLayout";
import TempApplyJob from "../component/users/temporaryEmployee/TempApplyJob";
import AdminMainLayout from "../component/layouts/adminLayout/AdminMainLayout";
import Overview from "../component/users/admin/Overview";
import RequestList from "../component/users/admin/RequestList";
// import AdminCalender from "../component/users/admin/adminCalender/AdminCalender";
import TimeSheetTemp from "../component/users/temporaryEmployee/TimeSheetTemp";
import PayrollCalender from "../component/users/internEmployee/PayrollCalender";
import InternMainLayout from "../component/layouts/internUsersLayout/InternMainLayout";
import Otp from "../component/authentication/signIn/Otp";
import AdminForm from "../component/users/admin/adminForm/AdminForm";
import ProtectedRoute from "./ProtectedRoute";
import Unauthorized from "../component/layouts/UnauthorizePage";
import AdminCalender from "../component/users/admin/adminCalender/AdminCalender";
import TempPayrollCalender from "../component/users/temporaryEmployee/TempPayrollCalender";
import PdfViewer from "../component/users/temporaryEmployee/TemporaryPdf";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/register",
    element: <InternRegister />,
  },
  {
    path: "/role-selector",
    element: <RoleSelector />,
  },
  {
    path: "/password-recovery",
    element: <PasswordRecovery />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/otp",
    element: <Otp />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },

  // Protected routes for Fit2Lead ..
  {
    element: <ProtectedRoute allowedRoles={["Fit2Lead Intern"]} />,
    children: [
      {
        path: "/",
        element: <InternMainLayout />,
        children: [
          { index: true, element: <ApplyJobs /> },
          { path: "time-sheet", element: <TimeSheet /> },
          { path: "payroll-calendar", element: <PayrollCalender /> },

          // { path: "test-input", element: <TestInput /> },
          // { path: "bank-details", element: <BankAccount /> },
        ],
      },
    ],
  },
  //Temporary Emploiyee route..
  {
    element: <ProtectedRoute allowedRoles={["Temporary Employee"]} />,
    children: [
      {
        path: "/temporary-employee",
        element: <TempMainLayout />,
        children: [
          { index: true, element: <TempApplyJob /> },
          { path: "time-sheet-temp", element: <TimeSheetTemp /> },
          { path: "payroll-calendar", element: <TempPayrollCalender /> },
          { path: "/temporary-employee/view-pdf", element: <PdfViewer /> },
        ],
      },
    ],
  },

  //Protected Admin route,,,
  {
    element: <ProtectedRoute allowedRoles={["Administrator"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminMainLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: "request-list", element: <RequestList /> },
          { path: "admin-calender", element: <AdminCalender /> },
          { path: "admin-form", element: <AdminForm /> },
        ],
      },
    ],
  },
]);

export default router;
