// Configuration Stripe
const STRIPE_PUBLIC_KEY = 'pk_live_51RdZU7EPdXAA6CcA1m3yWQFKeCedVqxHOOaP4R8G39UJfzofBYXBBR2N1eNfcJCsdbRTKunrutKUCAm1rd81r3mN00ANa23JVA'

// Créer un lien de paiement Stripe dynamique avec le montant exact
export const createDynamicStripePayment = async (amount, invoiceNumber, clientName) => {
  try {
    // URL de la fonction Netlify
    const functionUrl = `${window.location.origin}/.netlify/functions/create-checkout`
    
    // Données à envoyer
    const requestData = {
      amount: parseFloat(amount),
      currency: 'eur',
      invoiceNumber: invoiceNumber,
      clientName: clientName,
      successUrl: `${window.location.origin}/payment-success?invoice=${invoiceNumber}`,
      cancelUrl: `${window.location.origin}/payment-cancel?invoice=${invoiceNumber}`
    }

    console.log('Création paiement Stripe pour:', requestData)

    // Appeler la fonction Netlify
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Erreur ${response.status}: ${errorData.error || 'Erreur inconnue'}`)
    }

    const data = await response.json()
    return data.checkoutUrl

  } catch (error) {
    console.error('Erreur création paiement dynamique:', error)
    
    // Fallback vers le Payment Link fixe en cas d'erreur
    console.warn('Utilisation du fallback Payment Link')
    return createSimpleStripeLink(amount, `Facture ${invoiceNumber} - ${clientName}`)
  }
}

// Ancienne fonction pour compatibilité - maintenant utilise la version dynamique
export const createStripePaymentLink = async (amount, invoiceNumber, clientName) => {
  return createDynamicStripePayment(amount, invoiceNumber, clientName)
}

// Fallback : Créer un lien de paiement simple (ancien système)
export const createSimpleStripeLink = (amount, description = '') => {
  // ATTENTION: Ce Payment Link a un montant fixe et ne fonctionnera pas pour tous les montants
  const basePaymentLink = 'https://buy.stripe.com/bJe7sL0kYgb14Jwctm7IY00'
  
  console.warn('Utilisation du Payment Link fallback - montant peut être incorrect')
  return basePaymentLink
}

// Fonction pour créer un paiement avec montant exact (fonction principale)
export const createDynamicPaymentLink = async (amount, invoiceNumber, clientName) => {
  return createDynamicStripePayment(amount, invoiceNumber, clientName)
}

// Instructions pour créer un Payment Link dans Stripe Dashboard:
// 1. Allez sur https://dashboard.stripe.com/payment-links
// 2. Cliquez "Create payment link"
// 3. Configurez le produit/service
// 4. Activez "Customer can adjust quantity"
// 5. Récupérez l'URL générée et remplacez basePaymentLink ci-dessus 