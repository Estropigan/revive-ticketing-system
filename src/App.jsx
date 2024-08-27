import React from 'react';
// import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login/Login';
import SideBar from './components/SideBar/SideBar';
import UsersList from './components/Pages/UsersLIst';
import Branches from './components/Pages/Branches';
import StaffLogs from './components/Pages/StaffLogs';
import TicketsHistory from './components/Pages/TicketsHistory';
import UsersManagement from './components/Pages/UsersManagement';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import AddNewUser from './components/Pages/AddNewUser';
import EditUser from './components/Pages/EditUser';


function Layout() {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/' && <SideBar />}
      <Routes>
        <Route path="/userlist" element={<UsersList />} />
        <Route path="/user-management" element={<UsersManagement />} />
        <Route path="/staff-logs" element={<StaffLogs />} />
        <Route path="/tickets-history" element={<TicketsHistory />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/add-new-user" element={<AddNewUser />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route index element={<Login />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Layout />
      </Router>
    </div>
  );
}

export default App;
