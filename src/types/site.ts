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