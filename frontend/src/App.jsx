import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersListPage } from './pages/UsersListPage';
import { AddUserPage } from './pages/AddUserPage';
import { ResourcesListPage } from './pages/ResourcesListPage';
import { AddResourcePage } from './pages/AddResourcePage';
import { BookingsListPage } from './pages/BookingsListPage';
import { AddBookingPage } from './pages/AddBookingPage';

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/add" element={<AddUserPage />} />
        <Route path="/resources" element={<ResourcesListPage />} />
        <Route path="/resources/add" element={<AddResourcePage />} />
        <Route path="/bookings" element={<BookingsListPage />} />
        <Route path="/bookings/add" element={<AddBookingPage />} />
      </Routes>
    </Router>
  );
}
