// src/data/providers.js

const maleNames = [
  "Md. Rahim Uddin","Karim Hossain","Nur Islam","Abul Kalam","Rafiqul Islam",
  "Shahidul Alam","Mizanur Rahman","Delwar Hossain","Babul Mia","Jamal Uddin",
  "Hasan Ali","Faruk Ahmed","Shahin Alam","Rubel Mia","Liton Das",
  "Sumon Hossain","Rakib Hasan","Jahid Hasan","Arif Hossain","Monir Uddin",
  "Shohag Mia","Polash Dey","Tuhin Ahmed","Nasir Uddin","Manik Hossain",
  "Ripon Mia","Akash Hossain","Sohel Rana","Kawsar Ali","Tarek Hossain"
];

const femaleNames = [
  "Fatema Begum","Rahela Khatun","Nasrin Akter","Rima Begum","Parveen Akter",
  "Morsheda Begum","Salma Khatun","Kohinoor Begum","Minara Begum","Josna Akter",
  "Shefali Devi","Rekha Rani","Beauty Begum","Lovely Akter","Shirin Akter",
  "Nazma Begum","Halima Khatun","Amena Begum","Renu Akter","Champa Begum",
  "Sonia Khatun","Tania Akter","Mitu Begum","Sumona Akter","Ripa Akter",
  "Lata Rani","Khadija Begum","Nipa Akter","Poly Begum","Moni Khatun"
];

const surnames = [
  "Hossain","Rahman","Akter","Khatun","Begum",
  "Chowdhury","Ahmed","Islam","Sultana","Rana",
  "Mia","Hasan","Mahmud","Nahar","Parvin",
  "Anwar","Karim","Khan","Saima","Rokeya"
];

const workTypes = ["Cleaning","Cooking","Caregiving","Babysitting","Gardening","Laundry","Tutoring","Elder Care"];

const dhakaAreas = {
  "Dhaka-1": ["Tejgaon","Kawran Bazar","Panthapath","Moghbazar"],
  "Dhaka-2": ["Mirpur-1","Mirpur-2","Mirpur-10","Pallabi"],
  "Dhaka-3": ["Mohammadpur","Shyamoli","Adabor","Rayer Bazar"],
  "Dhaka-4": ["Dhanmondi","Jigatola","Kalabagan","Hatirpul"],
  "Dhaka-5": ["Gulshan-1","Gulshan-2","Banani","DOHS"],
  "Dhaka-6": ["Uttara-1","Uttara-3","Uttara-7","Uttara-10"],
  "Dhaka-7": ["Badda","Rampura","Khilgaon","Mugda"],
  "Dhaka-8": ["Demra","Kadamtali","Jatrabari","Shyampur"],
  "Dhaka-9": ["Lalbagh","Hazaribagh","Kotwali","Chawkbazar"],
  "Dhaka-10": ["Savar","Ashulia","Hemayetpur","Amirabazar"],
};

const experienceLevels = [
  { label: "Junior", years: "1-2", rate: 200 },
  { label: "Mid", years: "3-4", rate: 350 },
  { label: "Senior", years: "5-7", rate: 500 },
  { label: "Expert", years: "8+", rate: 700 },
];

const serviceSegments = [
  {
    key: "part-time",
    label: "Part-time (1–2 hours/day)",
    description: "Light cleaning and basic household tasks",
    pricing: {
      perHouse: { min: 1500, max: 3500 },
      multipleHouses: { min: 5000, max: 10000 }
    },
    hoursPerDay: 1.5,
    workTypes: ["Cleaning", "Laundry", "Gardening"]
  },
  {
    key: "half-day",
    label: "Half-day (3–5 hours/day)",
    description: "Comprehensive cleaning and cooking assistance",
    pricing: { min: 4000, max: 8000 },
    hoursPerDay: 4,
    workTypes: ["Cleaning", "Cooking", "Laundry", "Babysitting"]
  },
  {
    key: "full-time",
    label: "Full-time (all day/live-in)",
    description: "Complete household management",
    pricing: { min: 8000, max: 15000 },
    hoursPerDay: 12,
    workTypes: ["Cleaning", "Cooking", "Caregiving", "Babysitting", "Elder Care"]
  },
  {
    key: "full-time-plus",
    label: "Full-time + Cooking + Childcare",
    description: "All housework including cooking and childcare",
    pricing: { min: 12000, max: 18000 },
    hoursPerDay: 12,
    workTypes: ["Cleaning", "Cooking", "Caregiving", "Babysitting", "Elder Care", "Tutoring"]
  }
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateProviders(zone, gender, address) {
  const names = gender === "Male" ? maleNames : femaleNames;
  const zoneIndex = dhakaZones.indexOf(zone);
  const areas = dhakaAreas[zone] || ["Dhaka"];
  const providers = [];

  for (let i = 0; i < 30; i++) {
    const seed = zone.charCodeAt(0) * 1000 + (gender === "Male" ? 0 : 500) + i;
    const rng = seededRandom(seed);

    const expIndex = Math.floor(rng() * experienceLevels.length);
    const exp = experienceLevels[expIndex];
    const rating = (3.5 + rng() * 1.5).toFixed(1);
    const areaIndex = Math.floor(rng() * areas.length);
    const segmentIndex = Math.floor(rng() * serviceSegments.length);
    const segment = serviceSegments[segmentIndex];

    // Calculate monthly rate based on segment
    const rateRange = segment.pricing.perHouse || segment.pricing;
    const monthlyRate = Math.floor(rateRange.min + rng() * (rateRange.max - rateRange.min));

    const workSubset = [...segment.workTypes].sort(() => rng() - 0.5).slice(0, 3);
    const safeZoneIndex = Math.max(0, zoneIndex);
    const firstName = names[(i + safeZoneIndex * 7) % names.length];
    const surname = surnames[(safeZoneIndex + i) % surnames.length];
    const uniqueName = `${firstName.split(" ")[0]} ${surname}`;

    providers.push({
      id: `${zone}-${gender}-${i}`,
      name: uniqueName,
      gender,
      zone,
      address: address || `${areas[areaIndex]}, ${zone.replace("Dhaka-", "Dhaka Sector-")}`,
      experience: exp,
      age: Math.floor(20 + rng() * 30),
      rating: parseFloat(rating),
      ratingCount: Math.floor(rng() * 200) + 20,
      workTypes: workSubset,
      serviceSegment: segment,
      monthlyRate,
      photoSeed: `${gender === "Male" ? "male" : "female"}/${(i % 99) + 1}`,
      photoUrl: `https://randomuser.me/api/portraits/${gender === "Male" ? "men" : "women"}/${(i % 99) + 1}.jpg?nat=bd`,
      workingMonths: Math.floor(rng() * 60) + 6,
      available: true,
    });
  }

  return providers;
}

export const dhakaZones = Object.keys(dhakaAreas);

export const workCategories = workTypes;

export { experienceLevels, serviceSegments };
