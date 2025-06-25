import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { PDFDownloadLink } from '@react-pdf/renderer'
import PDFInvoice from './PDFInvoice'
import { createSimpleStripeLink } from '../services/stripeService'
import { 
  ArrowLeftIcon, 
  DocumentArrowDownIcon, 
  PrinterIcon,
  PencilIcon,
  LinkIcon,
  ShareIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

const InvoicePreview = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const invoiceRef = useRef()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const invoices = JSON.parse(localStorage.getItem('arlm-invoices') || '[]')
    const foundInvoice = invoices.find(inv => inv.id === id)
    
    if (foundInvoice) {
      // Ensure Stripe payment link is set
      if (!foundInvoice.stripePaymentLink) {
        const stripeLink = createSimpleStripeLink(
          foundInvoice.totalTTC, 
          `Facture ${foundInvoice.invoiceNumber} - ${foundInvoice.client.name}`
        )
        foundInvoice.stripePaymentLink = stripeLink
        
        // Update localStorage
        const updatedInvoices = invoices.map(inv => 
          inv.id === id ? foundInvoice : inv
        )
        localStorage.setItem('arlm-invoices', JSON.stringify(updatedInvoices))
      }
      setInvoice(foundInvoice)
    } else {
      alert('Facture introuvable')
      navigate('/')
    }
  }, [id, navigate])

  const generateShareableLink = () => {
    if (!invoice) return
    
    // Generate a unique share ID if it doesn't exist
    if (!invoice.shareId) {
      const shareId = btoa(`${invoice.id}-${Date.now()}`).replace(/[/+=]/g, '')
      const updatedInvoice = { ...invoice, shareId }
      
      const invoices = JSON.parse(localStorage.getItem('arlm-invoices') || '[]')
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoice.id ? updatedInvoice : inv
      )
      localStorage.setItem('arlm-invoices', JSON.stringify(updatedInvoices))
      setInvoice(updatedInvoice)
    }
    
    const shareUrl = `${window.location.origin}/invoice/view/${invoice.shareId}`
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Lien de partage copié dans le presse-papiers!\n\n' + shareUrl)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Lien de partage copié dans le presse-papiers!\n\n' + shareUrl)
    })
  }

  const openWebView = () => {
    if (!invoice.shareId) {
      generateShareableLink()
      setTimeout(() => {
        const shareUrl = `${window.location.origin}/invoice/view/${invoice.shareId}`
        window.open(shareUrl, '_blank')
      }, 100)
    } else {
      const shareUrl = `${window.location.origin}/invoice/view/${invoice.shareId}`
      window.open(shareUrl, '_blank')
    }
  }

  const handlePrint = () => {
    window.print()
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

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la facture...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Actions */}
      <div className="no-print flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Retour au dashboard</span>
        </Link>
        
        <div className="flex space-x-3">
          <button
            onClick={generateShareableLink}
            className="btn-secondary flex items-center space-x-2"
            title="Générer un lien de partage"
          >
            <ShareIcon className="h-5 w-5" />
            <span>Partager</span>
          </button>

          <button
            onClick={openWebView}
            className="btn-secondary flex items-center space-x-2"
            title="Ouvrir la vue web"
          >
            <EyeIcon className="h-5 w-5" />
            <span>Vue web</span>
          </button>
          
          <Link
            to={`/create?edit=${invoice.id}`}
            className="btn-secondary flex items-center space-x-2"
          >
            <PencilIcon className="h-5 w-5" />
            <span>Modifier</span>
          </Link>
          
          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center space-x-2"
          >
            <PrinterIcon className="h-5 w-5" />
            <span>Imprimer</span>
          </button>
          
          <PDFDownloadLink
            document={<PDFInvoice invoice={invoice} />}
            fileName={`Facture_${invoice.invoiceNumber}_ARLM.pdf`}
            className="btn-primary flex items-center space-x-2"
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

      {/* Facture */}
      <div ref={invoiceRef} className="bg-white shadow-lg">
        <div className="p-8 space-y-8">
          {/* En-tête avec logo et titre facture */}
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

          {/* Informations client et expéditeur */}
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
                <p className="mt-2">{invoice.company.phone}</p>
                <p>{invoice.company.email}</p>
                <p>{invoice.company.website}</p>
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

          {/* Dates et conditions */}
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

          {/* Tableau des prestations */}
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

          {/* Totaux */}
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

          {/* Informations de paiement */}
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
                      className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Payer {formatCurrency(invoice.totalTTC)} en ligne
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations légales */}
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
  )
}

export default InvoicePreview