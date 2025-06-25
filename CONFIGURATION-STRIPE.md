# Configuration Stripe - Guide Complet

## 🎯 Problème actuel
Le lien Stripe généré ne fonctionne pas correctement car il faut créer un **Payment Link** depuis votre dashboard Stripe.

## ✅ Solution : Créer un Payment Link Stripe

### Étape 1 : Accéder au Dashboard Stripe
1. Allez sur https://dashboard.stripe.com/
2. Connectez-vous avec vos identifiants Stripe

### Étape 2 : Créer un Payment Link
1. Dans le menu de gauche, cliquez sur **"Payment links"**
2. Cliquez sur **"Create payment link"**

### Étape 3 : Configuration du Payment Link
```
Nom du produit : "Facture ARLM Freelance"
Description : "Paiement de facture - Consultation Data & IA"
Prix : 100€ (vous pourrez l'ajuster pour chaque facture)
✅ Cochez "Customer can adjust quantity"
✅ Cochez "Collect customer information" > Email
Currency : EUR
```

### Étape 4 : Options avancées
```
✅ Collect billing address
✅ Collect shipping address (optionnel)
✅ Allow promotion codes
Tax behavior : "Exclusive" (hors taxes)
```

### Étape 5 : Récupérer l'URL
1. Une fois créé, copiez l'URL générée (ex: `https://buy.stripe.com/XXXXXXX`)
2. Cette URL ressemble à : `https://buy.stripe.com/28o3fscP3dOw6Eo144`

### Étape 6 : Mettre à jour le code
Remplacez dans le fichier `src/services/stripeService.js` ligne 7 :
```javascript
const basePaymentLink = 'VOTRE_NOUVELLE_URL_ICI'
```

## 🔧 Configuration avancée (optionnelle)

### Payment Link dynamique avec API
Pour créer des Payment Links automatiquement via API, il faudrait :

1. **Backend Node.js/Express** avec votre clé secrète
2. **Endpoint API** pour créer les Payment Links
3. **Webhook Stripe** pour confirmer les paiements

### Code backend exemple :
```javascript
const stripe = require('stripe')('sk_live_...');

app.post('/create-payment-link', async (req, res) => {
  const { amount, description } = req.body;
  
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: description,
        },
        unit_amount: amount * 100,
      },
      quantity: 1,
    }],
  });
  
  res.json({ url: paymentLink.url });
});
```

## ✅ Test de votre configuration

1. **Créez une facture test** dans l'application
2. **Cliquez sur le bouton "Tester : Payer"**
3. **Vérifiez que Stripe s'ouvre** avec le bon montant
4. **Testez un paiement** en mode test

## 🚨 Mode Live vs Test

- **Clés Test** : `pk_test_...` et `sk_test_...`
- **Clés Live** : `pk_live_...` et `sk_live_...` (vos clés actuelles)

⚠️ **Attention** : Vous utilisez les clés LIVE, donc les paiements seront réels !

## 📞 Support

Si vous avez des difficultés :
1. Vérifiez que votre compte Stripe est activé
2. Vérifiez que Payment Links est activé dans votre pays
3. Contactez le support Stripe si nécessaire

**Une fois configuré, vos clients pourront payer directement par carte bancaire avec le montant exact de la facture !** 💳 