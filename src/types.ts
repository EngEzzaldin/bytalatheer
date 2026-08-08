export interface PortfolioItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  category: 'plumbing' | 'electrical' | 'finishing' | 'masonry' | 'landscaping' | 'hangars' | 'maintenance' | 'overall';
  mediaUrl: string;
  mediaType: 'image' | 'video';
  workerNameAr?: string;
  workerNameEn?: string;
  projectDate?: string;
}

export interface LicenseItem {
  id: string;
  titleAr: string;
  titleEn: string;
  imageUrl: string;
  issuedByAr?: string;
  issuedByEn?: string;
  issueDate?: string;
}

export interface SiteSettings {
  adminPin: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  aboutTextAr: string;
  aboutTextEn: string;
  visionTextAr: string;
  visionTextEn: string;
}
