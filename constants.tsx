
import { Requirement, VerificationItem, DHFFile, NeuralEvent } from './types';

export const PRD_DATA: Requirement[] = [
  { id: 'FR-1', type: 'FR', title: 'Real-time Signal Acquisition', description: 'Continuous sampling of ECG (250Hz), PPG (100Hz), and IMU/SCG (100Hz).', priority: 'High', status: 'Approved' },
  { id: 'FR-2', type: 'FR', title: 'Risk State Engine', description: 'Tri-state alerting (Green/Amber/Red) updated every 10s based on multimodal fusion.', priority: 'High', status: 'Approved' },
  { id: 'MLR-1', type: 'MLR', title: 'SNN-Based Event Detection', description: 'Spiking Neural Network front-end for ultra-low power peak detection and QRS identification.', priority: 'High', status: 'Approved' },
  { id: 'MLR-2', type: 'MLR', title: 'Multi-Path CNN Fusion', description: 'Deep learning fusion of mechanical (SCG) and electrical (ECG) signatures to detect myocarditis risk.', priority: 'High', status: 'Approved' },
  { id: 'NFR-1', type: 'NFR', title: 'On-body Uptime', description: 'Minimum 20 hours of daily operation on a single charge.', priority: 'Medium', status: 'Draft' },
  { id: 'NFR-2', type: 'NFR', title: 'Cybersecurity / HIPAA', description: 'End-to-end encryption for pediatric data per ISO 27001.', priority: 'High', status: 'Approved' },
];

export const VERIFICATION_MATRIX: VerificationItem[] = [
  { reqId: 'FR-1', method: 'Test', protocolId: 'TP-001-A', status: 'Pass', remarks: 'Validated via bench test with signal generator.' },
  { reqId: 'FR-2', method: 'Analysis', protocolId: 'TP-002-C', status: 'Pending', remarks: 'Clinical validation study ongoing at City Pediatrics.' },
  { reqId: 'MLR-1', method: 'Analysis', protocolId: 'TP-003-SNN', status: 'Pass', remarks: 'SNN latency <2ms on edge MCU.' },
  { reqId: 'MLR-2', method: 'Analysis', protocolId: 'TP-004-DL', status: 'Pass', remarks: 'CNN-LSTM model achieved 94% AUC on pilot myocarditis cohort.' },
];

export const DHF_STRUCTURE: DHFFile[] = [
  { 
    name: '01_Design_Inputs', type: 'Folder', status: 'Complete',
    children: [
      { name: 'Product_Requirements_Document.pdf', type: 'File' },
      { name: 'Pediatric_User_Study_Report.pdf', type: 'File' },
    ]
  },
  { 
    name: '02_Design_Outputs', type: 'Folder', status: 'In Progress',
    children: [
      { name: 'SNN_Architecture_Specs.json', type: 'File' },
      { name: 'Hardware_Schematics_V2.zip', type: 'File' },
    ]
  },
  { 
    name: '03_Risk_Management', type: 'Folder', status: 'In Progress',
    children: [
      { name: 'ISO_14971_FMEA.xlsx', type: 'File' },
      { name: 'Clinical_Safety_Evaluation.pdf', type: 'File' },
    ]
  },
  { 
    name: '04_ML_Transparency', type: 'Folder', status: 'Complete',
    children: [
      { name: 'Model_Card_CNN_Fusion.pdf', type: 'File' },
      { name: 'Dataset_Bias_Analysis.pdf', type: 'File' },
    ]
  }
];

export const NEURAL_EVENTS: NeuralEvent[] = [
  { timestamp: '10:42:15', type: 'Arrhythmia', confidence: 0.98, source: 'SNN-Edge', description: 'Premature Ventricular Contraction detected via edge-spiking.' },
  { timestamp: '10:45:30', type: 'MechanicalDelta', confidence: 0.85, source: 'CNN-Cloud', description: 'Reduction in SCG stroke amplitude; potential contractility shift.' },
  { timestamp: '10:50:02', type: 'Hypoperfusion', confidence: 0.92, source: 'SNN-Edge', description: 'PPG amplitude damping consistent with peripheral vasoconstriction.' },
];
