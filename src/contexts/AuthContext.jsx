import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({})

// Credentials sécurisés (en production, ceci devrait être côté serveur)
const VALID_CREDENTIALS = {
  email: 'amirlehmam.pro@gmail.com',
  password: 'Gdze_94400'
}

// Clé pour le stockage local
const AUTH_STORAGE_KEY = 'arlm_auth_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 heures

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Vérifier la session existante au démarrage
  useEffect(() => {
    checkExistingSession()
  }, [])

  const checkExistingSession = () => {
    try {
      const sessionData = localStorage.getItem(AUTH_STORAGE_KEY)
      if (sessionData) {
        const { timestamp, hash } = JSON.parse(sessionData)
        const now = Date.now()
        
        // Vérifier si la session n'a pas expiré
        if (now - timestamp < SESSION_DURATION) {
          // Vérifier le hash de sécurité
          const expectedHash = btoa(`${VALID_CREDENTIALS.email}:${timestamp}:arlm_secret`)
          if (hash === expectedHash) {
            setIsAuthenticated(true)
          } else {
            // Hash invalide, supprimer la session
            localStorage.removeItem(AUTH_STORAGE_KEY)
          }
        } else {
          // Session expirée, supprimer
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de session:', error)
      localStorage.removeItem(AUTH_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Vérifier les credentials
      if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
        const timestamp = Date.now()
        const hash = btoa(`${email}:${timestamp}:arlm_secret`)
        
        // Stocker la session de manière sécurisée
        const sessionData = {
          timestamp,
          hash,
          user: {
            email: email,
            name: 'Amir Lehmam'
          }
        }
        
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData))
        setIsAuthenticated(true)
        
        return { success: true, message: 'Connexion réussie' }
      } else {
        return { success: false, message: 'Email ou mot de passe incorrect' }
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      return { success: false, message: 'Erreur de connexion' }
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
  }

  const getUserInfo = () => {
    try {
      const sessionData = localStorage.getItem(AUTH_STORAGE_KEY)
      if (sessionData) {
        const { user } = JSON.parse(sessionData)
        return user
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des infos utilisateur:', error)
    }
    return null
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    getUserInfo
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export default AuthContext 