import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hospitals = pgTable("hospitals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  bedsAvailable: integer("beds_available").notNull().default(0),
  icuCapacity: integer("icu_capacity").notNull().default(0),
  status: text("status").notNull().default("good"), // good, moderate, critical
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

export const surgeData = pgTable("surge_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hospitalId: varchar("hospital_id").references(() => hospitals.id),
  predictionPercentage: integer("prediction_percentage").notNull(),
  patientInflow: integer("patient_inflow").notNull(),
  aiConfidence: integer("ai_confidence").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const healthAdvisories = pgTable("health_advisories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // aqi, temperature, medical
  message: text("message").notNull(),
  severity: text("severity").notNull(), // low, medium, high, critical
  location: text("location"),
  isActive: integer("is_active").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aiPredictions = pgTable("ai_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // surge, staffing, supply
  prediction: jsonb("prediction").notNull(),
  confidence: integer("confidence").notNull(),
  alertLevel: text("alert_level").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHospitalSchema = createInsertSchema(hospitals).omit({
  id: true,
  lastUpdated: true,
});

export const insertSurgeDataSchema = createInsertSchema(surgeData).omit({
  id: true,
  timestamp: true,
});

export const insertHealthAdvisorySchema = createInsertSchema(healthAdvisories).omit({
  id: true,
  createdAt: true,
});

export const insertAiPredictionSchema = createInsertSchema(aiPredictions).omit({
  id: true,
  createdAt: true,
});

export type Hospital = typeof hospitals.$inferSelect;
export type InsertHospital = z.infer<typeof insertHospitalSchema>;
export type SurgeData = typeof surgeData.$inferSelect;
export type InsertSurgeData = z.infer<typeof insertSurgeDataSchema>;
export type HealthAdvisory = typeof healthAdvisories.$inferSelect;
export type InsertHealthAdvisory = z.infer<typeof insertHealthAdvisorySchema>;
export type AiPrediction = typeof aiPredictions.$inferSelect;
export type InsertAiPrediction = z.infer<typeof insertAiPredictionSchema>;

// Dashboard Stats Type
export interface DashboardStats {
  nextSurge: string;
  currentAqi: number;
  preparednessScore: number;
  patientInflow: {
    current: number;
    emergency: number;
    icu: number;
    general: number;
    outpatient: number;
  };
  cityOverview: {
    totalHospitals: number;
    availableBeds: number;
    icuCapacity: number;
    alertLevel: string;
  };
}
