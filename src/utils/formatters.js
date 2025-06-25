/**
 * Utilitaires de formatage pour l'application ARLM Invoice
 */

/**
 * Formate un montant en euros avec gestion des caractères spéciaux
 * @param {number} amount - Montant à formater
 * @returns {string} - Montant formaté (ex: "3 075,00 €")
 */
export const formatCurrency = (amount) => {
  const formatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount || 0)
  
  // Fix pour React-PDF et compatibilité : remplacer les caractères problématiques
  return formatted
    .replace(/\u00A0/g, ' ')  // Remplacer l'espace insécable par un espace normal
    .replace(/\//g, ' ')      // Remplacer les slashes par des espaces
    .replace(/\u202F/g, ' ')  // Remplacer l'espace fine par un espace normal
}

/**
 * Formate une date au format français
 * @param {string|Date} dateString - Date à formater
 * @returns {string} - Date formatée (ex: "25/12/2024")
 */
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

/**
 * Formate un pourcentage
 * @param {number} rate - Taux à formater (ex: 20 pour 20%)
 * @returns {string} - Pourcentage formaté (ex: "20%")
 */
export const formatPercent = (rate) => {
  return `${rate || 0}%`
}

/**
 * Génère un numéro de facture unique
 * @returns {string} - Numéro de facture (ex: "F2024-0001")
 */
export const generateInvoiceNumber = () => {
  const year = new Date().getFullYear()
  const timestamp = Date.now()
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `F${year}-${randomSuffix}${timestamp.toString().slice(-1)}`
}

/**
 * Génère un ID unique pour les factures
 * @returns {string} - ID unique
 */
export const generateUniqueId = () => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * Calcule les totaux d'une facture
 * @param {Array} items - Éléments de la facture
 * @returns {Object} - Objet contenant les totaux
 */
export const calculateInvoiceTotals = (items) => {
  const totals = items.reduce((acc, item) => {
    const quantity = parseFloat(item.quantity) || 0
    const unitPrice = parseFloat(item.unitPrice) || 0
    const vatRate = parseFloat(item.vatRate) || 0
    
    const totalHT = quantity * unitPrice
    const vatAmount = totalHT * (vatRate / 100)
    const totalTTC = totalHT + vatAmount
    
    acc.totalHT += totalHT
    acc.totalVAT += vatAmount
    acc.totalTTC += totalTTC
    
    return acc
  }, { totalHT: 0, totalVAT: 0, totalTTC: 0 })
  
  return {
    totalHT: Math.round(totals.totalHT * 100) / 100,
    totalVAT: Math.round(totals.totalVAT * 100) / 100,
    totalTTC: Math.round(totals.totalTTC * 100) / 100
  }
} 