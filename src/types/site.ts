export interface Site {
  _id: string;
  name: string;
  url: string;
  description: string;
  tags: string[];
  type: string;
  screenshot: string;
  createdAt: string;
}

export interface SiteFormData {
  name: string;
  url: string;
  description: string;
  tags: string[];
  type: string;
  screenshot: string;
} 

export interface StoredMonitor {
  id: number;
  friendly_name: string;
  url: string;
  type: number;
  status: number;
  create_datetime: number;
  average_response_time?: number;
  lastUpdated: number;
}

export interface Bookmark {
  name: string;
  url: string;
  domain?: string;
  description?: string;
  tags: string[];
  type: string;
  addedAt: number;
  screenshot?: string;
  icon?: string;
}