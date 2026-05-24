/**
 * Frontend mock data — used when NEXT_PUBLIC_USE_MOCK=true so the UI runs
 * and deploys with zero backend. Mirrors the backend's API response shapes.
 */
import { triageRequest, matchDonors as ruleMatch, screenEligibility as ruleScreen, forecastDemand } from './bloodClient';

export const MOCK_USERS = [
  { _id: 'u1', name: 'Arjun Sharma', email: 'arjun@raktsetu.in', role: 'donor', bloodType: 'O+', city: 'Mumbai', phone: '+91 98765 43210', donorStatus: 'active', available: true, lastDonation: '2026-02-14', totalDonations: 7, points: 700, tier: 'Gold', reliability: 92, verified: true },
  { _id: 'u2', name: 'Dr. Priya Menon', email: 'admin@raktsetu.in', role: 'admin', bloodType: 'A+', city: 'Bangalore', phone: '+91 99887 65432', donorStatus: 'active', available: true, lastDonation: '2026-01-20', totalDonations: 4, points: 400, tier: 'Silver', reliability: 88, verified: true },
  { _id: 'u9', name: 'Ramesh Gupta', email: 'hospital@raktsetu.in', role: 'hospital', bloodType: '', city: 'Delhi', phone: '+91 98100 22222', donorStatus: 'active', available: true, lastDonation: null, hospitalName: 'AIIMS New Delhi', licenseNumber: 'DL-BB-00123', designation: 'Blood Bank Officer', verified: true },
];

export const MOCK_DONORS = [
  ...MOCK_USERS,
  { _id: 'u3', name: 'Rahul Verma', bloodType: 'O-', city: 'Delhi', donorStatus: 'active', available: true, lastDonation: '2025-11-02', totalDonations: 12, tier: 'Platinum', reliability: 97, verified: true },
  { _id: 'u4', name: 'Sneha Iyer', bloodType: 'B+', city: 'Mumbai', donorStatus: 'active', available: true, lastDonation: '2026-03-01', totalDonations: 3, tier: 'Silver', reliability: 80, verified: true },
  { _id: 'u5', name: 'Karthik Nair', bloodType: 'O+', city: 'Chennai', donorStatus: 'active', available: true, lastDonation: '2026-04-10', totalDonations: 5, tier: 'Gold', reliability: 85, verified: true },
  { _id: 'u6', name: 'Pooja Desai', bloodType: 'O-', city: 'Mumbai', donorStatus: 'active', available: true, lastDonation: '2026-01-05', totalDonations: 8, tier: 'Gold', reliability: 91, verified: true },
  { _id: 'u7', name: 'Aditya Kumar', bloodType: 'AB-', city: 'Indore', donorStatus: 'active', available: true, lastDonation: '2025-10-20', totalDonations: 9, tier: 'Platinum', reliability: 95, verified: true },
  { _id: 'u8', name: 'Meera Joshi', bloodType: 'B-', city: 'Pune', donorStatus: 'active', available: false, lastDonation: '2026-05-01', totalDonations: 2, tier: 'Bronze', reliability: 70, verified: true },
];

export const MOCK_HOSPITALS = [
  { _id: 'h1', name: 'AIIMS New Delhi', city: 'New Delhi', phone: '011-2658-8500', beds: 2478, hasBloodBank: true, verified: true,
    inventory: [{ bloodType: 'O+', units: 203 }, { bloodType: 'O-', units: 34 }, { bloodType: 'A+', units: 124 }, { bloodType: 'A-', units: 12 }, { bloodType: 'B+', units: 89 }, { bloodType: 'B-', units: 8 }, { bloodType: 'AB+', units: 56 }, { bloodType: 'AB-', units: 6 }] },
  { _id: 'h2', name: 'Kokilaben Dhirubhai Ambani Hospital', city: 'Mumbai', phone: '022-3066-1234', beds: 750, hasBloodBank: true, verified: true,
    inventory: [{ bloodType: 'O+', units: 156 }, { bloodType: 'O-', units: 22 }, { bloodType: 'A+', units: 98 }, { bloodType: 'B+', units: 110 }, { bloodType: 'B-', units: 4 }, { bloodType: 'AB+', units: 40 }] },
  { _id: 'h3', name: 'Manipal Hospital', city: 'Bangalore', phone: '080-2502-4444', beds: 600, hasBloodBank: true, verified: true,
    inventory: [{ bloodType: 'O+', units: 134 }, { bloodType: 'O-', units: 18 }, { bloodType: 'A+', units: 76 }, { bloodType: 'A-', units: 5 }, { bloodType: 'B+', units: 92 }, { bloodType: 'AB+', units: 33 }] },
  { _id: 'h4', name: 'Apollo Hospitals', city: 'Chennai', phone: '044-2829-3333', beds: 560, hasBloodBank: true, verified: true,
    inventory: [{ bloodType: 'O+', units: 142 }, { bloodType: 'A+', units: 88 }, { bloodType: 'A-', units: 14 }, { bloodType: 'B+', units: 70 }, { bloodType: 'AB+', units: 28 }, { bloodType: 'AB-', units: 9 }] },
];

const baseEmergencies = [
  { _id: 'e1', bloodType: 'O-', units: 4, urgency: 'critical', hospital: 'AIIMS New Delhi', city: 'Delhi', ward: 'Trauma ICU', contactName: 'Dr. S. Rao', contactPhone: '+91 98100 00001', patientAge: 34, patientGender: 'Male', reason: 'Road accident trauma surgery, severe blood loss.', status: 'open', respondersCount: 3, createdAt: new Date(Date.now() - 12 * 60000).toISOString() },
  { _id: 'e2', bloodType: 'B-', units: 2, urgency: 'urgent', hospital: 'Kokilaben Hospital', city: 'Mumbai', ward: 'Maternity', contactName: 'Nurse Latha', contactPhone: '+91 98200 00002', patientAge: 28, patientGender: 'Female', reason: 'Post-partum hemorrhage backup units.', status: 'open', respondersCount: 1, createdAt: new Date(Date.now() - 48 * 60000).toISOString() },
  { _id: 'e3', bloodType: 'AB-', units: 1, urgency: 'moderate', hospital: 'Manipal Hospital', city: 'Bangalore', ward: 'Oncology', contactName: 'Dr. Pillai', contactPhone: '+91 98300 00003', patientAge: 61, patientGender: 'Male', reason: 'Chemotherapy support transfusion.', status: 'open', respondersCount: 0, createdAt: new Date(Date.now() - 120 * 60000).toISOString() },
];

export const MOCK_EMERGENCIES = baseEmergencies.map((e) => ({ ...e, ...triageRequest(e) }));

export const MOCK_STATS = {
  registeredDonors: 247832,
  bloodUnitsAvailable: 18640,
  hospitalsConnected: 284,
  openEmergencies: MOCK_EMERGENCIES.length,
  livesSaved: 93200,
};

// Re-export client-side rule engines so mock endpoints behave like the backend.
export { ruleMatch, ruleScreen, forecastDemand };
