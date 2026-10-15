# Maha Business Hub (D Company, Mehkar)

A complete, responsive local business directory, offer showcase, and digital lead hub serving Mehkar, Lonar, and surrounding regions in Maharashtra. The platform connects local customers with verified shops through instant WhatsApp chats, Google Map review links, lead-generating discount coupons, dynamic shop counter D-QR codes, a PIN-protected D Company Admin dashboard, and a dedicated Shop Owner portal.

> [!IMPORTANT] Confirmed User Preferences
> - **Visual Style**: Modern Vibrant Amber & Emerald theme tailored for energetic local Marathi commercial hubs.
> - **Initial Data**: Pre-loaded with rich, authentic local listings in Mehkar and Lonar across Agriculture (Agri), Mobile & Electronics, Garments & Fashion, Hospitals & Healthcare, and Coaching & Education.
> - **Admin Credentials**: Access PIN set to `7777` by default (configurable within the Admin settings tab).

---

## 1. Overview & Core Concept

### What It Does
1. **Public Business Directory & Landing**: Browse verified local businesses in Mehkar and Lonar grouped by popular niches. Search, filter by region and niche, view daily offers, chat directly via WhatsApp, leave Google Map reviews, and claim discount coupons (which capture lead name & phone number).
2. **Dynamic D-QR System**: Generates custom shop-branded QR codes for physical counters. Scanning opens the exact shop profile, active offer, and coupon form instantly.
3. **Admin Dashboard (D Company)**: Protected by PIN `7777`. Add/edit/delete businesses, manage ₹999 monthly/yearly subscription packages, track expiry dates, monitor total platform leads, and generate printable D-QR store flyers.
4. **Shop Owner Portal**: Shop owners log in using their phone number or shop PIN to update daily deals, toggle offer status, track customer coupon leads, and download/print their D-QR store card.

### Target Personas
- **Local Shoppers (Mehkar & Lonar)**: Looking for trusted local stores, active discounts, contact info, and Google directions.
- **Local Shop Owners**: Seeking simple digital marketing, daily offer promotion, and customer contact collection without complex tech overhead.
- **D Company Administrators**: Managing business onboarding, subscription renewals, revenue status, and region-wide advertising.

---

## 2. User Experience & Visual Design

### Key User Flows

#### Customer Flow
1. **Explore Directory**: Filter by Region (Mehkar / Lonar / All) and Niche (Agri, Mobile, Garments, Hospitals, Coaching, Food, Services).
2. **Shop Profile & Offer**: View business gallery, address, today's special offer, WhatsApp chat button, and Google Maps direction/review link.
3. **Claim Discount Coupon**: Click "Get Discount Coupon", enter Name and Phone number. Auto-saves lead to database, produces a digital coupon code (e.g. `MAHA-MEH-842`), and displays redemption instructions.
4. **D-QR Scan**: Customers scanning the in-shop D-QR flyer land directly on the shop's mobile offer page.

#### Shop Owner Flow
1. **Login**: Enter registered phone number or Shop PIN (default shop PINs provided for demo).
2. **Offer Manager**: Update headline, discount percentage, validity, and details for "Today's Offer".
3. **Lead Inbox**: View all customer phone numbers and names who claimed discount coupons for their shop, with date and time.
4. **Download D-QR Counter Standee**: Preview and print/download branded counter card with D-QR code.

#### D Company Admin Flow
1. **Authenticate**: Unlock dashboard with PIN `7777`.
2. **Business Management**: Form to add new shop with Name, Region, Category, Owner Phone, Address, Subscription Plan (Free / ₹999 Monthly / ₹2999 Yearly), Expiry Date, Photo URL/Preset, and Google Review URL.
3. **Analytics & Plan Management**: View platform totals (Total Shops, Paid Shops, Expiring Soon, Total Leads Generated). Filter shops by payment status and update subscription expiry with 1 click.

### Visual Identity & Theme
- **Color Palette**:
  - Dominant Canvas: Clean Warm White (`#fdfbf7`) & Subtle Warm Slate (`#f8fafc`).
  - Brand Accent Primary: Energetic Amber / Saffron (`#d97706` / `amber-600` & `#b45309`).
  - Trust Accent Secondary: Deep Vibrant Emerald (`#059669` / `emerald-600` & `#047857`).
  - Text & Borders: Rich Charcoal (`#0f172a`) and soft slate borders (`#e2e8f0`).
- **Typography**: Bold clear Sans headings (`Plus Jakarta Sans` style) paired with clean tabular numbers for prices, phone numbers, and coupon codes.
- **Mobile First Ergonomics**: Bottom navigation bar on mobile viewports for effortless 1-thumb category browsing, WhatsApp triggers, and QR view.

