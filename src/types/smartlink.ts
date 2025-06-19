// src/types/smartlink.ts
export interface Platform {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  button_text?: string;
  clicks?: number;
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
  // Nouveaux champs pour la page de destination
  landing_page_title?: string;
  landing_page_subtitle?: string;
  cover_image_url?: string;
  embed_url?: string;
  long_description?: string;
  social_sharing_enabled?: boolean;
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
  // Nouveaux champs pour la page de destination
  landing_page_title?: string;
  landing_page_subtitle?: string;
  cover_image_url?: string;
  embed_url?: string;
  long_description?: string;
  social_sharing_enabled?: boolean;
}

export interface LandingPageData {
  id: string;
  landing_page_title: string;
  landing_page_subtitle?: string;
  cover_image_url?: string;
  platforms: Platform[];
  embed_url?: string;
  long_description?: string;
  social_sharing_enabled: boolean;
  views: number;
  clicks: number;
}

