
export type Role = 'admin' | 'talent' | 'booker' | 'visitor';

export enum TalentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum SubscriptionTier {
  FREE = 'FREE',
  STARTER = 'STARTER',
  PRO = 'PRO',
  ELITE = 'ELITE'
}

export interface Talent {
  id: string;
  slug: string;
  stage_name: string;
  bio: string;
  city: string;
  country: string;
  categories: string[];
  genres: string[];
  base_rate_min?: number;
  base_rate_max?: number;
  status: TalentStatus;
  visibility: boolean;
  featured: boolean;
  subscription_tier: SubscriptionTier;
  hero_image?: string;
}

export interface BookingRequest {
  id: string;
  talent_id: string;
  requester_name: string;
  requester_email: string;
  event_type: string;
  event_date: string;
  status: 'new' | 'contacted' | 'negotiating' | 'booked' | 'declined' | 'closed';
  created_at: string;
}

export interface Media {
  id: string;
  talent_id: string;
  type: 'image' | 'video' | 'audio' | 'link';
  url: string;
  title: string;
}
