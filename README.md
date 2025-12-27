# HakilixM: Pediatric Cardiac Intelligence System

[![ISO 13485](https://img.shields.io/badge/Compliance-ISO_13485-blue.svg)](https://www.iso.org/standard/59752.html)
[![FDA SaMD](https://img.shields.io/badge/Regulatory-FDA_SaMD_Class_II-green.svg)](https://www.fda.gov/medical-devices/software-medical-device-samd)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#copyright)

**HakilixM** is a high-fidelity distributed monitoring system designed for early detection of pediatric myocarditis in patients under 5 years old. The system leverages a multi-tier neural architecture, combining ultra-low-power **Spiking Neural Networks (SNN)** on-body with heavyweight **CNN-RNN Fusion** in the cloud.

---

## 🏗 System Architecture

The system follows a distributed compute topology to balance battery longevity with clinical precision.

```mermaid
graph TD
    subgraph "On-Body Wearable (Edge Tier)"
        A[Textile ECG/PPG/SCG Sensors] --> B[ARM Cortex-M4F MCU]
        B --> C{SNN Logic}
        C -- "QRS Spikes" --> D[Edge Inference]
        C -- "Rhythm Triggers" --> D
    end

    subgraph "Gateway (Mobile/Bedside)"
        D -- "BLE 5.2 (Encrypted)" --> E[Mobile Application]
        E -- "Signal Normalization" --> F[Gateway Buffer]
    end

    subgraph "Clinical Core (Cloud Tier)"
        F -- "HTTPS/TLS 1.3" --> G[GCP Vertex AI]
        G --> H[Multi-Path CNN-RNN Fusion]
        H -- "Anomaly Score" --> I[Expert System]
        I -- "Alerts" --> J[Clinical Dashboard]
    end

    style C fill:#1e3a8a,stroke:#3b82f6,color:#fff
    style H fill:#4c1d95,stroke:#a78bfa,color:#fff
    style J fill:#064e3b,stroke:#10b981,color:#fff
```

---

## 🚀 Getting Started (Local Development)

To run the HakilixM Intelligence Dashboard in a local environment, follow these steps:

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **NPM** or **Yarn**
- A valid **Gemini API Key** (for Neural Auditor features)

### 2. Installation
Clone the repository and install the required dependencies:
```bash
git clone https://github.com/hakilix/hakilixm-dashboard.git
cd hakilixm-dashboard
npm install
```

### 3. Environment Configuration
Create a `.env` file in the project root and add your API key. The application uses this key exclusively for the `analyzeRiskPattern` service.
```env
API_KEY=your_gemini_api_key_here
```

### 4. Launch
Run the development server:
```bash
npm start
```
The dashboard will be available at `http://localhost:3000`.

---

## 🧠 Neural Intelligence Pipeline

The **Anomaly Engine** processes synchronized physiological streams through a stacked contribution model.

```mermaid
sequenceDiagram
    participant S as Sensors (ECG/PPG/SCG)
    participant E as SNN Encoder (Edge)
    participant F as Feature Fusion (Cloud)
    participant A as Anomaly Engine
    participant D as Clinical Dashboard

    S->>E: Raw Micro-volt Signals
    E->>E: Temporal Coding (LIF Neurons)
    E->>F: Spike Train Events
    Note over F: STDP-based Feature Extraction
    F->>A: Latent Vector (Morphology + Perfusion)
    A->>A: RNN-based Temporal Drift Analysis
    A->>D: Probability of Myocarditis Risk (Stacked Scores)
```

---

## 📊 Feature Contributions

HakilixM provides transparency into its decision-making via **Explainable AI (XAI)** markers:
- **ECG Morphology Deviation:** Detecting R-peak damping or QRS widening.
- **PPG Perfusion Amplitude:** Real-time monitoring of cardiac output shifts.
- **SCG Mechanical Pattern:** Tracking contractility changes in the 10-50Hz band.

---

## ⚖️ Regulatory Traceability

The system is developed under a strict Design History File (DHF) structure:
1. **Design Inputs:** PRD-1.0 to PRD-5.0 (Clinical & Performance Requirements).
2. **Risk Management:** FMEA per ISO 14971; Pediatric Bio-compatibility analysis.
3. **Verification:** Traceability matrix linking every ML requirement to a Test Protocol.

---

## 🛡 Copyright

**Copyright © 2025 Hakilix Labs UK Ltd.**  
Proprietary and Confidential. Unauthorized distribution prohibited.

**Principal Investigator:** Musah Shaibu (MS3)  
**Contact:** research@hakilix.co.uk