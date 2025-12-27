
export enum View {
  OVERVIEW = 'OVERVIEW',
  PRD = 'PRD',
  ARCHITECTURE = 'ARCHITECTURE',
  NEURAL_ANALYSIS = 'NEURAL_ANALYSIS',
  DHF = 'DHF',
  VERIFICATION = 'VERIFICATION',
  AI_AUDITOR = 'AI_AUDITOR'
}

export interface Requirement {
  id: string;
  type: 'FR' | 'NFR' | 'MLR';
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Draft' | 'Approved' | 'Verified';
}

export interface VerificationItem {
  reqId: string;
  method: 'Inspection' | 'Analysis' | 'Test' | 'Demonstration';
  protocolId: string;
  status: 'Pass' | 'Fail' | 'Pending';
  remarks: string;
}

export interface DHFFile {
  name: string;
  type: 'Folder' | 'File';
  children?: DHFFile[];
  status?: 'Complete' | 'In Progress' | 'Pending';
}

export interface NeuralEvent {
  timestamp: string;
  type: 'Arrhythmia' | 'Hypoperfusion' | 'MechanicalDelta' | 'UnsupervisedAnomaly';
  confidence: number;
  source: 'SNN-Edge' | 'CNN-Cloud' | 'Autoencoder-Core';
  description: string;
}

export interface SensorWave {
  time: number;
  ecg: number;
  ppg: number;
  scg: number;
  anomalyScore?: number;
}

export interface AnomalyMetric {
  timestamp: number;
  score: number;
  reconstructionError: number;
  contributionECG: number;
  contributionPPG: number;
  contributionSCG: number;
}
