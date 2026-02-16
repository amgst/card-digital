
export interface SocialLink {
  platform: string;
  url: string;
  id: string;
}

export interface CardData {
  name: string;
  title: string;
  company: string;
  bio: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  themeColor: string;
  secondaryColor: string;
  profileImage: string;
  bannerImage: string;
  socialLinks: SocialLink[];
  slug: string; // The custom URL identifier
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  bg: string;
}
