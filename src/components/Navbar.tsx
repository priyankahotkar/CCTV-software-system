import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface NavbarProps {
  totalIncidents: number;
  unresolvedIncidents: number;
  onSeedData: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ totalIncidents, unresolvedIncidents, onSeedData }) => {
  return (
    <nav className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-xl font-bold text-white">SecureSight</h1>
            <p className="text-sm text-gray-400">CCTV Monitoring Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-white font-medium">{unresolvedIncidents}</span>
              <span className="text-gray-400 text-sm">Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">{totalIncidents - unresolvedIncidents}</span>
              <span className="text-gray-400 text-sm">Resolved</span>
            </div>
          </div>
          
          <button
            onClick={onSeedData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Seed Data
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;