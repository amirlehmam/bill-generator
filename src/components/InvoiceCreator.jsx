import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import * as XLSX from 'xlsx'
import { createSimpleStripeLink } from '../services/stripeService'
import { 
  PlusIcon, 
  TrashIcon, 
  DocumentArrowUpIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

const InvoiceCreator = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')
  
  const [loading, setLoading] = useState(false)
  const [excelData, setExcelData] = useState(null)
  
  const companyInfo = {
    name: 'ARLM FREELANCE',
    address: '82 AVENUE JEAN JAURES',
    city: '94400 VITRY-SUR-SEINE',
    country: 'FRANCE',
    siren: '881228308',
    ape: '6202A',
    website: 'www.amirlehmam.com',
    phone: '+33 7 87 32 39 96',
    email: 'contact@amirlehmam.com',
    iban: 'FR76 1695 8000 0129 4473 8662 035',
    bic: 'QNTOFRP1XXX',
    stripeBaseLink: 'https://buy.stripe.com/28o3fscP3dOw6Eo144'
  }

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      client: {
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'France'
      },
      items: [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        vatRate: 0
      }],
      notes: '',
      paymentTerms: 'Sous 30 jours'
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchedItems = watch('items')

  useEffect(() => {
    // Générer un numéro de facture automatique
    if (!editId) {
      const invoices = JSON.parse(localStorage.getItem('arlm-invoices') || '[]')
      const nextNumber = String(invoices.length + 1).padStart(4, '0')
      setValue('invoiceNumber', `F${new Date().getFullYear()}-${nextNumber}`)
      
      // Date d'échéance par défaut (30 jours)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 30)
      setValue('dueDate', dueDate.toISOString().split('T')[0])
    }
  }, [editId, setValue])

  useEffect(() => {
    // Charger la facture en mode édition
    if (editId) {
      const invoices = JSON.parse(localStorage.getItem('arlm-invoices') || '[]')
      const invoice = invoices.find(inv => inv.id === editId)
      if (invoice) {
        reset(invoice)
      }
    }
  }, [editId, reset])

  const handleExcelImport = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        setExcelData(jsonData)
        
        // Essayer de mapper automatiquement les données
        if (jsonData.length > 0) {
          mapExcelToForm(jsonData)
        }
      } catch (error) {
        alert('Erreur lors de la lecture du fichier Excel')
        console.error(error)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const mapExcelToForm = (data) => {
    // Cette fonction peut être adaptée selon le format de vos lettres de mission
    // Pour l'instant, on suppose une structure simple
    const items = []
    
    // Rechercher les données dans le fichier Excel
    data.forEach((row, index) => {
      if (index === 0) return // Ignorer l'en-tête
      
      if (row.length >= 4 && row[0]) {
        items.push({
          description: row[0] || '',
          quantity: parseFloat(row[1]) || 1,
          unitPrice: parseFloat(row[2]) || 0,
          vatRate: parseFloat(row[3]) || 0
        })
      }
    })
    
    if (items.length > 0) {
      setValue('items', items)
    }
    
    alert(`${items.length} ligne(s) importée(s) depuis Excel`)
  }

  const calculateItemTotal = (item) => {
    const subtotal = (item.quantity || 0) * (item.unitPrice || 0)
    const vatAmount = subtotal * ((item.vatRate || 0) / 100)
    return {
      subtotal,
      vatAmount,
      total: subtotal + vatAmount
    }
  }

  const calculateInvoiceTotal = () => {
    return watchedItems.reduce((acc, item) => {
      const itemTotal = calculateItemTotal(item)
      acc.subtotal += itemTotal.subtotal
      acc.vatAmount += itemTotal.vatAmount
      acc.total += itemTotal.total
      return acc
    }, { subtotal: 0, vatAmount: 0, total: 0 })
  }

  const onSubmit = (data) => {
    setLoading(true)
    
    try {
      const invoiceTotal = calculateInvoiceTotal()
      const invoice = {
        ...data,
        id: editId || Date.now().toString(),
        status: 'pending',
        totalHT: invoiceTotal.subtotal,
        totalVAT: invoiceTotal.vatAmount,
        totalTTC: invoiceTotal.total,
        stripePaymentLink: generateStripeLink(invoiceTotal.total, `Facture ${data.invoiceNumber} - ${data.client?.name || 'Client'}`),
        createdAt: editId ? data.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: companyInfo
      }

      const existingInvoices = JSON.parse(localStorage.getItem('arlm-invoices') || '[]')
      
      let updatedInvoices
      if (editId) {
        updatedInvoices = existingInvoices.map(inv => 
          inv.id === editId ? invoice : inv
        )
      } else {
        updatedInvoices = [...existingInvoices, invoice]
      }
      
      localStorage.setItem('arlm-invoices', JSON.stringify(updatedInvoices))
      
      alert(editId ? 'Facture modifiée avec succès!' : 'Facture créée avec succès!')
      navigate(`/preview/${invoice.id}`)
    } catch (error) {
      console.error(error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setLoading(false)
    }
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

  const generateStripeLink = (amount, description = '') => {
    return createSimpleStripeLink(amount, description)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {editId ? 'Modifier la facture' : 'Nouvelle facture'}
          </h1>
          <p className="mt-2 text-gray-600">
            Créez ou modifiez une facture professionnelle
          </p>
        </div>
        
        <div className="flex space-x-3">
          <label className="btn-secondary flex items-center space-x-2 cursor-pointer">
            <DocumentArrowUpIcon className="h-5 w-5" />
            <span>Importer Excel</span>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Informations de base */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations de base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de facture *
              </label>
              <input
                {...register('invoiceNumber', { required: true })}
                className="input-field"
                placeholder="F2024-0001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de facture *
              </label>
              <input
                type="date"
                {...register('date', { required: true })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'échéance *
              </label>
              <input
                type="date"
                {...register('dueDate', { required: true })}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Informations client</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise *
              </label>
              <input
                {...register('client.name', { required: true })}
                className="input-field"
                placeholder="Nom de l'entreprise"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <input
                {...register('client.address')}
                className="input-field"
                placeholder="Adresse"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code postal
              </label>
              <input
                {...register('client.postalCode')}
                className="input-field"
                placeholder="75001"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ville
              </label>
              <input
                {...register('client.city')}
                className="input-field"
                placeholder="Paris"
              />
            </div>
          </div>
        </div>

        {/* Prestations */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Prestations</h2>
            <button
              type="button"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0, vatRate: 0 })}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Ajouter une ligne</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-700">Description</th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-20">Qté</th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-24">Prix HT</th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-20">TVA %</th>
                  <th className="text-left py-2 px-2 text-sm font-medium text-gray-700 w-24">Total TTC</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => {
                  const itemTotal = calculateItemTotal(watchedItems[index] || {})
                  
                  return (
                    <tr key={field.id} className="border-b">
                      <td className="py-2 px-2">
                        <textarea
                          {...register(`items.${index}.description`)}
                          className="input-field resize-none"
                          rows="2"
                          placeholder="Description de la prestation"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          className="input-field text-center"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
                          className="input-field text-right"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          step="0.01"
                          {...register(`items.${index}.vatRate`, { valueAsNumber: true })}
                          className="input-field text-center"
                        />
                      </td>
                      <td className="py-2 px-2 text-right font-medium">
                        {formatCurrency(itemTotal.total)}
                      </td>
                      <td className="py-2 px-2">
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Totaux */}
          <div className="mt-6 flex justify-end">
            <div className="w-72 space-y-2">
              {(() => {
                const totals = calculateInvoiceTotal()
                return (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total HT:</span>
                      <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total TVA:</span>
                      <span className="font-medium">{formatCurrency(totals.vatAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold">Total TTC:</span>
                      <span className="font-bold text-lg">{formatCurrency(totals.total)}</span>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>

        {/* Notes et conditions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Notes et conditions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conditions de paiement
              </label>
              <select {...register('paymentTerms')} className="input-field">
                <option value="Immédiate">Immédiate</option>
                <option value="Sous 15 jours">Sous 15 jours</option>
                <option value="Sous 30 jours">Sous 30 jours</option>
                <option value="Sous 45 jours">Sous 45 jours</option>
                <option value="Sous 60 jours">Sous 60 jours</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                {...register('notes')}
                className="input-field resize-none"
                rows="3"
                placeholder="Notes supplémentaires..."
              />
            </div>
          </div>
        </div>

        {/* Prévisualisation du paiement */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Paiement client</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Virement bancaire</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p><span className="font-medium">IBAN :</span> {companyInfo.iban}</p>
                <p><span className="font-medium">BIC/SWIFT :</span> {companyInfo.bic}</p>
                <p><span className="font-medium">Bénéficiaire :</span> {companyInfo.name}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Paiement en ligne Stripe</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Le client pourra payer directement par carte bancaire :
                </p>
                                 {(() => {
                   const totals = calculateInvoiceTotal()
                   const clientName = watch('client.name') || 'Client test'
                   const invoiceNum = watch('invoiceNumber') || 'TEST'
                   
                   return totals.total > 0 ? (
                     <a 
                       href={generateStripeLink(totals.total, `Facture ${invoiceNum} - ${clientName}`)}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                     >
                       <LinkIcon className="h-4 w-4 mr-2" />
                       Tester : Payer {formatCurrency(totals.total)}
                     </a>
                   ) : (
                     <div className="text-sm text-gray-500 italic">
                       Ajoutez des prestations pour voir le bouton de paiement
                     </div>
                   )
                 })()}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
          
          <button
            type="button"
            onClick={handleSubmit((data) => {
              onSubmit(data)
              // Après sauvegarde, rediriger vers la prévisualisation
            })}
            className="btn-primary flex items-center space-x-2"
          >
            <EyeIcon className="h-5 w-5" />
            <span>Sauvegarder et Prévisualiser</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default InvoiceCreator