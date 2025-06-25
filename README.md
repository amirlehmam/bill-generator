# ARLM Freelance - Générateur de Factures

Une application web moderne pour créer et gérer vos factures professionnelles en tant que freelance. Conforme aux normes françaises de facturation.

## 🚀 Fonctionnalités

### ✅ Création de factures
- Formulaire intuitif pour créer des factures
- Numérotation automatique des factures
- Calculs automatiques (HT, TVA, TTC)
- Gestion des conditions de paiement

### ✅ Import Excel
- Import automatique depuis vos lettres de mission Excel
- Mapping automatique des données
- Support des formats .xlsx et .xls

### ✅ Gestion des clients
- Saisie des informations client
- Sauvegarde automatique
- Historique des factures par client

### ✅ Génération PDF
- Export professionnel en PDF
- Logo intégré
- Conformité légale française
- Prêt pour l'envoi

### ✅ Dashboard complet
- Vue d'ensemble des factures
- Statistiques (CA, factures payées, en attente)
- Suivi des paiements
- Recherche et filtres

### ✅ Informations de paiement
- IBAN pour virements bancaires
- Lien de paiement Stripe intégré
- Conditions légales automatiques

## 🏢 Informations Entreprise

L'application est pré-configurée avec vos informations :

```
ARLM FREELANCE
82 AVENUE JEAN JAURES
94400 VITRY-SUR-SEINE
FRANCE
SIREN : 881228308
Code APE : 6202A
Site web : www.amirlehmam.com
Téléphone : +33 7 87 32 39 96
Email : contact@amirlehmam.com
```

## 🛠️ Installation et démarrage

### Prérequis
- Node.js (version 18 ou supérieure)
- npm ou yarn

### Installation
```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

L'application sera accessible sur `http://localhost:3000`

## 💼 Guide d'utilisation

### 1. Créer une nouvelle facture
1. Cliquez sur "Nouvelle Facture" dans le dashboard
2. Remplissez les informations client
3. Ajoutez vos prestations (description, quantité, prix)
4. Les calculs se font automatiquement
5. Sauvegardez et prévisualisez

### 2. Importer depuis Excel
1. Préparez votre fichier Excel avec les colonnes :
   - Colonne A : Description de la prestation
   - Colonne B : Quantité
   - Colonne C : Prix unitaire HT
   - Colonne D : Taux TVA (%)
2. Cliquez sur "Importer Excel"
3. Sélectionnez votre fichier
4. Les données sont automatiquement mappées

### 3. Générer un PDF
1. Depuis la prévisualisation, cliquez sur "Télécharger PDF"
2. Le fichier sera téléchargé avec le nom : `Facture_[Numéro].pdf`
3. Envoyez-le directement à votre client

### 4. Gérer les paiements
- Cliquez sur le statut de la facture pour la marquer comme payée
- Les statistiques se mettent à jour automatiquement
- Suivez votre chiffre d'affaires en temps réel

## 📊 Structure des données

Les factures sont sauvegardées localement dans le navigateur. Structure type :

```json
{
  "id": "unique_id",
  "invoiceNumber": "F2024-0001",
  "date": "2024-01-15",
  "dueDate": "2024-02-14",
  "client": {
    "name": "Nom Client",
    "address": "Adresse",
    "city": "Ville",
    "postalCode": "75001"
  },
  "items": [
    {
      "description": "Consultation Data & IA",
      "quantity": 1,
      "unitPrice": 800,
      "vatRate": 20
    }
  ],
  "status": "pending",
  "totalHT": 800,
  "totalVAT": 160,
  "totalTTC": 960
}
```

## 🔧 Technologies utilisées

- **Frontend** : React 18 + Vite
- **Styling** : Tailwind CSS
- **Forms** : React Hook Form
- **PDF** : jsPDF + html2canvas
- **Excel** : SheetJS (xlsx)
- **Icons** : Heroicons
- **Storage** : localStorage

## 📱 Design responsive

L'application est entièrement responsive et fonctionne sur :
- Desktop (Windows, macOS, Linux)
- Tablettes
- Smartphones

## 🎨 Personnalisation

### Modifier les informations d'entreprise
Editez le fichier `src/components/InvoiceCreator.jsx` ligne 18-30 :

```javascript
const companyInfo = {
  name: 'VOTRE ENTREPRISE',
  address: 'VOTRE ADRESSE',
  // ... autres informations
}
```

### Changer le logo
Remplacez le fichier `public/logo.png` par votre propre logo.

### Adapter les conditions légales
Modifiez le texte dans `src/components/InvoicePreview.jsx` ligne 335.

## 🔒 Sécurité et données

- Toutes les données sont stockées localement
- Aucune donnée n'est envoyée sur internet
- Sauvegarde recommandée via export régulier
- Respect du RGPD par design

## 📄 Conformité légale

L'application génère des factures conformes à la législation française :
- Mentions légales obligatoires
- Numérotation séquentielle
- Dates de facturation et d'échéance
- Conditions de paiement
- Pénalités de retard automatiques

## 🆘 Support et contact

Pour toute question ou assistance :
- Email : contact@amirlehmam.com
- Téléphone : +33 7 87 32 39 96
- Site web : www.amirlehmam.com

## 📝 Licence

© 2024 ARLM Freelance. Tous droits réservés.

---

**Développé avec ❤️ pour les freelances français** 