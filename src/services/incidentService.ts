import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  onSnapshot,
  addDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Incident, Camera } from '../types';

const INCIDENTS_COLLECTION = 'incidents';
const CAMERAS_COLLECTION = 'cameras';

export const incidentService = {
  // Get incidents with optional filtering
  async getIncidents(resolved?: boolean): Promise<Incident[]> {
    try {
      let q = query(
        collection(db, INCIDENTS_COLLECTION),
        orderBy('tsStart', 'desc')
      );

      if (resolved !== undefined) {
        q = query(
          collection(db, INCIDENTS_COLLECTION),
          where('resolved', '==', resolved),
          orderBy('tsStart', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      const incidents: Incident[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        incidents.push({
          id: docSnap.id,
          ...data,
          tsStart: data.tsStart.toDate(),
          tsEnd: data.tsEnd.toDate(),
        } as Incident);
      }

      return incidents;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  },

  // Subscribe to real-time incident updates
  subscribeToIncidents(
    callback: (incidents: Incident[]) => void,
    resolved?: boolean
  ) {
    let q = query(
      collection(db, INCIDENTS_COLLECTION),
      orderBy('tsStart', 'desc')
    );

    if (resolved !== undefined) {
      q = query(
        collection(db, INCIDENTS_COLLECTION),
        where('resolved', '==', resolved),
        orderBy('tsStart', 'desc')
      );
    }

    return onSnapshot(q, (snapshot) => {
      const incidents: Incident[] = [];
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        incidents.push({
          id: doc.id,
          ...data,
          tsStart: data.tsStart.toDate(),
          tsEnd: data.tsEnd.toDate(),
        } as Incident);
      });
      callback(incidents);
    });
  },

  // Resolve an incident
  async resolveIncident(id: string): Promise<Incident | null> {
    try {
      const incidentRef = doc(db, INCIDENTS_COLLECTION, id);
      await updateDoc(incidentRef, {
        resolved: true
      });

      // Return updated incident
      const incidents = await this.getIncidents();
      return incidents.find(incident => incident.id === id) || null;
    } catch (error) {
      console.error('Error resolving incident:', error);
      return null;
    }
  },

  // Get cameras
  async getCameras(): Promise<Camera[]> {
    try {
      const snapshot = await getDocs(collection(db, CAMERAS_COLLECTION));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Camera));
    } catch (error) {
      console.error('Error fetching cameras:', error);
      return [];
    }
  }
};