---

## 3. Key Product Decisions & Trade-Offs

- **Local Storage + Browser Database Engine**: Uses an integrated browser persistence store with pre-seeded rich realistic listings for Mehkar and Lonar. Data changes (added businesses, updated offers, newly generated leads, PIN changes) persist automatically across reloads.
- **WhatsApp Integration**: Constructs direct `https://wa.me/91...` URLs pre-filled with friendly Marathi/English inquiry messages (e.g., *"Hello! I saw your offer on Maha Business Hub and would like to inquire about..."*).
- **Google Maps Integration**: Direct links to Google Review & Directions links for every listed business.
- **Dynamic D-QR Flyer Generator**: Canvas/SVG rendered QR codes with store branding, phone number, and printable layout designed for counter standees.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MAHA BUSINESS HUB APP                              │
├──────────────────────────────┬──────────────────────────────┬───────────────┤
│    PUBLIC DIRECTORY VIEW     │     ADMIN DASHBOARD VIEW     │ SHOP OWNER    │
│  - Regional & Niche Filters  │  - PIN Authenticator (7777)  │   PORTAL      │
│  - Search & Shop Profiles    │  - Shop CRUD & Photos        │ - Daily Offer │
│  - Today's Offer Banner      │  - Subscription & Expiry     │ - Shop Leads  │
│  - WhatsApp & Map Links      │  - Global Lead Database      │ - Print D-QR  │
│  - Discount Coupon Claim     │  - Plan Revenue Analytics    │   Standee     │
├──────────────────────────────┴──────────────────────────────┴───────────────┤
│                             DATA & STATE LAYER                              │
│ - Initial Seed Data (Mehkar & Lonar Shops across Agri, Mobile, Garments, etc)│
│ - Local Storage Persistence (Shops, Leads, Subscriptions, Admin PIN)        │
│ - WhatsApp URL & D-QR Generator Utilities                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Models

```ts
export interface Business {
  id: string;
  name: string;
  tagline: string;
  category: 'Agri' | 'Mobile' | 'Garments' | 'Hospitals' | 'Coaching' | 'Food' | 'Services';
  region: 'Mehkar' | 'Lonar';
  address: string;
  ownerPhone: string;
  whatsappNumber: string;
  googleMapUrl: string;
  image: string;
  subscription: {
    status: 'Free' | 'Paid';
    planName: 'Basic Free' | '₹999 Monthly' | '₹2999 Yearly';
    expiryDate: string;
    amountPaid: number;
  };
  todaysOffer: {
    title: string;
    description: string;
    discountTag: string;
    validTill: string;
    isActive: boolean;
  };
  shopPin: string;
  rating: number;
  totalReviews: number;
  featured: boolean;
  createdAt: string;
}

export interface Lead {
  id: string;
  businessId: string;
  businessName: string;
  customerName: string;
  customerPhone: string;
  couponCode: string;
  claimedAt: string;
  status: 'Claimed' | 'Redeemed';
}
```

---

## 5. Planned File Structure & Modifications

- `metadata.json`: Name & description update.
- `index.html`: Update title to "Maha Business Hub (D Company, Mehkar)", SEO tags, Google font imports.
- `src/types/index.ts`: Business, Lead, Offer, Plan, and Filter type definitions.
- `src/data/initialData.ts`: Pre-loaded realistic shops in Mehkar and Lonar (Agri, Mobile, Garments, Hospitals, Coaching, Food).
- `src/services/storage.ts`: Persistent storage helper for Businesses, Leads, and Admin PIN.
- `src/components/Header.tsx`: Responsive header with D Company branding and navigation buttons.
- `src/components/BottomNav.tsx`: Touch-friendly mobile bottom tab bar.
- `src/components/BusinessCard.tsx`: Card view with category badge, offer highlight, WhatsApp & Map links, and Coupon button.
- `src/components/BusinessDetailModal.tsx`: Comprehensive profile modal with full details, offer, Google Review CTA, and coupon claim form.
- `src/components/CouponClaimModal.tsx`: Interactive form to capture customer Name & Phone and issue instant coupon code.
- `src/components/DQRModal.tsx`: Dynamic D-QR display and printable counter standee view.
- `src/components/AdminDashboard.tsx`: PIN authentication, analytics, shop CRUD, subscription manager, and lead viewer.
- `src/components/ShopOwnerPortal.tsx`: Shop owner login & daily offer updater.
- `src/App.tsx`: Navigation router and central app controller.
