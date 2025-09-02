import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHospitalSchema, insertSurgeDataSchema, insertHealthAdvisorySchema, insertAiPredictionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hospitals endpoints
  app.get("/api/hospitals", async (_req, res) => {
    try {
      const hospitals = await storage.getHospitals();
      res.json(hospitals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hospitals" });
    }
  });

  app.get("/api/hospitals/:id", async (req, res) => {
    try {
      const hospital = await storage.getHospital(req.params.id);
      if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
      }
      res.json(hospital);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hospital" });
    }
  });

  app.post("/api/hospitals", async (req, res) => {
    try {
      const validatedData = insertHospitalSchema.parse(req.body);
      const hospital = await storage.createHospital(validatedData);
      res.status(201).json(hospital);
    } catch (error) {
      res.status(400).json({ error: "Invalid hospital data" });
    }
  });

  app.put("/api/hospitals/:id", async (req, res) => {
    try {
      const updates = insertHospitalSchema.partial().parse(req.body);
      const hospital = await storage.updateHospital(req.params.id, updates);
      if (!hospital) {
        return res.status(404).json({ error: "Hospital not found" });
      }
      res.json(hospital);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  // Surge data endpoints
  app.get("/api/surge-data", async (_req, res) => {
    try {
      const surgeData = await storage.getSurgeData();
      res.json(surgeData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch surge data" });
    }
  });

  app.get("/api/surge-data/:hospitalId", async (req, res) => {
    try {
      const surgeData = await storage.getHospitalSurgeData(req.params.hospitalId);
      res.json(surgeData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hospital surge data" });
    }
  });

  app.post("/api/surge-data", async (req, res) => {
    try {
      const validatedData = insertSurgeDataSchema.parse(req.body);
      const surgeData = await storage.createSurgeData(validatedData);
      res.status(201).json(surgeData);
    } catch (error) {
      res.status(400).json({ error: "Invalid surge data" });
    }
  });

  // Health advisories endpoints
  app.get("/api/health-advisories", async (_req, res) => {
    try {
      const advisories = await storage.getActiveHealthAdvisories();
      res.json(advisories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch health advisories" });
    }
  });

  app.post("/api/health-advisories", async (req, res) => {
    try {
      const validatedData = insertHealthAdvisorySchema.parse(req.body);
      const advisory = await storage.createHealthAdvisory(validatedData);
      res.status(201).json(advisory);
    } catch (error) {
      res.status(400).json({ error: "Invalid advisory data" });
    }
  });

  // AI predictions endpoints
  app.get("/api/ai-predictions", async (_req, res) => {
    try {
      const predictions = await storage.getAiPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AI predictions" });
    }
  });

  app.post("/api/ai-predictions", async (req, res) => {
    try {
      const validatedData = insertAiPredictionSchema.parse(req.body);
      const prediction = await storage.createAiPrediction(validatedData);
      res.status(201).json(prediction);
    } catch (error) {
      res.status(400).json({ error: "Invalid prediction data" });
    }
  });

  // Enhanced Dashboard stats endpoint
  app.get("/api/dashboard-stats", async (_req, res) => {
    try {
      const hospitals = await storage.getHospitals();
      const predictions = await storage.getAiPredictions();
      
      const stats = {
        nextSurge: "18% Rise",
        currentAqi: 284,
        preparednessScore: 78,
        patientInflow: {
          current: 47,
          emergency: 12,
          icu: 8,
          general: 19,
          outpatient: 8
        },
        cityOverview: {
          totalHospitals: hospitals.length,
          availableBeds: hospitals.reduce((sum, h) => sum + h.bedsAvailable, 0),
          icuCapacity: Math.round((hospitals.reduce((sum, h) => sum + h.icuCapacity, 0) / hospitals.length) * 100 / 20), // Percentage
          alertLevel: "Medium"
        }
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Enhanced 7-day surge forecast endpoint
  app.get("/api/surge-forecast", async (_req, res) => {
    try {
      const forecast = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: date.toISOString().split('T')[0],
          predicted: Math.floor(Math.random() * 50) + 40 + (i * 3),
          confidence: Math.floor(Math.random() * 20) + 75,
          upperBound: Math.floor(Math.random() * 20) + 80 + (i * 4),
          lowerBound: Math.floor(Math.random() * 15) + 30 + (i * 2),
          riskLevel: i < 2 ? 'low' : i < 5 ? 'medium' : 'high'
        };
      });
      
      res.json(forecast);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch surge forecast" });
    }
  });

  // Hospital performance leaderboard endpoint
  app.get("/api/hospital-leaderboard", async (_req, res) => {
    try {
      const hospitals = await storage.getHospitals();
      
      const leaderboard = hospitals.map((hospital, index) => ({
        id: hospital.id,
        name: hospital.name,
        score: Math.floor(Math.random() * 40) + 60,
        efficiency: Math.floor(Math.random() * 30) + 70,
        patientSatisfaction: Math.floor(Math.random() * 25) + 75,
        responseTime: Math.floor(Math.random() * 10) + 8,
        rank: index + 1,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null
      })).sort((a, b) => b.score - a.score);
      
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hospital leaderboard" });
    }
  });

  // Resource optimization suggestions endpoint
  app.get("/api/resource-optimization", async (_req, res) => {
    try {
      const optimizations = {
        staffing: [
          {
            type: 'shortage',
            department: 'Emergency',
            current: 12,
            recommended: 16,
            urgency: 'high',
            impact: 'Patient wait times reduced by 35%',
            action: 'Transfer 4 nurses from General Ward'
          },
          {
            type: 'surplus',
            department: 'General Ward',
            current: 24,
            recommended: 20,
            urgency: 'medium',
            impact: 'Optimize resource allocation',
            action: 'Redeploy 4 nurses to Emergency'
          }
        ],
        equipment: [
          {
            item: 'Ventilators',
            current: 8,
            recommended: 12,
            urgency: 'critical',
            reason: 'Surge prediction indicates 40% increase',
            supplier: 'MediEquip Mumbai',
            eta: '4 hours'
          },
          {
            item: 'Oxygen Cylinders',
            current: 45,
            recommended: 65,
            urgency: 'high',
            reason: 'AQI spike affecting respiratory cases',
            supplier: 'OxyGen Solutions',
            eta: '2 hours'
          }
        ],
        beds: [
          {
            type: 'ICU',
            current: 85,
            recommended: 95,
            urgency: 'medium',
            action: 'Convert 10 general beds to ICU configuration'
          }
        ]
      };
      
      res.json(optimizations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resource optimization" });
    }
  });

  // Emergency alerts endpoint with sound trigger capability
  app.get("/api/emergency-alerts", async (_req, res) => {
    try {
      const alerts = [
        {
          id: 'surge-001',
          type: 'surge',
          level: 'critical',
          message: 'Mass casualty event detected - 15+ ambulances incoming',
          hospital: 'KEM Hospital',
          timestamp: new Date(),
          soundAlert: true,
          color: 'red'
        },
        {
          id: 'supply-002',
          type: 'supply',
          level: 'high',
          message: 'Oxygen supply critically low - 2 hours remaining',
          hospital: 'Hinduja Hospital',
          timestamp: new Date(Date.now() - 300000),
          soundAlert: false,
          color: 'orange'
        },
        {
          id: 'staff-003',
          type: 'staffing',
          level: 'medium',
          message: 'Emergency department understaffed - need 3 doctors',
          hospital: 'Tata Memorial',
          timestamp: new Date(Date.now() - 600000),
          soundAlert: false,
          color: 'yellow'
        }
      ];
      
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency alerts" });
    }
  });

  // AI Heatmap data endpoint
  app.get("/api/map-heatmap", async (_req, res) => {
    try {
      const heatmapData = {
        patientInflow: [
          { lat: 19.0896, lng: 72.8656, intensity: 0.8, radius: 0.02 }, // Bandra
          { lat: 19.0176, lng: 72.8562, intensity: 0.6, radius: 0.015 }, // Worli  
          { lat: 19.0761, lng: 72.8775, intensity: 0.9, radius: 0.025 }, // Andheri
          { lat: 19.1136, lng: 72.8697, intensity: 0.4, radius: 0.01 }, // Malad
          { lat: 19.0330, lng: 72.8697, intensity: 0.7, radius: 0.018 }  // Dadar
        ],
        pollution: [
          { lat: 19.0728, lng: 72.8826, intensity: 0.9, radius: 0.03 }, // High AQI - Andheri East
          { lat: 19.0896, lng: 72.8656, intensity: 0.7, radius: 0.025 }, // Moderate - Bandra
          { lat: 19.0176, lng: 72.8562, intensity: 0.5, radius: 0.02 }, // Lower - Worli
          { lat: 19.1136, lng: 72.8697, intensity: 0.8, radius: 0.022 }  // High - Malad
        ],
        outbreaks: [
          { lat: 19.0896, lng: 72.8656, intensity: 0.6, radius: 0.015, type: 'respiratory' },
          { lat: 19.0761, lng: 72.8775, intensity: 0.4, radius: 0.012, type: 'gastrointestinal' },
          { lat: 19.0330, lng: 72.8697, intensity: 0.3, radius: 0.008, type: 'fever' }
        ]
      };
      
      res.json(heatmapData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  });

  // Predictive surge zones endpoint
  app.get("/api/surge-zones", async (_req, res) => {
    try {
      const surgeZones = [
        {
          id: 'zone-1',
          name: 'Bandra East',
          coordinates: [
            { lat: 19.0896, lng: 72.8656 },
            { lat: 19.0920, lng: 72.8680 },
            { lat: 19.0940, lng: 72.8640 },
            { lat: 19.0916, lng: 72.8620 }
          ],
          riskLevel: 'high',
          surgePrediction: '65% surge risk',
          timeframe: '24 hrs',
          confidence: 89,
          triggers: ['Festival crowd', 'AQI spike', 'Traffic accidents']
        },
        {
          id: 'zone-2', 
          name: 'Andheri West',
          coordinates: [
            { lat: 19.0761, lng: 72.8775 },
            { lat: 19.0780, lng: 72.8800 },
            { lat: 19.0800, lng: 72.8750 },
            { lat: 19.0781, lng: 72.8730 }
          ],
          riskLevel: 'medium',
          surgePrediction: '35% surge risk',
          timeframe: '48 hrs',
          confidence: 76,
          triggers: ['Pollution levels', 'Weekend events']
        },
        {
          id: 'zone-3',
          name: 'Worli-Dadar',
          coordinates: [
            { lat: 19.0176, lng: 72.8562 },
            { lat: 19.0200, lng: 72.8580 },
            { lat: 19.0220, lng: 72.8540 },
            { lat: 19.0196, lng: 72.8520 }
          ],
          riskLevel: 'low',
          surgePrediction: '15% surge risk', 
          timeframe: '72 hrs',
          confidence: 82,
          triggers: ['Seasonal patterns']
        }
      ];
      
      res.json(surgeZones);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch surge zones" });
    }
  });

  // Hospital flow lines endpoint
  app.get("/api/hospital-flows", async (_req, res) => {
    try {
      const flows = [
        {
          from: { id: '4', name: 'Jupiter Hospital', lat: 19.0456, lng: 72.8735 },
          to: { id: '1', name: 'Kokilaben Hospital', lat: 19.0728, lng: 72.8826 },
          patientCount: 8,
          urgency: 'high',
          type: 'overflow_transfer',
          eta: '15 min'
        },
        {
          from: { id: '2', name: 'Hinduja Hospital', lat: 19.0330, lng: 72.8697 },
          to: { id: '3', name: 'Breach Candy Hospital', lat: 19.0176, lng: 72.8562 },
          patientCount: 3,
          urgency: 'medium', 
          type: 'specialist_referral',
          eta: '22 min'
        },
        {
          from: { id: '1', name: 'Kokilaben Hospital', lat: 19.0728, lng: 72.8826 },
          to: { id: '4', name: 'Jupiter Hospital', lat: 19.0456, lng: 72.8735 },
          patientCount: 5,
          urgency: 'low',
          type: 'load_balancing',
          eta: '18 min'
        }
      ];
      
      res.json(flows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hospital flows" });
    }
  });

  // Ambulance tracking endpoint
  app.get("/api/ambulance-tracking", async (_req, res) => {
    try {
      const ambulances = Array.from({ length: 12 }, (_, i) => {
        const routes = [
          [{ lat: 19.0896, lng: 72.8656 }, { lat: 19.0728, lng: 72.8826 }], // Bandra to Andheri
          [{ lat: 19.0330, lng: 72.8697 }, { lat: 19.0176, lng: 72.8562 }], // Dadar to Worli
          [{ lat: 19.0761, lng: 72.8775 }, { lat: 19.0456, lng: 72.8735 }], // Andheri to Thane
          [{ lat: 19.1136, lng: 72.8697 }, { lat: 19.0896, lng: 72.8656 }]  // Malad to Bandra
        ];
        
        const route = routes[i % routes.length];
        const progress = Math.random();
        
        return {
          id: `amb-${i + 1}`,
          status: i < 4 ? 'emergency' : i < 8 ? 'transfer' : 'available',
          priority: i < 2 ? 'critical' : i < 6 ? 'high' : 'medium',
          currentPosition: {
            lat: route[0].lat + (route[1].lat - route[0].lat) * progress,
            lng: route[0].lng + (route[1].lng - route[0].lng) * progress
          },
          route: route,
          destination: route[1],
          eta: Math.floor(Math.random() * 20) + 5,
          patientCondition: i < 4 ? 'critical' : i < 8 ? 'stable' : null
        };
      });
      
      res.json(ambulances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ambulance tracking" });
    }
  });

  // Hospital detailed simulation data endpoint
  app.get("/api/hospital-simulation/:id", async (req, res) => {
    try {
      const hospitalId = req.params.id;
      
      const simulation = {
        id: hospitalId,
        realTimeData: {
          bedUsage: {
            total: 150,
            occupied: Math.floor(Math.random() * 50) + 80,
            available: Math.floor(Math.random() * 30) + 20,
            reserved: Math.floor(Math.random() * 15) + 5
          },
          icuStatus: {
            total: 25,
            occupied: Math.floor(Math.random() * 10) + 15,
            ventilators: {
              total: 20,
              inUse: Math.floor(Math.random() * 8) + 10,
              available: Math.floor(Math.random() * 5) + 2
            }
          },
          staffWorkload: {
            doctors: { current: 12, required: 15, workload: 85 },
            nurses: { current: 45, required: 50, workload: 92 },
            technicians: { current: 20, required: 18, workload: 70 }
          },
          emergencyQueue: {
            waiting: Math.floor(Math.random() * 15) + 5,
            avgWaitTime: Math.floor(Math.random() * 30) + 15,
            priority: {
              critical: Math.floor(Math.random() * 3) + 1,
              high: Math.floor(Math.random() * 5) + 2,
              medium: Math.floor(Math.random() * 8) + 3
            }
          }
        },
        predictions: {
          nextHourInflow: Math.floor(Math.random() * 20) + 15,
          surgeProbability: Math.floor(Math.random() * 40) + 30,
          resourceNeeds: {
            additionalBeds: Math.floor(Math.random() * 10) + 2,
            extraStaff: Math.floor(Math.random() * 5) + 1,
            supplies: ['Oxygen', 'IV fluids', 'Ventilator circuits']
          }
        }
      };
      
      res.json(simulation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hospital simulation" });
    }
  });

  // Scenario simulation endpoint
  app.post("/api/simulate-scenario", async (req, res) => {
    try {
      const { scenario } = req.body;
      
      const simulations = {
        festival: {
          increase: '+65%',
          timeframe: 'Peak in 4-8 hours',
          staff: { doctors: '+8', nurses: '+16', techs: '+6' },
          supplies: { oxygen: '40', iv: '200', vents: '5' }
        },
        pollution: {
          increase: '+45%', 
          timeframe: 'Peak in 6-12 hours',
          staff: { doctors: '+6', nurses: '+12', techs: '+4' },
          supplies: { oxygen: '25', iv: '150', vents: '3' }
        },
        epidemic: {
          increase: '+120%',
          timeframe: 'Peak in 2-4 days',
          staff: { doctors: '+15', nurses: '+30', techs: '+10' },
          supplies: { oxygen: '80', iv: '400', vents: '12' }
        }
      };
      
      const result = simulations[scenario as keyof typeof simulations];
      if (!result) {
        return res.status(400).json({ error: "Invalid scenario" });
      }
      
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Simulation failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
