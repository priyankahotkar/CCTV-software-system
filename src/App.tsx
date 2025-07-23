import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import IncidentPlayer from './components/IncidentPlayer';
import IncidentList from './components/IncidentList';
import { incidentService } from './services/incidentService';
import { seedDatabase } from './utils/seedData';
import { Incident, Camera } from './types';

function App() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    // Subscribe to real-time incident updates
    const unsubscribe = incidentService.subscribeToIncidents((updatedIncidents) => {
      // Enrich incidents with camera data
      const enrichedIncidents = updatedIncidents.map(incident => ({
        ...incident,
        camera: cameras.find(camera => camera.id === incident.cameraId)
      }));
      
      setIncidents(enrichedIncidents);
      
      // Update selected incident if it was modified
      if (selectedIncident) {
        const updatedSelected = enrichedIncidents.find(inc => inc.id === selectedIncident.id);
        if (updatedSelected) {
          setSelectedIncident(updatedSelected);
        }
      }
    });

    return () => unsubscribe();
  }, [cameras, selectedIncident]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load cameras first
      const camerasData = await incidentService.getCameras();
      setCameras(camerasData);
      
      // Load incidents
      const incidentsData = await incidentService.getIncidents();
      
      // Enrich incidents with camera data
      const enrichedIncidents = incidentsData.map(incident => ({
        ...incident,
        camera: camerasData.find(camera => camera.id === incident.cameraId)
      }));
      
      setIncidents(enrichedIncidents);
      
      // Auto-select the first unresolved incident
      const firstUnresolved = enrichedIncidents.find(incident => !incident.resolved);
      if (firstUnresolved) {
        setSelectedIncident(firstUnresolved);
      }
      
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedData = async () => {
    setLoading(true);
    await seedDatabase();
    await loadInitialData();
  };

  const handleIncidentSelect = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleIncidentResolve = async (id: string) => {
    // Optimistic update
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === id 
          ? { ...incident, resolved: true }
          : incident
      )
    );
    
    if (selectedIncident?.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, resolved: true } : null);
    }

    // API call
    try {
      await incidentService.resolveIncident(id);
    } catch (error) {
      console.error('Error resolving incident:', error);
      // Revert optimistic update on error
      await loadInitialData();
    }
  };

  const handleCameraSelect = (cameraId: string) => {
    // Find the most recent incident for this camera
    const cameraIncidents = incidents.filter(incident => incident.cameraId === cameraId);
    if (cameraIncidents.length > 0) {
      setSelectedIncident(cameraIncidents[0]);
    }
  };

  const unresolvedCount = incidents.filter(incident => !incident.resolved).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading SecureSight Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar 
        totalIncidents={incidents.length}
        unresolvedIncidents={unresolvedCount}
        onSeedData={handleSeedData}
      />
      
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Incident Player - Left Side */}
          <div className="h-full">
            <IncidentPlayer
              selectedIncident={selectedIncident}
              cameras={cameras}
              onCameraSelect={handleCameraSelect}
            />
          </div>
          
          {/* Incident List - Right Side */}
          <div className="h-full">
            <IncidentList
              incidents={incidents}
              selectedIncident={selectedIncident}
              onIncidentSelect={handleIncidentSelect}
              onIncidentResolve={handleIncidentResolve}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;