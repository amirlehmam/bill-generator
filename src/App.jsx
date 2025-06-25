import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import InvoiceCreator from './components/InvoiceCreator'
import InvoicePreview from './components/InvoicePreview'
import WebInvoiceViewer from './components/WebInvoiceViewer'
import PaymentSuccess from './components/PaymentSuccess'
import PaymentCancel from './components/PaymentCancel'
import Header from './components/Header'

// Composant pour les routes protégées
const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth()

  // Affichage du loader pendant la vérification de session
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de la session...</p>
        </div>
      </div>
    )
  }

  // Si non authentifié, afficher la page de login
  if (!isAuthenticated) {
    return <Login />
  }

  // Si authentifié, afficher l'application complète
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<InvoiceCreator />} />
          <Route path="/preview/:id" element={<InvoicePreview />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-cancel" element={<PaymentCancel />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route publique pour la visualisation des factures */}
          <Route path="/invoice/view/:shareId" element={<WebInvoiceViewer />} />
          
          {/* Toutes les autres routes sont protégées */}
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App 