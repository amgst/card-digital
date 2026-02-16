
import { Theme } from './types';

export const DEFAULT_CARD_DATA = {
  name: "Jane Doe",
  title: "Senior Brand Architect",
  company: "Creative Pulse Studios",
  bio: "Passionate about building digital experiences that resonate. Helping brands bridge the gap between imagination and reality through strategic design.",
  phone: "+1 (555) 000-1234",
  email: "jane@creativepulse.com",
  website: "www.creativepulse.com",
  location: "San Francisco, CA",
  themeColor: "#4F46E5",
  secondaryColor: "#111827",
  profileImage: "https://picsum.photos/seed/profile/400/400",
  bannerImage: "https://picsum.photos/seed/banner/800/400",
  socialLinks: [
    { id: '1', platform: 'LinkedIn', url: 'https://linkedin.com' },
    { id: '2', platform: 'Twitter', url: 'https://twitter.com' },
    { id: '3', platform: 'Instagram', url: 'https://instagram.com' }
  ],
  slug: "jane-doe"
};

export const THEMES: Theme[] = [
  { id: 'midnight', name: 'Midnight Blue', primary: '#1E40AF', secondary: '#1e1b4b', bg: '#f8fafc' },
  { id: 'emerald', name: 'Emerald Forest', primary: '#059669', secondary: '#064e3b', bg: '#f0fdf4' },
  { id: 'sunset', name: 'Sunset Glow', primary: '#EA580C', secondary: '#7c2d12', bg: '#fffaf5' },
  { id: 'royal', name: 'Royal Purple', primary: '#7C3AED', secondary: '#4c1d95', bg: '#f5f3ff' },
  { id: 'monochrome', name: 'Sleek Onyx', primary: '#27272a', secondary: '#09090b', bg: '#ffffff' },
];

export const SOCIAL_PLATFORMS = [
  'LinkedIn', 'Twitter', 'Instagram', 'GitHub', 'YouTube', 'Facebook', 'TikTok', 'WhatsApp'
];
