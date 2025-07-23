import React, { useState } from 'react';
import { AlertTriangle, Sun as Gun, User, Eye, Slash, Trash2, CheckCircle, Clock, MapPin, Filter } from 'lucide-react';
import { Incident, IncidentType } from '../types';

interface IncidentListProps {
  incidents: Incident[];
  selectedIncident: Incident | null;
  onIncidentSelect: (incident: Incident) => void;
  onIncidentResolve: (id: string) => void;
}

const getIncidentIcon = (type: IncidentType) => {
  switch (type) {
    case 'Gun Threat':
      return <Gun className="h-4 w-4" />;
    case 'Unauthorised Access':
      return <AlertTriangle className="h-4 w-4" />;
    case 'Face Recognised':
      return <User className="h-4 w-4" />;
    case 'Suspicious Activity':
      return <Eye className="h-4 w-4" />;
    case 'Theft Attempt':
      return <Slash className="h-4 w-4" />;
    case 'Vandalism':
      return <Trash2 className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

const getIncidentColor = (type: IncidentType) => {
  switch (type) {
    case 'Gun Threat':
      return 'text-red-400 bg-red-900/20';
    case 'Unauthorised Access':
      return 'text-orange-400 bg-orange-900/20';
    case 'Face Recognised':
      return 'text-blue-400 bg-blue-900/20';
    case 'Suspicious Activity':
      return 'text-yellow-400 bg-yellow-900/20';
    case 'Theft Attempt':
      return 'text-purple-400 bg-purple-900/20';
    case 'Vandalism':
      return 'text-pink-400 bg-pink-900/20';
    default:
      return 'text-gray-400 bg-gray-900/20';
  }
};

const IncidentList: React.FC<IncidentListProps> = ({
  incidents,
  selectedIncident,
  onIncidentSelect,
  onIncidentResolve
}) => {
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set());

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'unresolved') return !incident.resolved;
    if (filter === 'resolved') return incident.resolved;
    return true;
  });

  const handleResolve = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (resolvingIds.has(id)) return;
    
    setResolvingIds(prev => new Set(prev).add(id));
    
    try {
      await onIncidentResolve(id);
    } finally {
      setResolvingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Incident Log</h2>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unresolved' | 'resolved')}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Incidents</option>
            <option value="unresolved">Unresolved</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filteredIncidents.map((incident) => {
          const isResolving = resolvingIds.has(incident.id);
          const isSelected = selectedIncident?.id === incident.id;
          
          return (
            <div
              key={incident.id}
              onClick={() => onIncidentSelect(incident)}
              className={`relative cursor-pointer rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-900/10'
                  : 'border-gray-700 bg-gray-900/50 hover:border-gray-600'
              } ${incident.resolved ? 'opacity-60' : ''}`}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={incident.thumbnailUrl}
                      alt="Incident thumbnail"
                      className="w-16 h-12 object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${getIncidentColor(incident.type)}`}>
                        {getIncidentIcon(incident.type)}
                        <span className="text-xs font-medium">{incident.type}</span>
                      </div>
                      {incident.resolved && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-300 mb-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{incident.camera?.location}</span>
                    </div>

                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatTime(incident.tsStart)} - {formatTime(incident.tsEnd)}
                        </span>
                      </div>
                      <span className="bg-gray-700 px-2 py-1 rounded">
                        {formatDuration(incident.tsStart, incident.tsEnd)}
                      </span>
                    </div>
                  </div>

                  {/* Resolve Button */}
                  {!incident.resolved && (
                    <button
                      onClick={(e) => handleResolve(incident.id, e)}
                      disabled={isResolving}
                      className={`flex-shrink-0 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                        isResolving
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {isResolving ? 'Resolving...' : 'Resolve'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filteredIncidents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-600" />
            <p className="text-lg">No incidents found</p>
            <p className="text-sm text-gray-600 mt-2">
              {filter === 'unresolved' 
                ? 'All incidents have been resolved'
                : 'Try adjusting your filter settings'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentList;