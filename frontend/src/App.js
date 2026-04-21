import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ClientsProvider } from './contexts/ClientsContext';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import ClientDetail from './components/ClientDetail';
import InterestManager from './components/InterestManager';
import NotFound from './components/NotFound';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/clientes" element={<ProtectedRoute><ClientList /></ProtectedRoute>} />
      <Route path="/cliente/detalle/:id" element={<ProtectedRoute><ClientDetail /></ProtectedRoute>} />
      <Route path="/cliente/nuevo" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/cliente/editar/:id" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
      <Route path="/intereses" element={<ProtectedRoute><InterestManager /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClientsProvider>
          <AppRoutes />
        </ClientsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;