import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import '@/plugins/fontawesome'

import GuestLayout from './components/Layout/GuestLayout'
import ProtectedLayout from './components/Layout/ProtectedLayout'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFoundPage from './pages/NotFoundPage'

import Dashboard from './pages/Dashboard'
import FamilyPage from './pages/FamilyPage'
import EventsPage from './pages/EventsPage'
import ServicesPage from './pages/ServicesPage'
import AccountPage from './pages/AccountPage'

import PersonsList from './components/Family/PersonsList'
import EventsList from './components/Events/EventsList'
import EventAdd from './components/Events/EventAdd'
import EventEdit from './components/Events/EventEdit'
import ServicesList from './components/Services/ServicesList'
import ServiceAdd from './components/Services/ServiceAdd'
import ServiceEdit from './components/Services/ServiceEdit'
import PersonEdit from './components/Family/PersonEdit'
import PersonAdd from './components/Family/PersonAdd'

const RootComponent: React.FC = () => {
    return (
        <div>
            <Router>
                <Routes>
                    <Route path="/" element={<GuestLayout />}>
                        <Route path="/" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/password/forgot" element={<ForgotPasswordPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                    <Route path="/" element={<ProtectedLayout />}>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="family" element={<FamilyPage />}>
                            <Route index path="" element={<PersonsList />} />
                            <Route path="person/new" element={<PersonAdd />} />
                            <Route path="person/edit/:id" element={<PersonEdit />} />
                        </Route>
                        <Route path="events" element={<EventsPage />}>
                            <Route index path="" element={<EventsList />} />
                            <Route path="new" element={<EventAdd />} />
                            <Route path="edit/:id" element={<EventEdit />} />
                        </Route>
                        <Route path="services" element={<ServicesPage />}>
                            <Route index path="" element={<ServicesList />} />
                            <Route path="new" element={<ServiceAdd />} />
                            <Route path="edit/:id" element={<ServiceEdit />} />
                        </Route>
                        <Route path="account" element={<AccountPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </Router>
        </div>
    )
}

export default RootComponent
