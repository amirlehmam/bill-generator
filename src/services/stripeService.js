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

    console.log('🔄 Création paiement Stripe dynamique pour:', requestData)

    // Appeler la fonction Netlify
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    })

    console.log('📡 Réponse Netlify status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur Netlify:', errorText)
      throw new Error(`Erreur Netlify ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ Session Stripe créée:', data)
    
    if (!data.checkoutUrl) {
      throw new Error('URL de checkout manquante dans la réponse')
    }

    return data.checkoutUrl

  } catch (error) {
    console.error('💥 ERREUR CRITIQUE Stripe:', error)
    
    // NE PAS utiliser de fallback - afficher l'erreur à l'utilisateur
    alert(`Erreur de paiement Stripe: ${error.message}\n\nVérifiez:\n1. Variables d'environnement Netlify\n2. Configuration Stripe\n3. Console développeur pour plus de détails`)
    
    // Retourner null au lieu du fallback problématique
    return null
  }
}

// Ancienne fonction pour compatibilité - maintenant utilise la version dynamique
export const createStripePaymentLink = async (amount, invoiceNumber, clientName) => {
  return createDynamicStripePayment(amount, invoiceNumber, clientName)
}

// FONCTION SUPPRIMÉE : createSimpleStripeLink 
// Cette fonction utilisait un Payment Link fixe à 2800€ et causait des problèmes
// Utilisez uniquement createDynamicStripePayment maintenant

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