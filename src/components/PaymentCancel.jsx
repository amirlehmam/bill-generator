import React, { useEffect, useState } from 'react'
import { XCircleIcon } from '@heroicons/react/24/solid'

const PaymentCancel = () => {
  const [invoiceNumber, setInvoiceNumber] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const invoiceParam = urlParams.get('invoice')
    
    if (invoiceParam) setInvoiceNumber(invoiceParam)
  }, [])

  const handleBackToDashboard = () => {
    window.location.href = '/'
  }

  const handleRetryPayment = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Paiement annulé
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Le paiement a été annulé ou interrompu
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Que s'est-il passé ?
          </h3>
          
          {invoiceNumber && (
            <div className="mb-4">
              <span className="text-sm font-medium text-gray-500">Facture : </span>
              <span className="text-sm text-gray-900">{invoiceNumber}</span>
            </div>
          )}

          <div className="mb-4">
            <span className="text-sm font-medium text-gray-500">Statut : </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Non payé
            </span>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <p>Le paiement a été annulé. Cela peut arriver si :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Vous avez fermé la page de paiement</li>
              <li>Vous avez cliqué sur "Retour"</li>
              <li>Il y a eu un problème technique</li>
              <li>Votre carte a été refusée</li>
            </ul>
          </div>

          <div className="text-sm text-gray-600">
            <p className="font-medium">Que faire maintenant ?</p>
            <p>• Vous pouvez réessayer le paiement</p>
            <p>• Vérifier les informations de votre carte</p>
            <p>• Contacter votre banque si nécessaire</p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Réessayer le paiement
          </button>
          
          <button
            onClick={handleBackToDashboard}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour au tableau de bord
          </button>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            ARLM FREELANCE - Facturation professionnelle
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Besoin d'aide ? Contactez-nous à contact@amirlehmam.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancel 