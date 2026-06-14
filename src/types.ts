export interface DeploymentRecord {
  id: string;
  timestamp: string;
  productName: string;
  category: string;
  price: number;
  specs: string;
  status: "dispatched" | "active" | "standby";
}

export interface Product {
  id: string;
  name: string;
  category: "electronics" | "oistaria" | "fashion";
  price: number;
  image: string;
  specs: string;
  description: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  recommendedProducts?: { id: string; reason: string }[];
  feedback?: "like" | "dislike";
}

export interface ExtractedPreferences {
  budget: string;
  useCase: string;
  constraints: string[];
}

export type ActiveDomain = "electronics" | "oistaria" | "fashion";

export type PanelView = "assistant" | "dashboard" | "tabletop";
