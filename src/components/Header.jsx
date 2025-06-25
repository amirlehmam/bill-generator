import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DocumentTextIcon, HomeIcon, ArrowRightOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const location = useLocation()
  const { logout, getUserInfo } = useAuth()
  
  const isActive = (path) => location.pathname === path
  const userInfo = getUserInfo()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4">
              <img 
                src="/logo_transparent.png" 
                alt="ARLM Freelance" 
                className="h-14 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">ARLM FREELANCE</h1>
                <p className="text-sm text-gray-500">Générateur de Factures</p>
              </div>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <HomeIcon className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/create" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isActive('/create') 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>Nouvelle Facture</span>
            </Link>

            {/* Séparateur */}
            <div className="h-6 w-px bg-gray-300"></div>

            {/* Informations utilisateur */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <UserIcon className="h-4 w-4" />
                <span>{userInfo?.name || 'Utilisateur'}</span>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Se déconnecter"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 