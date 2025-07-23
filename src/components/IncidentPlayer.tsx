import React, { useState } from 'react';
import { Camera, Play, MapPin, Clock } from 'lucide-react';
import { Incident } from '../types';

interface IncidentPlayerProps {
  selectedIncident: Incident | null;
  cameras: Camera[];
  onCameraSelect: (cameraId: string) => void;
}

const IncidentPlayer: React.FC<IncidentPlayerProps> = ({ 
  selectedIncident, 
  cameras,
  onCameraSelect 
}) => {
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const handleCameraSelect = (cameraId: string) => {
    setSelectedCameraId(cameraId);
    onCameraSelect(cameraId);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDuration = (start: Date, end: Date) => {
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Incident Player</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">LIVE</span>
        </div>
      </div>

      {/* Main Video Player */}
      <div className="relative bg-gray-900 rounded-lg mb-4 aspect-video overflow-hidden">
        {selectedIncident ? (
          <div className="relative w-full h-full">
            <img 
              src={selectedIncident.thumbnailUrl} 
              alt="Incident footage"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 hover:bg-opacity-30 transition-all duration-200">
                <Play className="h-8 w-8 text-white ml-1" />
              </button>
            </div>
            
            {/* Incident Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-gray-300" />
                  <span className="text-sm">{selectedIncident.camera?.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-300" />
                  <span className="text-sm">
                    {formatTime(selectedIncident.tsStart)} - {formatTime(selectedIncident.tsEnd)}
                  </span>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {formatDuration(selectedIncident.tsStart, selectedIncident.tsEnd)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Camera className="h-16 w-16 mx-auto mb-4 text-gray-600" />
              <p className="text-lg">Select an incident to view footage</p>
              <p className="text-sm text-gray-600 mt-2">Choose from the incident list on the right</p>
            </div>
          </div>
        )}
      </div>

      {/* Camera Thumbnails */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Camera Feeds</h3>
        <div className="grid grid-cols-3 gap-3">
          {cameras.slice(0, 3).map((camera) => (
            <button
              key={camera.id}
              onClick={() => handleCameraSelect(camera.id)}
              className={`relative bg-gray-900 rounded-lg aspect-video overflow-hidden border-2 transition-all duration-200 ${
                selectedCameraId === camera.id 
                  ? 'border-blue-500' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <img 
                src={`https://images.pexels.com/photos/${2103127 + cameras.indexOf(camera)}/pexels-photo-${2103127 + cameras.indexOf(camera)}.jpeg?auto=compress&cs=tinysrgb&w=200&h=120&fit=crop`}
                alt={camera.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-2">
                <div className="text-left">
                  <p className="text-white text-xs font-medium">{camera.name}</p>
                  <p className="text-gray-300 text-xs truncate">{camera.location}</p>
                </div>
              </div>
              {selectedCameraId === camera.id && (
                <div className="absolute top-1 right-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentPlayer;