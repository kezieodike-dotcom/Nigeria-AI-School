/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import BecomeCreator from './pages/BecomeCreator';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreatorDashboard from './pages/CreatorDashboard';
import CreatorProfile from './pages/CreatorProfile';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import { ToastContainer } from './components/Toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

import HowItWorks from './pages/HowItWorks';

import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import Blog from './pages/Blog';
import Socials from './pages/Socials';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ErrorBoundary>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/cart" element={<Cart />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/creator-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['creator', 'admin']}>
                    <CreatorDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/socials" element={<Socials />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/become-creator" element={<BecomeCreator />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/creator-profile" 
                element={
                  <ProtectedRoute>
                    <CreatorProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="/creator/:id" element={<CreatorProfile />} />
            </Routes>
          </Layout>
          <ToastContainer />
        </ErrorBoundary>
      </Router>
    </AuthProvider>
  );
}
