export const siteConfig = {
  name: "All Nippon Virtual Group",
  shortName: "ANVG",
  tagline: "Fly Beyond Borders",
  logoUrl:
    "https://res.cloudinary.com/dsfwafyc2/image/upload/v1792817398/file_0000000014488211bfa6f947add0e395_npjxai.png",
  home: {
    heroImageUrl: "https://res.cloudinary.com/dsfwafyc2/image/upload/v1779014897/Screenshot_20260509_221234_com.fds.infiniteflight_ewqhzv.jpg",
    heroAltText: "ANVG virtual aviation aircraft in flight",
    mission: "To turn every flight into a journey worth remembering. ANVG brings together aviators to explore, connect, and experience virtual flight operations through the spirit of Japan. We fly with purpose, grow as a community, and leave a mark on every route we take.",
    ceoMessage: "Welcome to ANVG. We’re here to make every flight meaningful, every destination memorable, and every pilot part of something greater. Let’s fly together and build something we can be proud of.",
    ceoName: "Luciano",
    ceoRole: "CEO - All Nippon Virtual Group",
  },
  footer: {
    waypointsUrl:
      "https://waypoint-live.app/va/all-nippon-virtual-airways/apply",
    instagramUrl: "",
    youtubeUrl:
      "https://youtube.com/@anavirtualgroup?si=-nIMOqYuDvfR663Y",
    vkUrl: "",
    disclaimer:
      "All Nippon Virtual Group is not affiliated with the real-world All Nippon Airways or ANA Holdings. All trademarks and logos remain the property of their respective owners.",
    regionalCredit: "Proudly Indian & Kannadiga",
  },
  menuCredit: {
    poweredBy: "POWERED BY METUPOLO™",
    developer: "Anaya",
    buttonLabel: "Waypoints VA",
    // Intentionally blank until an administrator supplies the developer profile URL.
    buttonUrl: "",
  },
};

export type PublicPage = {
  label: string;
  href: string;
  description?: string;
};

export type NavigationGroup = {
  label: string;
  href?: string;
  children?: PublicPage[];
};

export const navigation: NavigationGroup[] = [
  { label: "Home", href: "/" },
  {
    label: "About Us",
    children: [
      { label: "About Us", href: "/about" },
      { label: "Staff", href: "/staff" },
    ],
  },
  {
    label: "Operations",
    children: [
      { label: "Pilots", href: "/pilots" },
      { label: "Events", href: "/events" },
      { label: "Fleet", href: "/fleet" },
      { label: "Routes", href: "/routes" },
      { label: "Codeshare", href: "/codeshare" },
      { label: "Ranks", href: "/ranks" },
    ],
  },
  { label: "Training", href: "/training" },
  {
    label: "Change Log",
    children: [
      { label: "Change Log", href: "/changelog" },
      { label: "Settings", href: "/settings" },
    ],
  },
  { label: "Apply", href: "/apply" },
];

export const pageCopy: Record<string, { title: string; description: string }> = {
  "/about": {
    title: "Discover ANVG",
    description:
      "The Spirit of Japanese Aviation • Official Community Airline on Waypoints",
  },
  "/staff": {
    title: "Leadership Team",
    description:
      "The dedicated team orchestrating operations, flight standards, and community life across All Nippon Virtual Group.",
  },
  "/pilots": {
    title: "Our Pilots",
    description:
      "Meet the pilots who make All Nippon Virtual Group what it is. Every pilot contributes to our growing community and shared passion for flight.",
  },
  "/events": {
    title: "Network Activity",
    description:
      "Join our pilots in skies around the world. Discover upcoming group flights, fly-ins, and the latest announcements from All Nippon Virtual Group.",
  },
  "/fleet": {
    title: "The Wings of ANVG",
    description:
      "Spanning full-service passenger travel, dedicated transpacific freight, and regional low-cost routes. Discover the aircraft you will command as an ANVG pilot.",
  },
  "/routes": {
    title: "Global Network",
    description:
      "Explore ANVG’s virtual route database. From our four primary hubs in Japan, our fleet connects the Infinite Flight world across continents and oceans.",
  },
  "/codeshare": {
    title: "Codeshare Alliances",
    description:
      "Expanding our wings through global simulation partnerships. Connect to worldwide destinations through our official codeshare airline network on Waypoints.",
  },
  "/ranks": {
    title: "Pilot Progression",
    description:
      "Your career at All Nippon Virtual Group starts here. Earn your wings, log flight hours via Waypoints, and rise through the ranks to command our largest aircraft.",
  },
  "/training": {
    title: "Pilot Training & Evaluation",
    description:
      "Excellence in aviation starts with preparation. Our structured training pipeline ensures every ANVG pilot commands their aircraft with realism, safety, and community spirit.",
  },
  "/changelog": { title: "Change Log", description: "Recent updates from ANVG." },
  "/settings": {
    title: "Flight Deck Settings",
    description:
      "Customize your virtual flight operations portal. Manage your personal appearance and audio preferences.",
  },
  "/apply": {
    title: "Join Our Flight Deck",
    description:
      "Ready to fly across Japan and beyond? Review our community prerequisites below and take the direct pilot intake test right inside the Waypoints Crew Center.",
  },
};
