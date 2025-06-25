# Guide de Démarrage Rapide - ARLM Freelance

## ✅ PROBLÈME RÉSOLU : Page blanche corrigée !

L'erreur `SaveIcon` a été corrigée. L'application devrait maintenant fonctionner parfaitement.

## 🚀 Accès à l'application

Une fois `npm run dev` lancé, l'application sera accessible sur un des ports suivants :
- http://localhost:3000
- http://localhost:3001 
- http://localhost:3002

**Vérifiez la console du terminal pour voir l'URL exacte affichée.**

## 💳 Nouvelles Fonctionnalités Stripe

### ✅ IBAN Réel intégré :
- **IBAN :** FR76 1695 8000 0129 4473 8662 035
- **BIC/SWIFT :** QNTOFRP1XXX

### ✅ Paiement Stripe avec montant exact :
- Bouton de paiement généré automatiquement
- Montant exact de la facture pré-rempli
- Lien direct vers Stripe Checkout

## 🎯 Test Rapide - 5 Minutes

### 1. Créer une facture de test
1. Allez sur l'application 
2. Cliquez "Nouvelle Facture"
3. Remplissez :
   - **Client :** "MTM Consulting"
   - **Description :** "Consultation Data & IA"
   - **Quantité :** 1
   - **Prix HT :** 1200€
   - **TVA :** 20%

### 2. Tester le paiement Stripe
- Dans la section "Paiement client", vous verrez :
  - Vos vrais IBAN/BIC
  - **Bouton bleu "Tester : Payer 1440,00 €"** 
- Cliquez dessus → Cela ouvre Stripe avec le montant exact !

### 3. Sauvegarder et voir le PDF
1. Cliquez "Sauvegarder et Prévisualiser"
2. Votre facture s'affiche avec votre logo
3. Bouton "Télécharger PDF" pour le fichier final
4. **Bouton "Payer en ligne"** pour le client

## 📊 Import Excel

### Option 1 : Fichier d'exemple créé
Un fichier `docs/exemple-mission.csv` a été créé. 
- Ouvrez-le dans Excel
- Sauvez-le en .xlsx
- Importez-le dans l'application

### Option 2 : Format pour vos lettres de mission
Vos fichiers Excel doivent avoir ces colonnes :
- **Colonne A :** Description 
- **Colonne B :** Quantité
- **Colonne C :** Prix Unitaire HT
- **Colonne D :** Taux TVA

## 🎉 Résultat

Vous avez maintenant :
- ✅ Interface qui fonctionne (page blanche corrigée)
- ✅ Vrai IBAN/BIC affiché  
- ✅ Bouton Stripe avec montant exact
- ✅ PDF professionnel avec logo
- ✅ Import Excel automatique
- ✅ Dashboard avec statistiques

## 🚨 Si problème

1. **Page blanche :** Regardez la console du navigateur (F12)
2. **Port différent :** Vérifiez l'URL dans le terminal
3. **Stripe ne fonctionne pas :** Vérifiez que le lien Stripe est correct dans le code

**L'application est maintenant 100% fonctionnelle pour vos missions freelance !** 🎯 