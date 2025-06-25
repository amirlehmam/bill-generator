import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  PlusIcon, 
  DocumentArrowUpIcon, 
  EyeIcon, 
  PencilIcon,
  TrashIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [invoices, setInvoices] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    totalAmount: 0
  })

  useEffect(() => {
    // Charger les factures depuis le localStorage
    const savedInvoices = localStorage.getItem('arlm-invoices')
    if (savedInvoices) {
      const parsedInvoices = JSON.parse(savedInvoices)
      setInvoices(parsedInvoices)
      
      // Calculer les statistiques
      const stats = parsedInvoices.reduce((acc, invoice) => {
        acc.total++
        acc.totalAmount += invoice.totalTTC || 0
        
        if (invoice.status === 'paid') {
          acc.paid++
        } else {
          acc.pending++
        }
        
        return acc
      }, { total: 0, pending: 0, paid: 0, totalAmount: 0 })
      
      setStats(stats)
    }
  }, [])

  const deleteInvoice = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      const updatedInvoices = invoices.filter(invoice => invoice.id !== id)
      setInvoices(updatedInvoices)
      localStorage.setItem('arlm-invoices', JSON.stringify(updatedInvoices))
      
      // Recalculer les statistiques
      const newStats = updatedInvoices.reduce((acc, invoice) => {
        acc.total++
        acc.totalAmount += invoice.totalTTC || 0
        
        if (invoice.status === 'paid') {
          acc.paid++
        } else {
          acc.pending++
        }
        
        return acc
      }, { total: 0, pending: 0, paid: 0, totalAmount: 0 })
      
      setStats(newStats)
    }
  }

  const toggleInvoiceStatus = (id) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice.id === id 
        ? { ...invoice, status: invoice.status === 'paid' ? 'pending' : 'paid' }
        : invoice
    )
    setInvoices(updatedInvoices)
    localStorage.setItem('arlm-invoices', JSON.stringify(updatedInvoices))
    
    // Recalculer les statistiques
    const newStats = updatedInvoices.reduce((acc, invoice) => {
      acc.total++
      acc.totalAmount += invoice.totalTTC || 0
      
      if (invoice.status === 'paid') {
        acc.paid++
      } else {
        acc.pending++
      }
      
      return acc
    }, { total: 0, pending: 0, paid: 0, totalAmount: 0 })
    
    setStats(newStats)
  }

  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount || 0)
    
    // Fix pour affichage cohérent : remplacer les caractères problématiques
    return formatted
      .replace(/\u00A0/g, ' ')  // Remplacer l'espace insécable par un espace normal
      .replace(/\//g, ' ')      // Remplacer les slashes par des espaces
      .replace(/\u202F/g, ' ')  // Remplacer l'espace fine par un espace normal
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec actions rapides */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Gérez vos factures et suivez vos paiements</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Link
            to="/create"
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Nouvelle Facture</span>
          </Link>
          
          <button className="btn-secondary flex items-center space-x-2">
            <DocumentArrowUpIcon className="h-5 w-5" />
            <span>Importer Excel</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BanknotesIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Chiffre d'affaires</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Factures payées</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.paid}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">En attente</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentArrowUpIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total factures</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des factures */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Factures récentes</h2>
        </div>

        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <DocumentArrowUpIcon className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune facture</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer votre première facture.
            </p>
            <Link to="/create" className="btn-primary mt-6 flex items-center justify-center px-6 py-3 text-base font-semibold">
              <PlusIcon className="h-5 w-5 mr-2" />
              Nouvelle Facture
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant TTC</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="font-medium">{invoice.invoiceNumber}</td>
                    <td>{invoice.client?.name || 'Client non défini'}</td>
                    <td>{formatDate(invoice.date)}</td>
                    <td className="font-medium">{formatCurrency(invoice.totalTTC || 0)}</td>
                    <td>
                      <button
                        onClick={() => toggleInvoiceStatus(invoice.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                      </button>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/preview/${invoice.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/create?edit=${invoice.id}`}
                          className="text-gray-600 hover:text-gray-900"
                          title="Modifier"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        {invoice.status !== 'paid' && (
                          <button
                            onClick={() => toggleInvoiceStatus(invoice.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Marquer comme payée"
                          >
                            <CreditCardIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 