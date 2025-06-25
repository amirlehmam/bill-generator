# 🔧 Configuration Stripe sur Netlify

## Variables d'environnement requises

Pour que les paiements Stripe fonctionnent correctement, vous devez configurer ces variables sur Netlify :

### 1. Aller sur Netlify Dashboard

1. Connectez-vous à [netlify.com](https://netlify.com)
2. Sélectionnez votre site `bill-generator`
3. Allez dans **Site settings** → **Environment variables**

### 2. Ajouter les variables

Cliquez sur **Add variable** et ajoutez :

#### Variable principale Stripe :
- **Key** : `STRIPE_SECRET_API`
- **Value** : Votre clé secrète Stripe (commence par `sk_live_` ou `sk_test_`)

#### URL du site :
- **Key** : `URL`  
- **Value** : `https://votre-site.netlify.app` (remplacez par votre vraie URL)

### 3. Où trouver votre clé secrète Stripe

1. Allez sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. Cliquez sur **Developers** → **API keys**
3. Copiez la **Secret key** (🚨 **PAS** la Publishable key)

### 4. Variables optionnelles

Pour plus de sécurité, vous pouvez aussi ajouter :

- **Key** : `STRIPE_SIGNING_SECRET`
- **Value** : Votre webhook signing secret (pour les webhooks)

## 🚨 Problèmes courants

### Erreur "Configuration Stripe manquante"
- ✅ Vérifiez que `STRIPE_SECRET_API` est bien configurée
- ✅ La valeur commence par `sk_live_` ou `sk_test_`
- ✅ Redéployez le site après modification des variables

### Erreur "Method not allowed"
- ✅ La fonction Netlify n'est pas déployée correctement
- ✅ Vérifiez que le fichier `netlify/functions/create-checkout.js` existe

### Montant incorrect (2800€)
- ⚠️  Votre ancien Payment Link Stripe est encore utilisé
- ✅ Supprimez le cache du navigateur (Ctrl+Shift+R)
- ✅ Vérifiez la console développeur pour les erreurs

## 🧪 Test de configuration

Après configuration :

1. Ouvrez la console développeur (F12)
2. Créez une facture de test avec un montant spécifique
3. Cliquez sur le bouton de paiement
4. Vérifiez dans la console les messages :
   - ✅ `🔄 Création paiement Stripe dynamique pour:`
   - ✅ `📡 Réponse Netlify status: 200`
   - ✅ `✅ Session Stripe créée:`

## 🔐 Sécurité

- ❌ **JAMAIS** mettre la clé secrète dans le code
- ✅ Toujours utiliser les variables d'environnement Netlify
- ✅ Utiliser `sk_test_` pour les tests, `sk_live_` pour la production

## 🆘 Support

Si ça ne fonctionne toujours pas :

1. Vérifiez les logs Netlify : **Site settings** → **Functions** → **View logs**
2. Regardez la console développeur pour les erreurs
3. Testez d'abord avec les clés de test Stripe (`sk_test_`) 