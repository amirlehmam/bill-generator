# 🔥 SOLUTION STRIPE RAPIDE - Payment Link

## ✅ Créer un vrai Payment Link (5 minutes)

### Étape 1 : Dashboard Stripe
1. Allez sur https://dashboard.stripe.com/
2. Menu de gauche → **"Payment links"**
3. Cliquez **"Create payment link"**

### Étape 2 : Configuration
```
✅ Product name: "Facture ARLM Freelance"
✅ Description: "Paiement de facture de conseil"
✅ Price: 100.00 EUR (vous pourrez l'ajuster)
✅ Cochez "Customer can adjust price" ← IMPORTANT !
✅ Currency: EUR
```

### Étape 3 : Options avancées
```
✅ Cochez "Collect customer information" → Email
✅ Tax behavior: "Exclusive" (prix hors taxes)
✅ Allow promotion codes: Oui (optionnel)
```

### Étape 4 : Récupérer l'URL
1. Cliquez **"Create link"**
2. Copiez l'URL générée (ex: `https://buy.stripe.com/VOTRE_VRAI_LIEN`)

### Étape 5 : Mettre à jour le code
Remplacez dans `src/services/stripeService.js` ligne 7 :
```javascript
const basePaymentLink = 'VOTRE_NOUVELLE_URL_ICI'
```

### ✅ Test
1. Créez une facture de 1200€
2. Le bouton générera : `VOTRE_URL?prefilled_custom_amount=120000`
3. Stripe ouvrira avec 1200€ pré-rempli ! 🎉 