# 🧠 Engineering Decisions: CoconutGuard

This document outlines the key technical decisions made during the development of **CoconutGuard**, a dual-platform agricultural intelligence system.

---

## 1. Dual-Platform Ecosystem (Flutter + Next.js)

### **Context**
The system requires real-time data collection in the field (farms) and high-level analytics for centralized management.

### **The Decision**
We implemented a **Dual-Platform Architecture**:
- **Mobile (Flutter)**: Chosen for its high performance and cross-platform capabilities. It handles edge ML inference and field data entry.
- **Web (Next.js)**: Chosen for its superior SEO, fast rendering, and ability to handle complex data visualizations for admins and experts.

### **Consequences**
- ✅ Clear separation of concerns.
- ✅ Optimized performance for specific user roles.
- ⚠️ Requires maintaining two separate codebases, bridged by a shared Firebase backend.

---

## 2. Edge ML Inference with TFLite

### **Context**
Farmers often work in remote areas with poor or non-existent internet connectivity. Cloud-based ML would be unreliable.

### **The Decision**
We integrated **TensorFlow Lite (TFLite)** directly into the Flutter application. 
- Models are bundled with the app assets.
- Inference is performed locally on the device's NPU/GPU.

### **Consequences**
- ✅ 100% offline disease detection.
- ✅ Real-time feedback for farmers.
- ⚠️ App size increase (model weights).

---

## 3. Local-First Persistence (Hive + Firestore Sync)

### **Context**
Mobile users must be able to log yields and scan diseases without a network connection.

### **The Decision**
We implemented a **Local-First** strategy using:
- **Hive**: A lightweight, blazing-fast NoSQL database for Flutter.
- **Background Sync Service**: A custom service that monitors connectivity and pushes queued items to **Firestore** when the device returns online.

### **Consequences**
- ✅ Zero data loss in remote areas.
- ✅ Fluid UI (no waiting for network calls).
- ⚠️ Complexity in handling potential sync conflicts.

---

## 4. Resilient Demo Mode & Mock Fallbacks

### **Context**
During development and recruitment reviews, persistent Firebase configurations or stable internet might not always be available.

### **The Decision**
Implemented **Resilient Service Layers**:
- **API Fallbacks**: The Next.js API routes catch Firestore errors and return realistic mock data.
- **Service Guards**: Flutter services use mock data and local-only logic if Firebase initialization fails.

### **Consequences**
- ✅ 100% "Always-Ready" demonstration.
- ✅ Decoupled development of frontend and backend.

---

## 5. Security Architecture (AES + RBAC)

### **Context**
Sensitive agricultural and demographics data must be protected.

### **The Decision**
- **RBAC (Role-Based Access Control)**: Enforced via Firebase Auth custom claims and Firestore security rules.
- **Data Security**: Potential for AES encryption of sensitive local data (indexed in roadmap).

### **Consequences**
- ✅ Secure separation between Farmers and Admins.
- ✅ Compliance with data privacy standards.

---

## 6. Folder Patterns & Architectural Integrity

### **Mobile (Flutter): MVVM + Repository Pattern**
We followed a clean multi-layered approach to ensure scalability and testability:
- **`lib/presentation/`**: Uses the **MVVM (Model-View-ViewModel)** pattern. ViewModels handle logic and state, keeping UI code (Widgets/Screens) declarative and lightweight.
- **`lib/data/`**: Implements the **Repository Pattern**. This abstracts the origin of data (Hive vs Firestore), allowing the UI to remain agnostic of the data source.
- **`lib/services/`**: The "Hardware & Infrastructure" layer. Contains singletons for ML Inference, Database connections, and Background Sync logic.

### **Web (Next.js): App Router & Component Architecture**
- **`src/app/`**: Leverages **Next.js 14 App Router** for optimized file-based routing and server-side rendering (SSR) benefits.
- **`src/components/`**: Follows a **Component-Based Architecture**. UI is broken down into atomic reusable elements (buttons, inputs) and complex composite structures (charts, data tables).
- **`src/lib/`**: Centralized logic hub for Firebase initialization and shared utility functions.

---

## 7. Hybrid Deployment Pattern (Cloud/Edge Bridge)

The system operates on a **Cloud-Edge Hybrid** model:
1. **Edge Node (Mobile)**: Primary data producer and real-time classifier.
2. **Cloud Brain (Firebase)**: Centralized data aggregator and authority.
3. **Control Center (Web)**: The analytical lens for experts to monitor the distributed edge nodes.
