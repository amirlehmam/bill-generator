// Vérifier les variables d'environnement possibles
const stripeSecretKey = process.env.STRIPE_SECRET_API || 
                       process.env.STRIPE_SECRET_KEY || 
                       process.env.STRIPE_SECRET

if (!stripeSecretKey) {
  console.error('❌ Variable d\'environnement Stripe manquante! Vérifiez: STRIPE_SECRET_API, STRIPE_SECRET_KEY, ou STRIPE_SECRET')
}

const stripe = require('stripe')(stripeSecretKey);

exports.handler = async (event, context) => {
  // Permettre les requêtes CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Gérer les requêtes OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Seules les requêtes POST sont autorisées
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Vérifier que Stripe est configuré
    if (!stripeSecretKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Configuration Stripe manquante',
          details: 'Variable d\'environnement STRIPE_SECRET_API non configurée'
        }),
      };
    }

    const { amount, currency = 'eur', invoiceNumber, clientName, successUrl, cancelUrl } = JSON.parse(event.body);

    console.log('💰 Création session Stripe:', { amount, currency, invoiceNumber, clientName });

    // Validation des paramètres
    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Montant invalide' }),
      };
    }

    // Créer une session de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Facture ${invoiceNumber}`,
              description: `Facture ARLM FREELANCE pour ${clientName}`,
              metadata: {
                invoice_number: invoiceNumber,
                client_name: clientName,
              },
            },
            unit_amount: Math.round(amount * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.URL}/cancel`,
      metadata: {
        invoice_number: invoiceNumber,
        client_name: clientName,
      },
      // Configuration pour factures françaises
      billing_address_collection: 'required',
      payment_intent_data: {
        description: `Paiement facture ${invoiceNumber} - ARLM FREELANCE`,
        metadata: {
          invoice_number: invoiceNumber,
          client_name: clientName,
        },
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionId: session.id,
        checkoutUrl: session.url,
      }),
    };

  } catch (error) {
    console.error('Erreur création checkout Stripe:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur lors de la création du paiement',
        details: error.message 
      }),
    };
  }
}; 