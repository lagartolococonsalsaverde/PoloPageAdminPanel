import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import TemplateSettings from '../pages/Template/TemplateSettings';
import ProductTemplates from '../pages/Template/ProductTemplates';
import SMSTemplates from '../pages/Template/SMSTemplates';
import Settings from '../pages/Settings/Settings';
import ProductTemplatesTabs from '../pages/Template/ProductTemplatesTabs';
import ProductTitleTemplates from '../pages/Template/ProductTitleTemplates';
import ProductMonthTemplates from '../pages/Template/ProductMonthTemplates';
import Players from '../pages/Player/Players';
import QnA from '../pages/Dashboard/QnA';
import CreatePlayer from '../pages/Player/CreatePlayer';
import UpdatePlayer from '../pages/Player/UpdatePlayer';

const isUserAuthenticated = () => {
    return !!Cookies.get('token');
};

// Protect Routes for Logged-in Users
const ProtectedRoute = ({ children }) => {
    return isUserAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Restrict Login Route for Authenticated Users
const AuthRoute = ({ children }) => {
    return isUserAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Route */}
                <Route
                    path="/login"
                    element={
                        <AuthRoute>
                            <Login />
                        </AuthRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/players"
                    element={
                        <ProtectedRoute>
                            <Players />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/create-player"
                    element={
                        <ProtectedRoute>
                            <CreatePlayer />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/update-player/:id"
                    element={
                        <ProtectedRoute>
                            <UpdatePlayer />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/qna"
                    element={
                        <ProtectedRoute>
                            <QnA />
                        </ProtectedRoute>
                    }
                />
                {/* <Route
                    path="/form-responses-list/:id/:title"
                    element={
                        <ProtectedRoute>
                            <FormResponses />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/form-response/:id"
                    element={
                        <ProtectedRoute>
                            <FormResponse />
                        </ProtectedRoute>
                    }
                /> */}
                <Route
                    path="/template-settings"
                    element={
                        <ProtectedRoute>
                            <TemplateSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sms-templates"
                    element={
                        <ProtectedRoute>
                            <SMSTemplates />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/update-sms-templates/:id"
                    element={
                        <ProtectedRoute>
                            <SMSTemplates />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/product-templates"
                    element={
                        <ProtectedRoute>
                            <ProductTemplatesTabs />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/update-product-templates/:id"
                    element={
                        <ProtectedRoute>
                            <ProductTemplates />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/product-title-template"
                    element={
                        <ProtectedRoute>
                            <ProductTitleTemplates />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/product-month-template"
                    element={
                        <ProtectedRoute>
                            <ProductMonthTemplates />
                        </ProtectedRoute>
                    }
                />
                {/* <Route
                    path="/update-product-title-template/:id"
                    element={
                        <ProtectedRoute>
                            <ProductTitleTemplate />
                        </ProtectedRoute>
                    }
                /> */}
                <Route
                    path="/user-settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
