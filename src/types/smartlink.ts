// src/types/smartlink.ts
export interface Platform {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export interface Smartlink {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  artist: string;
  releaseDate: string;
  platforms: Platform[];
  analytics: {
    gtmId?: string;
    ga4Id?: string;
  };
  customization: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
  createdAt: string;
  updatedAt: string;
  views: number;
  clicks: Record<string, number>;
}

export interface SmartlinkFormData {
  title: string;
  description: string;
  artist: string;
  releaseDate: string;
  coverImage: string;
  platforms: Platform[];
  analytics: {
    gtmId?: string;
    ga4Id?: string;
  };
  customization: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
}