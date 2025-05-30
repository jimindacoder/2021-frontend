import React from 'react';

import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate} from 'react-router-dom';

import Register from './Register';
import Login from './Login';
import Dashboard from './DashBoard';
import CreateDespatchAdvice from './CreateDespatchAdvice';
import Layout from './Layout';
import GetAllAdvices from './AllAdvice';
import FilterDespatchAdvice from './FilterDespatchAdvice';
import UpdateDespatchAdvice from './UpdateDespatchAdvice';
import Inventory from './Inventory';
import Status from './Status';
import Delete from './Delete';
import Report from './Report';

function Pages() {
  const [token, setToken] = useState(null);
  const [name, setName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(sessionStorage.getItem('token'));
  }, []);

  const successLoginRegister = (token, name) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('name', name);
    setToken(token);
    setName(name);
    navigate('/dashboard');
  }
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Navigate to="/register" />} />
      <Route path="/login" element={<Login token={token} successLoginRegister={successLoginRegister}/>} />
      <Route path="/register" element={<Register token={token} successLoginRegister={successLoginRegister}/>} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/despatchAdvice" element={<CreateDespatchAdvice token={token} />} />
        <Route path="/despatchAdvice/list" element={<GetAllAdvices token={token}/>} />
        <Route path="/despatchAdvice/filter" element={<FilterDespatchAdvice token={token}/>} />
        <Route path="/despatchAdvice/update" element={<UpdateDespatchAdvice token={token}/>} />
        <Route path="/despatchAdvice/product" element={<Inventory token={token}/>} />
        <Route path="/despatchAdvice/update/status" element={<Status token={token}/>} />
        <Route path="/despatchAdvice/delete" element={<Delete token={token}/>} />
        <Route path="/despatchAdvice/report" element={<Report token={token}/>} />
      </Route>
    </Routes>
</>
  )
}

export default Pages;
