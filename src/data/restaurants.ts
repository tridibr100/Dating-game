import { Restaurant } from '../types';

/**
 * ============================================================================
 * RESTAURANT CONFIGURATION DATA (BENGALURU OPTIONS)
 * ============================================================================
 * 1. Pizza 4P's (Indiranagar) - https://maps.app.goo.gl/vpRm3C38fbK3NWgn6
 * 2. LUPA (MG Road) - https://maps.app.goo.gl/ngzfLKL2SdyQXx8B8
 * 3. Spettacolare (Indiranagar) - https://maps.app.goo.gl/5mfM5wSAPPu4yNQv6
 */
export const DEFAULT_RESTAURANTS: Restaurant[] = [
  {
    id: 'pizza-4ps',
    name: "Pizza 4P's",
    tagline: 'House-made burrata, earth-to-table craft pizza & romantic garden vibes',
    cuisine: 'Artisanal Pizza & Italian-Japanese',
    vibe: 'Earthy, Warm & Romantic',
    vibeIcon: '🍕',
    rating: 4.8,
    reviewCount: 3840,
    priceLevel: '$$$',
    imageUrl:
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Artisanal fresh gourmet pizza and warm candlelight dinner table',
    description:
      'Famous for house-made organic burrata, artisanal wood-fired pizzas, lush greenery, and intimate warm lighting.',
    address: '12th Main Rd, HAL 2nd Stage, Indiranagar',
    mapsUrl: 'https://maps.app.goo.gl/vpRm3C38fbK3NWgn6',
    defaultTime: '9:30 PM',
    highlight: 'Perfect for sharing artisanal pizza & house-crafted burrata',
  },
  {
    id: 'lupa',
    name: 'LUPA',
    tagline: 'Grand European culinary theatre, craft cocktails & luxury dining',
    cuisine: 'Modern European & Italian',
    vibe: 'Glamorous & Intimate',
    vibeIcon: '✨',
    rating: 4.9,
    reviewCount: 2420,
    priceLevel: '$$$$',
    imageUrl:
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Luxury European dining room with warm ambient lighting and elegant seating',
    description:
      'Chef Manu Chandra’s opulent culinary destination featuring handmade pastas, signature wood-fired grills, and exquisite desserts.',
    address: "Spencer's Towers, MG Road, Ashok Nagar",
    mapsUrl: 'https://maps.app.goo.gl/ngzfLKL2SdyQXx8B8',
    defaultTime: '9:30 PM',
    highlight: 'Boyfriend’s top recommendation for an unforgettable, dress-up date night',
  },
  {
    id: 'spettacolare',
    name: 'Spettacolare',
    tagline: 'Authentic regional Italian dining, artisanal gelateria & craft aperitifs',
    cuisine: 'Authentic Italian',
    vibe: 'Chic, Romantic & Vibrant',
    vibeIcon: '🍝',
    rating: 4.8,
    reviewCount: 1650,
    priceLevel: '$$$',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Chic Italian restaurant with romantic table settings and cocktails',
    description:
      'Sleek multi-level dining with handmade ravioli, authentic Neapolitan crusts, velvety tiramisu, and craft aperitifs in the heart of Indiranagar.',
    address: 'Paramahansa Yogananda Rd, Stage 2, Indiranagar',
    mapsUrl: 'https://maps.app.goo.gl/5mfM5wSAPPu4yNQv6',
    defaultTime: '9:30 PM',
    highlight: 'Cozy romantic corners made for whispering and deep conversations',
  },
];
