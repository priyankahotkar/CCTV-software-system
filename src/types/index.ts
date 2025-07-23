export interface Camera {
  id: string;
  name: string;
  location: string;
}

export interface Incident {
  id: string;
  cameraId: string;
  camera?: Camera;
  type: 'Unauthorised Access' | 'Gun Threat' | 'Face Recognised' | 'Suspicious Activity' | 'Theft Attempt' | 'Vandalism';
  tsStart: Date;
  tsEnd: Date;
  thumbnailUrl: string;
  resolved: boolean;
}

export type IncidentType = Incident['type'];