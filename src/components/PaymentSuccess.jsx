import React, { useEffect, useState } from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'

const PaymentSuccess = () => {
  const [sessionId, setSessionId] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const sessionIdParam = urlParams.get('session_id')
    const invoiceParam = urlParams.get('invoice')
    
    if (sessionIdParam) setSessionId(sessionIdParam)
    if (invoiceParam) setInvoiceNumber(invoiceParam)
  }, [])

  const handleBackToDashboard = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Paiement confirmé !
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Votre paiement a été traité avec succès
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Détails du paiement
          </h3>
          
          {invoiceNumber && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Facture : </span>
              <span className="text-sm text-gray-900">{invoiceNumber}</span>
            </div>
          )}
          
          {sessionId && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">ID de session : </span>
              <span className="text-sm text-gray-900 font-mono">{sessionId}</span>
            </div>
          )}

          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Statut : </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Payé
            </span>
          </div>

          <div className="text-sm text-gray-600">
            <p>• Un reçu de paiement vous a été envoyé par email</p>
            <p>• La facture sera mise à jour automatiquement</p>
            <p>• Vous pouvez maintenant fermer cette page</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour au tableau de bord
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            ARLM FREELANCE - Facturation professionnelle
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess 