import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { LinkIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFInvoice from './PDFInvoice'

const WebInvoiceViewer = () => {
  const { shareId } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Decode the shared invoice data
    try {
      const invoices = JSON.parse(localStorage.getItem('arlm-invoices') || '[]')
      const foundInvoice = invoices.find(inv => inv.shareId === shareId)
      
      if (foundInvoice) {
        setInvoice(foundInvoice)
      } else {
        setError('Facture introuvable ou lien expiré')
      }
    } catch (err) {
      setError('Erreur lors du chargement de la facture')
    } finally {
      setLoading(false)
    }
  }, [shareId])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la facture...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Facture introuvable</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Facture {invoice.invoiceNumber}
              </h1>
              <p className="text-sm text-gray-600">
                Vue publique partagée par {invoice.company.name}
              </p>
            </div>
            
            <div className="flex space-x-3">
              {invoice.stripePaymentLink && (
                <a
                  href={invoice.stripePaymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <LinkIcon className="h-5 w-5" />
                  <span>Payer {formatCurrency(invoice.totalTTC)}</span>
                </a>
              )}
              
              <PDFDownloadLink
                document={<PDFInvoice invoice={invoice} />}
                fileName={`Facture_${invoice.invoiceNumber}_ARLM.pdf`}
                className="btn-secondary flex items-center space-x-2"
              >
                {({ loading }) => (
                  <>
                    <DocumentArrowDownIcon className="h-5 w-5" />
                    <span>{loading ? 'Génération...' : 'Télécharger PDF'}</span>
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-8 space-y-8">
            {/* Header with logo and invoice title */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center">
                <img 
                  src="/logo_transparent.png" 
                  alt="ARLM Freelance" 
                  className="h-32 w-auto"
                />
              </div>
              
              <div className="text-right">
                <h2 className="text-4xl font-bold text-primary-600">FACTURE</h2>
                <p className="text-xl font-semibold text-gray-900 mt-2">
                  N° {invoice.invoiceNumber}
                </p>
              </div>
            </div>

            {/* Company and client information */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  De
                </h3>
                <div className="text-sm text-gray-900">
                  <p className="font-bold text-lg">{invoice.company.name}</p>
                  <p>{invoice.company.address}</p>
                  <p>{invoice.company.city}</p>
                  <p>{invoice.company.country}</p>
                  <p className="mt-2">Tél : {invoice.company.phone}</p>
                  <p>Email : {invoice.company.email}</p>
                  <p>Site : {invoice.company.website}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                  Facturé à
                </h3>
                <div className="text-sm text-gray-900">
                  <p className="font-bold text-lg">{invoice.client.name}</p>
                  {invoice.client.address && <p>{invoice.client.address}</p>}
                  {(invoice.client.postalCode || invoice.client.city) && (
                    <p>
                      {invoice.client.postalCode} {invoice.client.city}
                    </p>
                  )}
                  {invoice.client.country && <p>{invoice.client.country}</p>}
                </div>
              </div>
            </div>

            {/* Dates and conditions */}
            <div className="grid grid-cols-3 gap-8 py-4 border-t border-b border-gray-200">
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Date de facture</h4>
                <p className="text-sm text-gray-600">{formatDate(invoice.date)}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Date d'échéance</h4>
                <p className="text-sm text-gray-600">{formatDate(invoice.dueDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Conditions de paiement</h4>
                <p className="text-sm text-gray-600">{invoice.paymentTerms}</p>
              </div>
            </div>

            {/* Services table */}
            <div>
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 px-2 text-sm font-semibold text-gray-900">Description</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900 w-16">Qté</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900 w-24">Prix HT</th>
                    <th className="text-center py-3 px-2 text-sm font-semibold text-gray-900 w-16">TVA</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900 w-24">Total HT</th>
                    <th className="text-right py-3 px-2 text-sm font-semibold text-gray-900 w-24">Total TTC</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, index) => {
                    const totalHT = (item.quantity || 0) * (item.unitPrice || 0)
                    const vatAmount = totalHT * ((item.vatRate || 0) / 100)
                    const totalTTC = totalHT + vatAmount
                    
                    return (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-3 px-2 text-sm text-gray-900">
                          {item.description}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-center">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-right">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-center">
                          {item.vatRate}%
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-right">
                          {formatCurrency(totalHT)}
                        </td>
                        <td className="py-3 px-2 text-sm text-gray-900 text-right font-medium">
                          {formatCurrency(totalTTC)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Total HT :</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.totalHT)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-600">Total TVA :</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.totalVAT)}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-gray-300">
                  <span className="text-lg font-bold text-gray-900">Total TTC :</span>
                  <span className="text-lg font-bold text-primary-600">
                    {formatCurrency(invoice.totalTTC)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes :</h4>
                <p className="text-sm text-gray-600">{invoice.notes}</p>
              </div>
            )}

            {/* Payment information */}
            <div className="pt-6 border-t border-gray-200 space-y-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Modalités de paiement</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Virement bancaire</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">IBAN :</span> {invoice.company.iban}</p>
                    <p><span className="font-medium">BIC/SWIFT :</span> {invoice.company.bic}</p>
                    <p><span className="font-medium">Bénéficiaire :</span> {invoice.company.name}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Paiement en ligne</h5>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <LinkIcon className="h-4 w-4" />
                        <span>Payez par carte bancaire via Stripe</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Paiement sécurisé - Montant exact : {formatCurrency(invoice.totalTTC)}</p>
                    </div>
                    
                    {invoice.stripePaymentLink && (
                      <a 
                        href={invoice.stripePaymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-md"
                      >
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Payer {formatCurrency(invoice.totalTTC)} en ligne
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Legal information */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Informations légales</h4>
              <div className="grid grid-cols-2 gap-6 text-xs text-gray-600">
                <div>
                  <p><span className="font-medium">SIREN :</span> {invoice.company.siren}</p>
                  <p><span className="font-medium">Code APE :</span> {invoice.company.ape}</p>
                  <p><span className="font-medium">TVA :</span> Non applicable selon l'art. 293B du CGI</p>
                </div>
                <div>
                  <p>Facture émise conformément aux dispositions légales en vigueur.</p>
                  <p>En cas de retard de paiement, des pénalités de retard au taux légal s'appliqueront automatiquement (Art. L. 441-6 du Code de commerce).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-8 py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>Facture générée par {invoice.company.name} • Paiement sécurisé par Stripe</p>
        </div>
      </div>
    </div>
  )
}

export default WebInvoiceViewer 