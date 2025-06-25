import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import InvoiceCreator from './components/InvoiceCreator'
import InvoicePreview from './components/InvoicePreview'
import WebInvoiceViewer from './components/WebInvoiceViewer'
import PaymentSuccess from './components/PaymentSuccess'
import PaymentCancel from './components/PaymentCancel'
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<InvoiceCreator />} />
            <Route path="/preview/:id" element={<InvoicePreview />} />
            <Route path="/invoice/view/:shareId" element={<WebInvoiceViewer />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 