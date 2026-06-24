export interface ContentCategory {
  title: string;
  image: string;
  alt: string;
  link: string;
  active?: boolean;
}

export interface ContentBanner {
  title?: string;
  subtitle?: string;
  highlight?: string;
  image: string;
  alt: string;
  ctaText?: string;
  link?: string;
  variant?: string;
}

export interface ContentOfferStrip {
  text: string;
  image: string;
  alt: string;
}

export interface ContentProduct {
  title: string;
  description?: string;
  image: string;
  alt: string;
  price: number;
  oldPrice?: number;
  currency: string;
  unit?: string;
  rating?: number;
  deliveryTime?: string;
  offerTag?: string;
  ctaText?: string;
  link?: string;
  active?: boolean;
  sections?: string;
}

export interface ContentRestaurant {
  title: string;
  image: string;
  alt: string;
  link: string;
  items: string;
  rating: number;
  reviews: string;
  place: string;
  pricePerPerson: number;
  currency: string;
  distance: string;
  deliveryTime: string;
  offerAmount?: string;
  offerLabel?: string;
  badge?: string;
}

export interface ContentBrand {
  title: string;
  image: string;
  alt: string;
  link: string;
}

export interface HomeContent {
  categories: ContentCategory[];
  offerStrip: ContentOfferStrip;
  banners: ContentBanner[];
  featuredProducts: ContentProduct[];
}

export interface FoodContent {
  banners: ContentBanner[];
  categories: ContentCategory[];
  popularProducts: ContentProduct[];
  restaurants: ContentRestaurant[];
  brands: ContentBrand[];
  offers: ContentBanner[];
  emptyState: {
    title: string;
    subtitle: string;
  };
}

export interface GroceryContent {
  categories: ContentCategory[];
  banners: ContentBanner[];
  products: ContentProduct[];
  popularProducts: ContentProduct[];
  offers: ContentBanner[];
  bestSellers: ContentProduct[];
  recentItems: ContentProduct[];
}

export interface PharmacyContent {
  categories: ContentCategory[];
  banners: ContentBanner[];
  offers: ContentProduct[];
  products: ContentProduct[];
  wellnessItems: ContentProduct[];
  discountBanners: ContentBanner[];
  bestSellers: ContentProduct[];
}

export interface ProfileMenuItem {
  title: string;
  icon: string;
  alt: string;
  link: string;
}

export interface ProfileContent {
  user: {
    name: string;
    email: string;
    image: string;
    alt: string;
  };
  menuItems: ProfileMenuItem[];
}
