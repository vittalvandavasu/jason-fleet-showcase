// Mock data for Northwest Haul Rentals

export const brand = {
  name: 'Northwest Haul Rentals',
  short: 'Northwest Haul',
  tagline: 'Haul Smart. Rent Local.',
  phone: '(360) 500-2004',
  phoneRaw: '3605002004',
  email: 'northwesthaulrentals@gmail.com',
  owner: 'Jason',
  city: 'Olympia, WA',
  street: '3920 113th Ave SW',
  cityLine: 'Olympia, WA 98512',
  address: '3920 113th Ave SW, Olympia, WA 98512',
  hours: 'Mon–Sun · 7:00 AM – 9:00 PM',
};

export const nav = [
  { label: 'Home', href: '#home' },
  { label: 'Trailers', href: '#trailers' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'How It Works', href: '#how' },
  { label: 'Requirements', href: '#requirements' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const heroImages = {
  primary: 'https://images.unsplash.com/photo-1730514785075-b065c757b653?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHw0fHx0cnVjayUyMHRvd2luZ3xlbnwwfHx8fDE3ODUxMDcxNDN8MA&ixlib=rb-4.1.0&q=85',
  secondary: 'https://images.unsplash.com/photo-1626121300305-def4dc305387?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHx0cnVjayUyMHRvd2luZ3xlbnwwfHx8fDE3ODUxMDcxNDN8MA&ixlib=rb-4.1.0&q=85',
};

// The 4 real trailers currently in the fleet
export const trailers = [
  {
    id: 'maxxd-c4x-7k',
    name: 'MAXX-D C4X 7K Car Hauler',
    manufacturer: 'MAXX-D (Maxey Trailers)',
    model: 'C4X 7K Channel',
    year: '2022',
    category: 'Car Hauler',
    tag: 'Most Popular',
    image: '/trailers/ai/maxxd-c4x-7k.jpg',
    gallery: [
      '/trailers/ai/maxxd-c4x-7k.jpg',
      '/trailers/maxxd-c4x-main.jpg',
      '/trailers/maxxd-c4x-wood.jpg',
      '/trailers/maxxd-c4x-grass.jpg',
      '/trailers/maxxd-c6x.jpg',
    ],
    gvwr: '7,000 lbs',
    gawr: '3,500 lbs / axle',
    axles: 'Tandem 3,500 lb brake axles',
    deck: '2×8 treated wood · 83" wide',
    payload: '~4,500–5,000 lbs',
    bestFor: ['Cars & light trucks', 'ATVs & UTVs', 'Small equipment', 'Flatbed hauls'],
    features: [
      '5″ channel main frame + wrap tongue',
      'Slide-in rear ramps',
      'Double-broke diamond-plate fenders',
      'Stake pockets + rub rail',
      '7K drop-leg jack',
      'LED lighting, dual spare tires included',
    ],
    pricing: { hourly: 25, weekday: 120, weekend: 160, weekly: 700, monthly: 2100 },
  },
  {
    id: 'continental-cargo',
    name: 'Continental Enclosed Cargo',
    manufacturer: 'Continental Cargo',
    model: 'Bumper-pull Enclosed',
    year: null,
    category: 'Cargo',
    tag: 'Best Value',
    image: '/trailers/ai/continental-cargo.jpg',
    gallery: [
      '/trailers/ai/continental-cargo.jpg',
      'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/wcgnabxf_087b66f8-3396-4591-90d1-05f9abf33926.jfif',
      'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/8fwkwmf2_6559fc41-858d-46b3-9e4f-15c308c15c53.jfif',
      'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/0nen5l5j_7e89d5ab-6f28-4759-9f55-a36038a86e61.jfif',
      'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/jluzylpu_4455edf8-8b85-4d2e-9cad-4f1b6b4c163f.jfif',
    ],
    gvwr: 'Up to 7,000 lbs',
    gawr: '3,500 lbs / axle',
    axles: 'Single or tandem (tandem in-fleet)',
    deck: 'Fully enclosed · diamond-plate lower',
    payload: '~1,500–5,000+ lbs',
    bestFor: ['Secure moves', 'Weather-sensitive loads', 'Motorcycles', 'Small vehicles'],
    features: [
      'Fully enclosed weather-proof body',
      'Rear ramp / barn-door access',
      'Diamond-plate lower protection',
      'Interior 6–7 ft height',
      'E-track walls & floor',
      'Lockable for high-value hauls',
    ],
    pricing: { hourly: 35, weekday: 180, weekend: 220, weekly: 1000, monthly: 3000 },
  },
  {
    id: 'olympic-utility',
    name: 'Olympic Open Utility',
    manufacturer: 'Olympic',
    model: 'Single-axle Utility',
    year: null,
    category: 'Utility',
    tag: null,
    image: '/trailers/ai/olympic-utility.jpg',
    gallery: ['/trailers/ai/olympic-utility.jpg', '/trailers/olympian.jpg', '/trailers/utility-ramp.jpg'],
    gvwr: '2,990 lbs',
    gawr: '3,500 lbs',
    axles: 'Single axle',
    deck: 'Open box, solid ribbed sides',
    payload: '~1,800–2,400 lbs',
    bestFor: ['Furniture & appliances', 'Lawn equipment', 'General cargo', 'Light construction'],
    features: [
      'Solid ribbed metal side panels',
      'Fold-down / ramp-style rear gate',
      'A-frame tongue with swivel jack',
      'Single axle with fenders',
      'Safety chains included',
      'Better weather protection than mesh',
    ],
    pricing: { hourly: 20, weekday: 90, weekend: 130, weekly: 550, monthly: 1700 },
  },
  {
    id: 'eagle-landscape',
    name: 'Eagle Landscape Trailer',
    manufacturer: 'Eagle',
    model: 'Open Landscape / Utility',
    year: null,
    category: 'Landscape',
    tag: null,
    image: '/trailers/ai/eagle-landscape.jpg',
    gallery: ['/trailers/ai/eagle-landscape.jpg', '/trailers/eagle-falcon.jpg', '/trailers/utility-mesh-back.jpg'],
    gvwr: '2,990–3,500 lbs',
    gawr: '3,500 lbs',
    axles: 'Single axle',
    deck: 'Open flat deck · mesh sides',
    payload: '~1,500–2,500+ lbs',
    bestFor: ['Yard debris & brush', 'Landscaping crews', 'ATVs', 'Loose material'],
    features: [
      'High expanded-metal mesh sides',
      'Solid front, rear access ramp/gate',
      'Tongue jack + safety chains',
      'White modular wheels',
      'Red side markers & reflectors',
      'Easy load / unload',
    ],
    pricing: { hourly: 20, weekday: 80, weekend: 120, weekly: 500, monthly: 1500 },
  },
];

export const categories = ['All', 'Car Hauler', 'Cargo', 'Utility', 'Landscape'];

export const features = [
  {
    icon: 'ShieldCheck',
    title: 'Fully Equipped',
    description: 'Every trailer comes with winches, straps, chains, ramps — no last-minute hardware runs.',
  },
  {
    icon: 'Clock',
    title: 'Same-Day Rentals',
    description: 'Need it now? We offer same-day pickup and flexible hourly rentals starting at just $20/hour.',
  },
  {
    icon: 'MapPin',
    title: 'Local Pickup',
    description: 'Based at 3920 113th Ave SW in Olympia. Serving the greater Puget Sound & Pacific Northwest.',
  },
  {
    icon: 'Wallet',
    title: 'Fair, Flat Pricing',
    description: 'Transparent hourly, daily, weekly, and monthly rates. Deposit refunded at return.',
  },
  {
    icon: 'Sparkles',
    title: 'Clean & Well-Maintained',
    description: 'Every trailer is inspected before rental. Clean, safe, road-ready — every time.',
  },
  {
    icon: 'PhoneCall',
    title: 'Real Human Support',
    description: 'Talk to Jason directly. Fast responses, honest advice, hands-on help hooking up.',
  },
];

export const steps = [
  {
    n: '01',
    title: 'Pick Your Trailer',
    description: 'Browse our fleet and find the right trailer for your job — car hauler, cargo, utility, or landscape.',
  },
  {
    n: '02',
    title: 'Reserve Online',
    description: 'Send us your dates and details. We\'ll confirm availability within the hour.',
  },
  {
    n: '03',
    title: 'Pick Up in Olympia',
    description: 'Come by 3920 113th Ave SW in Olympia. We\'ll help hook up and walk you through everything.',
  },
  {
    n: '04',
    title: 'Haul & Return',
    description: 'Do the job, bring it back clean, and get your deposit back. Simple, honest, done.',
  },
];

export const requirements = [
  'Valid U.S. driver\'s license',
  'Valid auto insurance',
  'Valid credit card for deposit',
  '$50 booking fee (applied to your total)',
  'A tow vehicle in good working condition',
  'Must be 21 or older to rent',
];

export const reviews = [
  {
    name: 'Marcus T.',
    initials: 'MT',
    rating: 5,
    date: '2 weeks ago',
    text: 'Jason was fantastic. Helped me hook up the C4X car hauler and made sure everything was safe before I hit the road. Trailer was spotless, winch worked perfectly, and pricing beat everyone in Olympia. Highly recommend.',
  },
  {
    name: 'Danielle K.',
    initials: 'DK',
    rating: 5,
    date: '1 month ago',
    text: 'Rented the Continental enclosed for a cross-town move. Came with dollies and moving blankets — huge time saver. Booking was easy, pickup was smooth, and the price beat U-Haul by a mile.',
  },
  {
    name: 'Ryan P.',
    initials: 'RP',
    rating: 5,
    date: '3 weeks ago',
    text: 'Needed the MAXX-D last minute for a project truck. Called at 8am, had it by 10am. Trailer was in top shape and Jason clearly cares about his gear. Will absolutely rent again.',
  },
  {
    name: 'Aisha M.',
    initials: 'AM',
    rating: 5,
    date: '2 months ago',
    text: 'Used the Eagle landscape trailer to haul yard debris and a couple of ATVs. Simple, sturdy, and fairly priced. Loved that they offer hourly rentals — perfect for a half-day project.',
  },
  {
    name: 'Ben W.',
    initials: 'BW',
    rating: 5,
    date: '1 week ago',
    text: 'Best trailer rental experience I\'ve had. Local business, real communication, fair prices. The C4X handled two classic cars without a hitch.',
  },
  {
    name: 'Carla R.',
    initials: 'CR',
    rating: 5,
    date: '5 weeks ago',
    text: 'Straightforward, professional, and reasonably priced. Jason answered every question I had, no pressure sales. The Olympic utility was exactly what we needed.',
  },
];

export const faqs = [
  {
    q: 'How do I reserve a trailer?',
    a: 'Reserve online through our booking form or call/text Jason directly at (360) 500-2004. A $50 booking fee holds your rental and is applied to your total at pickup.',
  },
  {
    q: 'What do I need to rent?',
    a: 'A valid driver\'s license, valid auto insurance, a credit card for deposit, and a tow vehicle in good working condition rated for the trailer\'s GVWR. Renters must be 21 or older.',
  },
  {
    q: 'Do you offer same-day rentals?',
    a: 'Yes! Availability permitting, we offer same-day rentals with hourly, 24-hour, weekly, and monthly rates. Call ahead to confirm the trailer you need is on the lot.',
  },
  {
    q: 'Is there a deposit?',
    a: 'Yes, we hold a refundable deposit on your credit card. It\'s returned in full when the trailer is returned undamaged with all included equipment.',
  },
  {
    q: 'What areas do you serve?',
    a: 'Based in Olympia, WA. We serve the greater Puget Sound and Pacific Northwest, including Tacoma, Lacey, Tumwater, Centralia, and surrounding areas. Pickup is at our Olympia location.',
  },
  {
    q: 'What happens if the trailer gets damaged?',
    a: 'Minor wear is expected. Any new damage or missing equipment is deducted from the deposit at fair-market repair cost. We\'ll always walk through it together at return.',
  },
  {
    q: 'Can I extend my rental?',
    a: 'Absolutely — just call or text before your return time. As long as the trailer isn\'t booked, we\'re happy to extend. Additional time is billed at standard rates (late fees apply if unannounced).',
  },
];

export const stats = [
  { value: '500+', label: 'Happy Renters' },
  { value: '4', label: 'Trailer Types' },
  { value: '5.0', label: 'Google Rating' },
  { value: '7 Days', label: 'Open Every Week' },
];

export const RENTAL_AGREEMENT_URL =
  'https://customer-assets-agu9un31.emergentagent.net/job_fleet-showcase-20/artifacts/xz1e57r4_NW%20rentals%20LLC%20Agreement.pdf';
