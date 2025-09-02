import { type Hospital, type SurgeData, type HealthAdvisory, type AiPrediction, type InsertHospital, type InsertSurgeData, type InsertHealthAdvisory, type InsertAiPrediction } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Hospitals
  getHospitals(): Promise<Hospital[]>;
  getHospital(id: string): Promise<Hospital | undefined>;
  createHospital(hospital: InsertHospital): Promise<Hospital>;
  updateHospital(id: string, updates: Partial<InsertHospital>): Promise<Hospital | undefined>;
  
  // Surge Data
  getSurgeData(): Promise<SurgeData[]>;
  getHospitalSurgeData(hospitalId: string): Promise<SurgeData[]>;
  createSurgeData(data: InsertSurgeData): Promise<SurgeData>;
  
  // Health Advisories
  getActiveHealthAdvisories(): Promise<HealthAdvisory[]>;
  createHealthAdvisory(advisory: InsertHealthAdvisory): Promise<HealthAdvisory>;
  
  // AI Predictions
  getAiPredictions(): Promise<AiPrediction[]>;
  createAiPrediction(prediction: InsertAiPrediction): Promise<AiPrediction>;
}

export class MemStorage implements IStorage {
  private hospitals: Map<string, Hospital>;
  private surgeData: Map<string, SurgeData>;
  private healthAdvisories: Map<string, HealthAdvisory>;
  private aiPredictions: Map<string, AiPrediction>;

  constructor() {
    this.hospitals = new Map();
    this.surgeData = new Map();
    this.healthAdvisories = new Map();
    this.aiPredictions = new Map();
    
    // Initialize with sample Mumbai hospitals
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleHospitals: Hospital[] = [
      {
        id: "1",
        name: "Kokilaben Dhirubhai Ambani Hospital",
        location: "Andheri West",
        bedsAvailable: 23,
        icuCapacity: 15,
        status: "good",
        latitude: "19.1317",
        longitude: "72.8267",
        lastUpdated: new Date(),
      },
      {
        id: "2", 
        name: "Hinduja Hospital",
        location: "Mahim",
        bedsAvailable: 7,
        icuCapacity: 8,
        status: "moderate",
        latitude: "19.0401",
        longitude: "72.8397",
        lastUpdated: new Date(),
      },
      {
        id: "3",
        name: "Breach Candy Hospital",
        location: "Breach Candy",
        bedsAvailable: 31,
        icuCapacity: 20,
        status: "good",
        latitude: "18.9735",
        longitude: "72.8112",
        lastUpdated: new Date(),
      },
      {
        id: "4",
        name: "Jupiter Hospital",
        location: "Thane",
        bedsAvailable: 2,
        icuCapacity: 3,
        status: "critical",
        latitude: "19.2183",
        longitude: "72.9781",
        lastUpdated: new Date(),
      }
    ];

    const sampleAdvisories: HealthAdvisory[] = [
      {
        id: "1",
        type: "aqi",
        message: "High AQI in Andheri - Current AQI: 312. Avoid outdoor activities. Use N95 masks if necessary.",
        severity: "high",
        location: "Andheri",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "2",
        type: "temperature",
        message: "Heat Wave Advisory - Temperature expected to reach 42°C. Stay hydrated and avoid sun exposure 11 AM - 4 PM.",
        severity: "medium",
        location: "Mumbai",
        isActive: 1,
        createdAt: new Date(),
      },
      {
        id: "3",
        type: "medical",
        message: "Asthma patients: Ensure inhaler availability during current air quality conditions.",
        severity: "medium",
        location: "Mumbai",
        isActive: 1,
        createdAt: new Date(),
      }
    ];

    const samplePredictions: AiPrediction[] = [
      {
        id: "1",
        type: "surge",
        prediction: { increase: "30%", timeframe: "tomorrow", condition: "asthma cases" },
        confidence: 89,
        alertLevel: "medium",
        createdAt: new Date(),
      },
      {
        id: "2",
        type: "staffing",
        prediction: { needed: "4 ER doctors", timeframe: "weekend surge" },
        confidence: 85,
        alertLevel: "medium",
        createdAt: new Date(),
      },
      {
        id: "3",
        type: "supply",
        prediction: { item: "oxygen cylinders", quantity: "20", urgency: "low supply" },
        confidence: 92,
        alertLevel: "high",
        createdAt: new Date(),
      }
    ];

    sampleHospitals.forEach(hospital => this.hospitals.set(hospital.id, hospital));
    sampleAdvisories.forEach(advisory => this.healthAdvisories.set(advisory.id, advisory));
    samplePredictions.forEach(prediction => this.aiPredictions.set(prediction.id, prediction));
  }

  async getHospitals(): Promise<Hospital[]> {
    return Array.from(this.hospitals.values());
  }

  async getHospital(id: string): Promise<Hospital | undefined> {
    return this.hospitals.get(id);
  }

  async createHospital(insertHospital: InsertHospital): Promise<Hospital> {
    const id = randomUUID();
    const hospital: Hospital = { 
      ...insertHospital,
      id, 
      lastUpdated: new Date(),
      status: insertHospital.status || "good",
      bedsAvailable: insertHospital.bedsAvailable || 0,
      icuCapacity: insertHospital.icuCapacity || 0
    };
    this.hospitals.set(id, hospital);
    return hospital;
  }

  async updateHospital(id: string, updates: Partial<InsertHospital>): Promise<Hospital | undefined> {
    const hospital = this.hospitals.get(id);
    if (!hospital) return undefined;
    
    const updatedHospital = { 
      ...hospital, 
      ...updates, 
      lastUpdated: new Date() 
    };
    this.hospitals.set(id, updatedHospital);
    return updatedHospital;
  }

  async getSurgeData(): Promise<SurgeData[]> {
    return Array.from(this.surgeData.values());
  }

  async getHospitalSurgeData(hospitalId: string): Promise<SurgeData[]> {
    return Array.from(this.surgeData.values()).filter(data => data.hospitalId === hospitalId);
  }

  async createSurgeData(insertData: InsertSurgeData): Promise<SurgeData> {
    const id = randomUUID();
    const data: SurgeData = { 
      ...insertData,
      id, 
      timestamp: new Date(),
      hospitalId: insertData.hospitalId || null
    };
    this.surgeData.set(id, data);
    return data;
  }

  async getActiveHealthAdvisories(): Promise<HealthAdvisory[]> {
    return Array.from(this.healthAdvisories.values()).filter(advisory => advisory.isActive === 1);
  }

  async createHealthAdvisory(insertAdvisory: InsertHealthAdvisory): Promise<HealthAdvisory> {
    const id = randomUUID();
    const advisory: HealthAdvisory = { 
      ...insertAdvisory,
      id, 
      createdAt: new Date(),
      location: insertAdvisory.location || null,
      isActive: insertAdvisory.isActive || 1
    };
    this.healthAdvisories.set(id, advisory);
    return advisory;
  }

  async getAiPredictions(): Promise<AiPrediction[]> {
    return Array.from(this.aiPredictions.values());
  }

  async createAiPrediction(insertPrediction: InsertAiPrediction): Promise<AiPrediction> {
    const id = randomUUID();
    const prediction: AiPrediction = { 
      ...insertPrediction, 
      id, 
      createdAt: new Date() 
    };
    this.aiPredictions.set(id, prediction);
    return prediction;
  }
}

export const storage = new MemStorage();
