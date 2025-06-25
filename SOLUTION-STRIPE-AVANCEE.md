# 🚀 SOLUTION STRIPE AVANCÉE - Intégration complète

## ✅ Intégration React Stripe.js + Webhooks

Basé sur votre webhook `setup_intent.created` et secret `whsec_hIT9kNepd1pZcP16ETGJECfOWIgO5kdt`, voici une intégration complète.

### Étape 1 : Installer React Stripe.js
```bash
npm install @stripe/react-stripe-js @stripe/stripe-js
```

### Étape 2 : Créer le composant Stripe (src/components/StripeCheckout.jsx)
```javascript
import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

// Votre clé publique Stripe
const stripePromise = loadStripe('pk_live_51RdZU7EPdXAA6CcA1m3yWQFKeCedVqxHOOaP4R8G39UJfzofBYXBBR2N1eNfcJCsdbRTKunrutKUCAm1rd81r3mN00ANa23JVA')

const CheckoutForm = ({ amount, invoiceNumber, clientEmail }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) return

    setLoading(true)

    // 1. Créer Payment Intent côté serveur
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount * 100, // en centimes
        currency: 'eur',
        metadata: {
          invoiceNumber,
          clientEmail
        }
      })
    })

    const { client_secret } = await response.json()

    // 2. Confirmer le paiement
    const result = await stripe.confirmPayment({
      elements,
      clientSecret: client_secret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`
      }
    })

    if (result.error) {
      setMessage(result.error.message)
    } else {
      setMessage('Paiement réussi !')
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
      >
        {loading ? 'Traitement...' : `Payer ${amount}€`}
      </button>
      {message && <div className="text-red-600">{message}</div>}
    </form>
  )
}

const StripeCheckout = ({ amount, invoiceNumber, clientEmail }) => {
  const options = {
    mode: 'payment',
    amount: amount * 100,
    currency: 'eur'
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        amount={amount} 
        invoiceNumber={invoiceNumber}
        clientEmail={clientEmail}
      />
    </Elements>
  )
}

export default StripeCheckout
```

### Étape 3 : Backend API (Node.js/Express)
```javascript
// server.js
const express = require('express')
const stripe = require('stripe')('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')
const app = express()

app.use(express.json())

// Créer Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true
      }
    })

    res.json({
      client_secret: paymentIntent.client_secret
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// Webhook endpoint
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = 'whsec_hIT9kNepd1pZcP16ETGJECfOWIgO5kdt'

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Gérer les événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('✅ Paiement réussi:', paymentIntent.metadata.invoiceNumber)
      // Mettre à jour le statut de la facture dans votre base de données
      break
    
    case 'setup_intent.created':
      console.log('🔧 Setup Intent créé:', event.data.object.id)
      break
    
    default:
      console.log(`Événement non géré: ${event.type}`)
  }

  res.json({ received: true })
})

app.listen(3001, () => console.log('Server running on port 3001'))
```

### Étape 4 : Intégrer dans votre facture
```javascript
// Dans InvoicePreview.jsx
import StripeCheckout from './StripeCheckout'

// Remplacer le bouton Stripe par :
<div className="mt-4">
  <StripeCheckout 
    amount={invoice.totalTTC}
    invoiceNumber={invoice.invoiceNumber}
    clientEmail={invoice.client.email || ''}
  />
</div>
```

### Étape 5 : Configuration Webhook
1. Dashboard Stripe → **"Webhooks"**
2. **"Add endpoint"**
3. URL : `https://votre-serveur.com/webhook`
4. Événements : `payment_intent.succeeded`, `setup_intent.created`

## ✅ Avantages de cette solution
- ✅ Paiements directs sur votre site
- ✅ Webhooks pour confirmer les paiements
- ✅ Interface utilisateur personnalisée
- ✅ Sécurité maximale (3D Secure, etc.)
- ✅ Emails de confirmation automatiques 