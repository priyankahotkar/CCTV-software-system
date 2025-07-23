import { collection, addDoc, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Camera, Incident } from '../types';

const cameras: Omit<Camera, 'id'>[] = [
  { name: 'Shop Floor A', location: 'Manufacturing Wing, Level 1' },
  { name: 'Vault', location: 'Security Zone, Basement' },
  { name: 'Main Entrance', location: 'Lobby, Ground Floor' },
  { name: 'Parking Garage', location: 'Sublevel B1' },
  { name: 'Server Room', location: 'IT Wing, Level 2' }
];

const incidentTypes = [
  'Unauthorised Access', 
  'Gun Threat', 
  'Face Recognised', 
  'Suspicious Activity', 
  'Theft Attempt', 
  'Vandalism'
] as const;

const generateIncidents = (cameraIds: string[]): Omit<Incident, 'id' | 'camera'>[] => {
  const incidents: Omit<Incident, 'id' | 'camera'>[] = [];
  const now = new Date();
  
  // Generate 15 incidents over the last 24 hours
  for (let i = 0; i < 15; i++) {
    const hoursAgo = Math.random() * 24;
    const startTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    const endTime = new Date(startTime.getTime() + (Math.random() * 10 + 2) * 60 * 1000); // 2-12 minutes duration
    
    const incident: Omit<Incident, 'id' | 'camera'> = {
      cameraId: cameraIds[Math.floor(Math.random() * cameraIds.length)],
      type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
      tsStart: startTime,
      tsEnd: endTime,
      thumbnailUrl: `https://images.pexels.com/photos/${2103127 + i}/pexels-photo-${2103127 + i}.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop`,
      resolved: Math.random() > 0.6 // 40% chance of being resolved
    };
    
    incidents.push(incident);
  }
  
  return incidents.sort((a, b) => b.tsStart.getTime() - a.tsStart.getTime());
};

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database seed...');
    
    // Clear existing data
    const [camerasSnapshot, incidentsSnapshot] = await Promise.all([
      getDocs(collection(db, 'cameras')),
      getDocs(collection(db, 'incidents'))
    ]);
    
    const deletePromises = [
      ...camerasSnapshot.docs.map(doc => deleteDoc(doc.ref)),
      ...incidentsSnapshot.docs.map(doc => deleteDoc(doc.ref))
    ];
    
    await Promise.all(deletePromises);
    console.log('Cleared existing data');
    
    // Add cameras
    const cameraIds: string[] = [];
    for (const camera of cameras) {
      const docRef = await addDoc(collection(db, 'cameras'), camera);
      cameraIds.push(docRef.id);
    }
    console.log(`Added ${cameras.length} cameras`);
    
    // Add incidents
    const incidents = generateIncidents(cameraIds);
    for (const incident of incidents) {
      await addDoc(collection(db, 'incidents'), {
        ...incident,
        tsStart: Timestamp.fromDate(incident.tsStart),
        tsEnd: Timestamp.fromDate(incident.tsEnd)
      });
    }
    console.log(`Added ${incidents.length} incidents`);
    
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};