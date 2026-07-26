// Mock data for Northwest Haul Rentals

export const brand = {
  name: 'Northwest Haul Rentals',
  short: 'Northwest Haul',
  tagline: 'Haul Smart. Rent Local.',
  phone: '(360) 500-2004',
  phoneRaw: '3605002004',
  email: 'northwesthaulrentals@gmail.com',
  owner: 'Jason',
  city: 'Vancouver, WA',
  address: 'Vancouver, Washington · Serving the Pacific Northwest',
  hours: 'Mon–Sun · 7:00 AM – 9:00 PM',
};

export const nav = [
  { label: 'Home', href: '#home' },
  { label: 'Trailers', href: '#trailers' },
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

export const trailers = [
  {
    id: 'car-hauler-20',
    name: 'Car Hauler 102" x 20\'',
    category: 'Car Hauler',
    image: 'https://images.unsplash.com/photo-1761917904658-2a9ecb84a169?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxjYXIlMjBoYXVsZXJ8ZW58MHx8fHwxNzg1MTA3MTM2fDA&ixlib=rb-4.1.0&q=85',
    gvwr: '10,400 lbs',
    features: ['Drive-over fenders', '12k lb winch', 'Ramp extensions for low cars', 'Heavy duty straps'],
    pricing: {
      hourly: 25,
      weekday: 120,
      weekend: 160,
      weekly: 700,
      monthly: 2100,
    },
    tag: 'Most Popular',
  },
  {
    id: 'tilt-deck-22',
    name: 'Deckover Tilt 102" x 22\'',
    category: 'Tilt Deck',
    image: 'https://images.unsplash.com/photo-1682980799090-c4c6342be01a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHw0fHxjYXIlMjBoYXVsZXJ8ZW58MHx8fHwxNzg1MTA3MTM2fDA&ixlib=rb-4.1.0&q=85',
    gvwr: '14,000 lbs',
    features: ['Hydraulic tilt deck', '12k lb winch', 'Heavy duty binders', 'Chains + straps included'],
    pricing: {
      hourly: 30,
      weekday: 140,
      weekend: 180,
      weekly: 800,
      monthly: 2400,
    },
    tag: null,
  },
  {
    id: 'tilt-deck-24',
    name: 'Deckover Tilt 102" x 24\'',
    category: 'Tilt Deck',
    image: 'https://images.unsplash.com/photo-1756888218811-76f80423861b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwzfHxmbGF0YmVkJTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxNDN8MA&ixlib=rb-4.1.0&q=85',
    gvwr: '14,000 lbs',
    features: ['Hydraulic tilt deck', '12k lb winch', 'Chains + binders', 'Extra long deck length'],
    pricing: {
      hourly: 35,
      weekday: 160,
      weekend: 200,
      weekly: 900,
      monthly: 2700,
    },
    tag: null,
  },
  {
    id: '2-car-36',
    name: '2-Car Hauler 102" x 36\'',
    category: 'Car Hauler',
    image: 'https://images.unsplash.com/photo-1698998882426-39a6609ab10a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHwyfHxmbGF0YmVkJTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxNDN8MA&ixlib=rb-4.1.0&q=85',
    gvwr: '16,000 lbs',
    features: ['Fits two full-size cars', '12k lb winch', '8 straps included', 'Ramp extensions'],
    pricing: {
      hourly: 50,
      weekday: 220,
      weekend: 260,
      weekly: 1200,
      monthly: 3600,
    },
    tag: 'Best Value',
  },
  {
    id: 'enclosed-20',
    name: 'Enclosed Cargo 20\' + 2\' Nose',
    category: 'Cargo',
    image: 'https://images.unsplash.com/photo-1520101244246-293f77ffc39e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHw0fHx0cmFpbGVyJTIwcmVudGFsfGVufDB8fHx8MTc4NTEwNzEzN3ww&ixlib=rb-4.1.0&q=85',
    gvwr: '9,999 lbs',
    features: ['E-track walls & floor', 'Dollies + moving blankets', '12k lb winch', 'Weather-proof interior'],
    pricing: {
      hourly: 35,
      weekday: 180,
      weekend: 220,
      weekly: 1000,
      monthly: 3000,
    },
    tag: null,
  },
  {
    id: 'enclosed-24',
    name: 'Enclosed Cargo 24\' + 2\' Nose',
    category: 'Cargo',
    image: 'https://images.unsplash.com/photo-1499147463149-adc471bbc639?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MDV8MHwxfHNlYXJjaHwzfHx0cmFpbGVyJTIwcmVudGFsfGVufDB8fHx8MTc4NTEwNzEzN3ww&ixlib=rb-4.1.0&q=85',
    gvwr: '9,999 lbs',
    features: ['Extra length for big loads', 'E-track walls & floor', 'Moving supplies included', '12k lb winch'],
    pricing: {
      hourly: 40,
      weekday: 200,
      weekend: 240,
      weekly: 1100,
      monthly: 3300,
    },
    tag: null,
  },
  {
    id: 'utility-16',
    name: '16ft Utility Trailer',
    category: 'Utility',
    image: 'https://images.unsplash.com/photo-1772852336286-933f5b460e33?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHwzfHx1dGlsaXR5JTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxMzZ8MA&ixlib=rb-4.1.0&q=85',
    gvwr: '7,000 lbs',
    features: ['Removable side rails', 'Side-loading ramps', 'E-track on floor', 'Perfect for landscaping'],
    pricing: {
      hourly: 20,
      weekday: 100,
      weekend: 140,
      weekly: 600,
      monthly: 1800,
    },
    tag: null,
  },
  {
    id: 'utility-12',
    name: '12ft Utility Trailer',
    category: 'Utility',
    image: 'https://images.unsplash.com/photo-1767651871489-146f3815f310?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2ODl8MHwxfHNlYXJjaHw0fHx1dGlsaXR5JTIwdHJhaWxlcnxlbnwwfHx8fDE3ODUxMDcxMzZ8MA&ixlib=rb-4.1.0&q=85',
    gvwr: '3,500 lbs',
    features: ['Compact & maneuverable', 'Removable side rails', 'Ramps included', 'Great for small hauls'],
    pricing: {
      hourly: 20,
      weekday: 80,
      weekend: 120,
      weekly: 500,
      monthly: 1500,
    },
    tag: 'Budget Pick',
  },
];

export const categories = ['All', 'Car Hauler', 'Tilt Deck', 'Cargo', 'Utility'];

export const features = [
  {
    icon: 'ShieldCheck',
    title: 'Fully Equipped',
    description: 'Every trailer comes with winches, straps, chains, and everything you need — no surprises.',
  },
  {
    icon: 'Clock',
    title: 'Same-Day Rentals',
    description: 'Need it now? We offer same-day pickup and flexible hourly rentals starting at just $20/hour.',
  },
  {
    icon: 'MapPin',
    title: 'Local Pickup',
    description: 'Based in Vancouver, WA. Serving Portland, Longview, and the greater Pacific Northwest.',
  },
  {
    icon: 'Wallet',
    title: 'Fair, Flat Pricing',
    description: 'Transparent hourly, daily, weekly, and monthly rates. No hidden fees, ever.',
  },
  {
    icon: 'Sparkles',
    title: 'Clean & Well-Maintained',
    description: 'Our trailers are inspected before every rental — clean, safe, and road-ready.',
  },
  {
    icon: 'PhoneCall',
    title: 'Real Human Support',
    description: 'Talk to Jason directly. Fast responses, honest advice, and hands-on help hooking up.',
  },
];

export const steps = [
  {
    n: '01',
    title: 'Pick Your Trailer',
    description: 'Browse our fleet and find the right trailer for your job — car hauler, cargo, utility, or tilt deck.',
  },
  {
    n: '02',
    title: 'Reserve Online',
    description: 'Choose your dates, pay a $50 booking fee, and lock in your rental in under 2 minutes.',
  },
  {
    n: '03',
    title: 'Pick Up in Vancouver',
    description: 'Come by our Vancouver, WA lot. We\'ll help hook up, walk you through everything, and get you rolling.',
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
    text: 'Jason was fantastic. Helped me hook up my car hauler and made sure everything was safe before I hit the road. Trailer was clean, winch worked perfectly, and pricing was the best I found in Vancouver. Highly recommend.',
  },
  {
    name: 'Danielle K.',
    initials: 'DK',
    rating: 5,
    date: '1 month ago',
    text: 'Rented the 20ft enclosed trailer for a cross-town move. Came with dollies and moving blankets — huge time saver. Booking was easy, pickup was smooth, and the price beat U-Haul by a mile.',
  },
  {
    name: 'Ryan P.',
    initials: 'RP',
    rating: 5,
    date: '3 weeks ago',
    text: 'Needed a tilt deck trailer last minute for a project truck. Called at 8am, had it by 10am. Trailer was in top shape and Jason clearly cares about his gear. Will absolutely rent again.',
  },
  {
    name: 'Aisha M.',
    initials: 'AM',
    rating: 5,
    date: '2 months ago',
    text: 'Used the 16ft utility trailer to haul yard debris and a couple of ATVs. Simple, sturdy, and fairly priced. Loved that they offer hourly rentals — perfect for a half-day project.',
  },
  {
    name: 'Ben W.',
    initials: 'BW',
    rating: 5,
    date: '1 week ago',
    text: 'Best trailer rental experience I\'ve had. Local business, real communication, fair prices. The 2-car hauler was a beast — moved two classic cars without a hitch.',
  },
  {
    name: 'Carla R.',
    initials: 'CR',
    rating: 5,
    date: '5 weeks ago',
    text: 'Straightforward, professional, and reasonably priced. Jason answered every question I had, no pressure sales. Trailer performed exactly as promised for our landscaping haul.',
  },
];

export const faqs = [
  {
    q: 'How do I reserve a trailer?',
    a: 'You can reserve online through our booking form or call/text Jason directly at (360) 500-2004. A $50 booking fee holds your rental and is applied to your total at pickup.',
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
    a: 'Yes, we hold a refundable deposit on your credit card. It\'s returned in full when the trailer is returned undamaged with all equipment (straps, winch, chains).',
  },
  {
    q: 'What areas do you serve?',
    a: 'We\'re based in Vancouver, WA and serve the greater Pacific Northwest, including Portland, Longview, Battle Ground, Camas, and surrounding areas. Pickup is at our Vancouver location.',
  },
  {
    q: 'What happens if the trailer gets damaged?',
    a: 'Minor wear is expected. Any new damages or missing equipment will be deducted from the deposit at fair-market repair cost. We\'ll always walk through it together at return.',
  },
  {
    q: 'Can I extend my rental?',
    a: 'Absolutely — just call or text before your return time. As long as the trailer isn\'t booked, we\'re happy to extend. Additional time is billed at standard rates.',
  },
];

export const stats = [
  { value: '500+', label: 'Happy Renters' },
  { value: '9', label: 'Trailer Types' },
  { value: '5.0', label: 'Google Rating' },
  { value: '7 Days', label: 'Open Every Week' },
];
