import { Project, NewsItem } from "@/types/project";

export const PROJECTS: Project[] = [
  {
    id: "1",
    slug: "suzhou-museum-of-contemporary-art",
    title: "Suzhou Museum of Contemporary Art",
    location: "Suzhou, China",
    year: "2026",
    client:
      "Suzhou Industrial Park Culture, Sports and Tourism Bureau & Suzhou Harmony Development Group",
    typology: "Culture",
    category: "architecture",
    subcategory: "culture",
    sizeM2: "60,000",
    sizeFt2: "646,000",
    status: "Completed",
    aspectRatio: "4400 / 2288",
    heroImage: "https://media.big.dk/2-SUZHOU-MOCA-BY-SUZHOU-MOCA_web.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12H40V24H26V40H12V12Z" fill="white"/><circle cx="33" cy="33" r="7" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "If the historic city center is the cradle of the Chinese garden, the lake district is the cradle of a new Suzhou. The site of the Suzhou Museum of Contemporary Art is sandwiched between the city and the lake. By dissolving the museum into a Chinese garden of interconnected galleries, distributed across the site like pavilions in a park, the museum becomes a connection between the city and the lake, rather than an obstacle.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "Located on Jinji Lake, the 60,000-m2 Suzhou Museum of Contemporary Art offers a modern interpretation of the garden elements that have defined Suzhou's urbanism, architecture, and landscape for centuries. Designed in collaboration with ARTS Group and Front Inc., the complex brings together contemporary art and public lakeside life.",
    awards: ["MIPIM Asia, Best Cultural, Sports and Education Project, Silver, 2025"],
    collaborators: ["ARTS Group", "Front Inc.", "Suzhou Landscape Architecture Design Institute"],
    diagrams: [
      {
        step: "01",
        title: "Site Parameters",
        description: "Sitting along the shore of Jinji Lake, the site occupies a large area of 310 x 200 m.",
        image: "https://media.big.dk/2024/05/19_210100_N120_webproject.jpg?width=800",
      },
      {
        step: "02",
        title: "Pathways",
        description: "The site is defined by a series of paths that lead to the Suzhou Ferris Wheel and the lakeside promenade.",
        image: "https://media.big.dk/2024/05/19_210100_N119_webproject.jpg?width=800",
      },
      {
        step: "03",
        title: "Program",
        description: "The two-story building houses three main functions gathered under one cohesive continuous roof.",
        image: "https://media.big.dk/2024/05/19_210100_N128_webproject.jpg?width=800",
      },
      {
        step: "04",
        title: "Program Split",
        description: "The volume is rotated and separated into three individual buildings occupying the site surrounding the Ferris Wheel.",
        image: "https://media.big.dk/2024/05/19_210100_N127_webproject.jpg?width=800",
      },
      {
        step: "05",
        title: "Life Between Buildings",
        description: "Splitting the functions into smaller pavilions creates garden spaces and plazas in-between the volumes for visitors to meander through.",
        image: "https://media.big.dk/2024/05/19_210100_N126_webproject.jpg?width=800",
      },
      {
        step: "06",
        title: "Covered Pathways",
        description: "Covered pathways connect the pavilions while framing gardens between the pavilion and along the lakeside.",
        image: "https://media.big.dk/2024/05/19_210100_N125_webproject.jpg?width=800",
      },
    ],
    gallery: [
      {
        url: "https://media.big.dk/1-SUZHOU-MOCA-BY-SUZHOU-MOCA_web.jpg?width=1200",
        caption: "Main entrance court looking toward Jinji Lake",
        aspectRatio: "3457 / 2288",
      },
      {
        url: "https://media.big.dk/DJI_0443.jpg?width=1200",
        caption: "Aerial view of ribbon roof curving around the Ferris Wheel",
        aspectRatio: "3052 / 2288",
      },
      {
        url: "https://media.big.dk/240928_SAM-Construction-Rd-2_07.jpg?width=1200",
        caption: "Pavilion glazed facade and outdoor sculpture garden",
        aspectRatio: "3053 / 2288",
      },
      {
        url: "https://media.big.dk/4-SUZHOU-MOCA-BY-SUZHOU-MOCA_web.jpg?width=1200",
        caption: "Gallery interior with natural diffused skylight system",
        aspectRatio: "3432 / 2288",
      },
      {
        url: "https://media.big.dk/5-SUZHOU-MOCA-BY-SUZHOU-MOCA_web.jpg?width=1200",
        caption: "Evening illumination across the lake basin",
        aspectRatio: "3432 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Catherine Huang"],
      },
      {
        role: "Project Leader",
        people: ["Molly D’Arcy", "Kasper Hansen"],
      },
      {
        role: "Team",
        people: [
          "Cheng-Huang Lin",
          "Domenic Schmid",
          "Emil Skibsted",
          "Federico Martinez",
          "Flora Li",
          "Kuang-Yuan Huang",
        ],
      },
    ],
  },
  {
    id: "2",
    slug: "dymak-hq",
    title: "Dymak HQ",
    location: "Odense, Denmark",
    year: "2024",
    client: "Dymak A/S",
    typology: "Work",
    category: "architecture",
    subcategory: "work",
    sizeM2: "5,800",
    sizeFt2: "62,400",
    status: "Completed",
    aspectRatio: "3303 / 2288",
    heroImage: "https://media.big.dk/19_21085_N282_webproject.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="14" height="32" fill="white"/><rect x="28" y="10" width="14" height="14" fill="white"/><rect x="28" y="28" width="14" height="14" fill="white"/></svg>`,
    quote:
      "By elevating the traditional industrial warehouse into a campus of light, timber, and botanical greenery, Dymak HQ demonstrates how modern corporate headquarters can fuse workplace well-being with carbon-conscious design.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "A combined headquarters, showroom, and logistics facility for global floral accessory specialist Dymak. The design organizes office spaces around a continuous central atrium lined with sustainable cross-laminated timber.",
    diagrams: [
      {
        step: "01",
        title: "Perimeter Footprint",
        description: "Optimizing the parcel footprint along Odense's main commercial artery.",
        image: "https://media.big.dk/19_21085_N282_webproject.jpg?width=800",
      },
      {
        step: "02",
        title: "Light Well Courtyard",
        description: "Carving out daylight voids to bring nature deep into office floorplates.",
        image: "https://media.big.dk/19_21085_N282_webproject.jpg?width=800",
      },
    ],
    gallery: [
      {
        url: "https://media.big.dk/19_21085_N282_webproject.jpg?width=1200",
        caption: "Street view showing CLT timber structural frame and curtain wall",
        aspectRatio: "3303 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "David Zahle"],
      },
      {
        role: "Project Leader",
        people: ["Søren Martinussen"],
      },
    ],
  },
  {
    id: "3",
    slug: "stem-university",
    title: "STEM University",
    location: "Bentonville, United States",
    year: "2025",
    client: "Walton Family Foundation",
    typology: "Education",
    category: "architecture",
    subcategory: "education",
    sizeM2: "45,000",
    sizeFt2: "484,000",
    status: "In Progress",
    aspectRatio: "4066 / 2288",
    heroImage: "https://media.big.dk/BIG_STEM_01_Aerial-Rendering_final.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 8L44 26L26 44L8 26L26 8Z" stroke="white" stroke-width="3"/><circle cx="26" cy="26" r="6" fill="white"/></svg>`,
    quote:
      "STEM education thrives when disciplines collide. Rather than isolated academic silos, the university is arranged as a continuous topographical landscape where laboratories, machine shops, and seminar rooms weave together under a green living canopy.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "A state-of-the-art polytechnic campus integrated directly into the Ozark landscape, connecting hands-on engineering workshops with nature corridors.",
    gallery: [
      {
        url: "https://media.big.dk/BIG_STEM_01_Aerial-Rendering_final.jpg?width=1200",
        caption: "Aerial panorama of the integrated timber canopy campus",
        aspectRatio: "4066 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Leon Rost"],
      },
    ],
  },
  {
    id: "4",
    slug: "eve-music-hall",
    title: "EVE Music Hall",
    location: "Čepin, Croatia",
    year: "2025",
    client: "Žito d.o.o.",
    typology: "Culture",
    category: "architecture",
    subcategory: "culture",
    sizeM2: "14,200",
    sizeFt2: "152,800",
    status: "Completed",
    aspectRatio: "4099 / 2288",
    heroImage: "https://media.big.dk/19_24305_N175_webproject.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 38V14L38 26L14 38Z" fill="white"/><line x1="38" y1="14" x2="38" y2="38" stroke="white" stroke-width="3"/></svg>`,
    quote:
      "EVE Music Hall rises from the Slavonian plains like a sculpted wave of acoustic timber, celebrating both classical symphonic resonance and contemporary music festivals.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "A premier cultural destination in eastern Croatia comprising an 1,800-seat acoustic concert hall, an amphitheater, and exhibition spaces.",
    gallery: [
      {
        url: "https://media.big.dk/19_24305_N175_webproject.jpg?width=1200",
        caption: "Twilight view showing the undulating illuminated timber roofline",
        aspectRatio: "4099 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Jakob Lange"],
      },
    ],
  },
  {
    id: "5",
    slug: "lego-brand-house",
    title: "LEGO Brand House",
    location: "Billund, Denmark",
    year: "2017",
    client: "The LEGO Group / KIRKBI",
    typology: "Culture",
    category: "architecture",
    subcategory: "culture",
    sizeM2: "12,000",
    sizeFt2: "129,000",
    status: "Completed",
    aspectRatio: "2288 / 1835",
    heroImage:
      "https://media.big.dk/2022/06/19_12033_N121_webproject-e1669041489225.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="12" width="28" height="28" stroke="white" stroke-width="3"/><circle cx="20" cy="20" r="3.5" fill="white"/><circle cx="32" cy="20" r="3.5" fill="white"/><circle cx="20" cy="32" r="3.5" fill="white"/><circle cx="32" cy="32" r="3.5" fill="white"/></svg>`,
    quote:
      "LEGO House is a manifestation of the very essence of LEGO play and values. The building is conceived as a village of 21 interlocking brick volumes stacked on top of each other, crowned by the Keystone brick.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "Located in Billund where the iconic LEGO brick was born, LEGO House is an experiential museum and community center with open public terraces and interactive play zones.",
    awards: ["Civic Trust Award 2019", "Mies van der Rohe Award Nominee"],
    gallery: [
      {
        url: "https://media.big.dk/2022/06/19_12033_N121_webproject-e1669041489225.jpg?width=1200",
        caption: "Stacked LEGO brick terraces and public rooftop stairs",
        aspectRatio: "2288 / 1835",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Finn Nørkjær"],
      },
      {
        role: "Project Leader",
        people: ["Brian Yang"],
      },
    ],
  },
  {
    id: "6",
    slug: "national-juneteenth-museum",
    title: "National Juneteenth Museum",
    location: "Fort Worth, United States",
    year: "2026",
    client: "National Juneteenth Museum Inc.",
    typology: "Culture",
    category: "architecture",
    subcategory: "culture",
    sizeM2: "4,645",
    sizeFt2: "50,000",
    status: "In Progress",
    aspectRatio: "2288 / 2288",
    heroImage: "https://media.big.dk/AERIAL_credit-BIG-and-Plomp.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26 10L31 21L42 22L34 30L36 41L26 35L16 41L18 30L10 22L21 21L26 10Z" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "The National Juneteenth Museum honors the cradle of freedom in Fort Worth's Historic Southside. Centered around a vibrant community star courtyard, the gabled roof scape echoes historic vernacular forms while creating an inclusive beacon for education.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "A tribute to freedom and community in Fort Worth, TX, dedicated to preserving the legacy of Juneteenth through interactive galleries, an incubator, a theater, and public park.",
    gallery: [
      {
        url: "https://media.big.dk/AERIAL_credit-BIG-and-Plomp.jpg?width=1200",
        caption: "Aerial render of star-shaped courtyard and timber gables",
        aspectRatio: "2288 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Daniel Sundlin"],
      },
    ],
  },
  {
    id: "7",
    slug: "noma-2-0",
    title: "Noma 2.0",
    location: "Copenhagen, Denmark",
    year: "2018",
    client: "Noma / René Redzepi",
    typology: "Hospitality",
    category: "architecture",
    subcategory: "hospitality",
    sizeM2: "1,290",
    sizeFt2: "13,900",
    status: "Completed",
    aspectRatio: "1830 / 1635",
    heroImage:
      "https://media.big.dk/2022/06/19_15019_N76_webproject-e1739246826623.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="12" y="14" width="28" height="24" stroke="white" stroke-width="2"/><line x1="12" y1="26" x2="40" y2="26" stroke="white" stroke-width="2"/><line x1="26" y1="14" x2="26" y2="38" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "Rather than a single restaurant building, Noma is organized as an intimate culinary village. Eleven interconnected pavilions each house a specialized culinary craft, framing views of the Christiania lake.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "Designed in close collaboration with chef René Redzepi, Noma 2.0 reimagines the restaurant as a Nordic village where kitchen, fermentation lab, bakery, and dining room exist in continuous dialogue with nature.",
    gallery: [
      {
        url: "https://media.big.dk/2022/06/19_15019_N76_webproject-e1739246826623.jpg?width=1200",
        caption: "Culinary pavilions along the moat of Copenhagen's historic fortifications",
        aspectRatio: "1830 / 1635",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Finn Nørkjær"],
      },
    ],
  },
  {
    id: "8",
    slug: "the-plus",
    title: "The Plus",
    location: "Magnor, Norway",
    year: "2022",
    client: "Vestre AS",
    typology: "Work",
    category: "architecture",
    subcategory: "work",
    sizeM2: "7,000",
    sizeFt2: "75,000",
    status: "Completed",
    aspectRatio: "2924 / 2288",
    heroImage: "https://media.big.dk/2022/09/19_19034_N220_webproject.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 10H30V22H42V30H30V42H22V30H10V22H22V10Z" fill="white"/></svg>`,
    quote:
      "The Plus is the world's most environmentally friendly furniture factory. Shaped as a radial plus sign in the heart of the pine forest, each wing represents a production stage, united by a public central courtyard and green accessible roof.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "Designed for sustainable urban furniture manufacturer Vestre, The Plus is a hybrid factory and 300-acre public park that achieves BREEAM Outstanding environmental certification.",
    gallery: [
      {
        url: "https://media.big.dk/2022/09/19_19034_N220_webproject.jpg?width=1200",
        caption: "Aerial view of radial four-wing layout nestled in Norwegian forest",
        aspectRatio: "2924 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "David Zahle"],
      },
      {
        role: "Project Leader",
        people: ["Viktoria Millentrup"],
      },
    ],
  },
  {
    id: "9",
    slug: "not-a-hotel-setouchi",
    title: "NOT A HOTEL Setouchi",
    location: "Sagishima, Japan",
    year: "2025",
    client: "NOT A HOTEL Inc.",
    typology: "Hospitality",
    category: "architecture",
    subcategory: "hospitality",
    sizeM2: "3,200",
    sizeFt2: "34,400",
    status: "In Progress",
    aspectRatio: "2500 / 1875",
    heroImage: "https://media.big.dk/setouchi-3villas.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="26" cy="26" r="16" stroke="white" stroke-width="3"/><path d="M18 26C18 21.5817 21.5817 18 26 18C30.4183 18 34 21.5817 34 26" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "Set against the calm waters of the Seto Inland Sea, the 3 vacation villas integrate traditional Japanese roofing with continuous undulating glass volumes that wrap around private infinity courtyards.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "A trio of luxury villas on the untouched island of Sagishima in Hiroshima Prefecture, framing dramatic panoramic views of the Seto Inland Sea.",
    gallery: [
      {
        url: "https://media.big.dk/setouchi-3villas.jpg?width=1200",
        caption: "Three circular pavilions overlooking the Seto Inland Sea",
        aspectRatio: "2500 / 1875",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Leon Rost"],
      },
    ],
  },
  {
    id: "10",
    slug: "gastronomy-open-ecosystem",
    title: "Gastronomy Open Ecosystem",
    location: "San Sebastian, Spain",
    year: "2025",
    client: "Basque Culinary Center",
    typology: "Education",
    category: "architecture",
    subcategory: "education",
    sizeM2: "9,000",
    sizeFt2: "96,800",
    status: "Completed",
    aspectRatio: "3203 / 2288",
    heroImage: "https://media.big.dk/22302_N170_webproject-2.jpg?width=1200",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 36C12 24 24 12 36 12C36 24 24 36 12 36Z" fill="white"/></svg>`,
    quote:
      "GOE brings gastronomy research, culinary innovation, and civic life together under a sculptured stepped landscape that invites citizens to walk onto the green roof straight from the park.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "An open culinary research center in San Sebastian, connecting the Basque Culinary Center with startups, universities, and food researchers worldwide.",
    gallery: [
      {
        url: "https://media.big.dk/22302_N170_webproject-2.jpg?width=1200",
        caption: "Stepped green terrace building overlooking San Sebastian",
        aspectRatio: "3203 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "João Albuquerque"],
      },
    ],
  },
  {
    id: "11",
    slug: "copenhill-amager-bakke",
    title: "CopenHill / Amager Bakke",
    location: "Copenhagen, Denmark",
    year: "2019",
    client: "Amager Ressourcecenter (ARC)",
    typology: "Infrastructure",
    category: "architecture",
    subcategory: "infrastructure",
    sizeM2: "41,000",
    sizeFt2: "441,000",
    status: "Completed",
    aspectRatio: "3400 / 2288",
    heroImage:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 40L42 12V40H10Z" fill="white"/></svg>`,
    quote:
      "CopenHill is the epitome of Hedonistic Sustainability — showing that a sustainable city is not just better for the environment, it is also much more fun and exciting for its citizens. A waste-to-energy plant topped with a ski slope, hiking trail, and the world's tallest climbing wall.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "CopenHill transforms a waste-to-energy power plant into an urban recreation destination with a year-round ski slope, rooftop park, and climbing wall, generating clean electricity and district heating for 150,000 Danish homes.",
    awards: ["World Building of the Year 2021", "Architizer A+ Award"],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80",
        caption: "The ski slope descending from the apex of CopenHill",
        aspectRatio: "3400 / 2288",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "David Zahle"],
      },
    ],
  },
  {
    id: "12",
    slug: "the-spiral",
    title: "The Spiral",
    location: "New York, United States",
    year: "2023",
    client: "Tishman Speyer",
    typology: "Work",
    category: "architecture",
    subcategory: "work",
    sizeM2: "260,000",
    sizeFt2: "2,800,000",
    status: "Completed",
    aspectRatio: "2500 / 3200",
    heroImage:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    iconSvg: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="8" width="24" height="36" stroke="white" stroke-width="2"/><path d="M14 36L38 20M14 24L38 8" stroke="white" stroke-width="2"/></svg>`,
    quote:
      "The Spiral extends the green landscape of the High Line directly up the 66-story skyscraper, giving every floor access to outdoor lush gardens and panoramic views of Manhattan.",
    quoteAuthor: "Bjarke Ingels",
    quoteAuthorRole: "Founder & Creative Director, BIG",
    description:
      "A 1,005-foot commercial skyscraper on West 34th Street overlooking the Hudson River, characterized by cascading stepped landscaped terraces spiraling around the facade.",
    awards: ["Council on Tall Buildings and Urban Habitat (CTBUH) Award of Excellence 2024"],
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
        caption: "The Spiral standing over Hudson Yards and the High Line",
        aspectRatio: "2500 / 3200",
      },
    ],
    credits: [
      {
        role: "Partners-in-Charge",
        people: ["Bjarke Ingels", "Daniel Sundlin"],
      },
    ],
  },
];

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "n1",
    slug: "suzhou-museum-opens-to-public",
    title: "Suzhou Museum of Contemporary Art Celebrates Grand Inauguration",
    date: "MARCH 2026",
    category: "Architecture",
    excerpt:
      "The ribbon-like cultural park situated on Jinji Lake welcomes its first visitors with landmark exhibitions and public lakeside gardens.",
    image: "https://media.big.dk/2-SUZHOU-MOCA-BY-SUZHOU-MOCA_web.jpg?width=800",
    readTime: "4 min read",
  },
  {
    id: "n2",
    slug: "big-unveils-new-timber-campus",
    title: "Groundbreaking of STEM University in Bentonville",
    date: "FEBRUARY 2026",
    category: "Education",
    excerpt:
      "Construction commences on the radical cross-laminated timber university uniting engineering research and landscape ecology.",
    image: "https://media.big.dk/BIG_STEM_01_Aerial-Rendering_final.jpg?width=800",
    readTime: "3 min read",
  },
  {
    id: "n3",
    slug: "not-a-hotel-setouchi-construction",
    title: "NOT A HOTEL Setouchi Reaches Final Structural Phase",
    date: "JANUARY 2026",
    category: "Hospitality",
    excerpt:
      "The trio of panoramic pavilions on Sagishima Island blend ancient Japanese roof craft with contemporary glass geometry.",
    image: "https://media.big.dk/setouchi-3villas.jpg?width=800",
    readTime: "5 min read",
  },
  {
    id: "n4",
    slug: "the-plus-breeam-outstanding",
    title: "The Plus Receives Highest Environmental Rating in Scandinavia",
    date: "DECEMBER 2025",
    category: "Sustainability",
    excerpt:
      "Vestre's factory in the Norwegian pine forest sets global benchmark for carbon-neutral industrial architecture.",
    image: "https://media.big.dk/2022/09/19_19034_N220_webproject.jpg?width=800",
    readTime: "6 min read",
  },
];

export const CATEGORIES_CONFIG = [
  {
    id: "architecture",
    label: "Architecture",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects" },
      { id: "culture", label: "Culture", slug: "/projects?type=culture" },
      { id: "education", label: "Education", slug: "/projects?type=education" },
      { id: "work", label: "Work", slug: "/projects?type=work" },
      { id: "hospitality", label: "Hospitality", slug: "/projects?type=hospitality" },
      { id: "residential", label: "Residential", slug: "/projects?type=residential" },
      { id: "infrastructure", label: "Infrastructure", slug: "/projects?type=infrastructure" },
      { id: "space", label: "Space", slug: "/projects?type=space" },
      { id: "sports", label: "Sports", slug: "/projects?type=sports" },
      { id: "health", label: "Health", slug: "/projects?type=health" },
    ],
  },
  {
    id: "interiors",
    label: "Interiors",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=interiors" },
      { id: "workplace", label: "Workplace", slug: "/projects?cat=interiors&type=workplace" },
      { id: "hospitality", label: "Hospitality", slug: "/projects?cat=interiors&type=hospitality" },
      { id: "exhibition", label: "Exhibition", slug: "/projects?cat=interiors&type=exhibition" },
    ],
  },
  {
    id: "landscape",
    label: "Landscape",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=landscape" },
      { id: "civic-spaces", label: "Civic Spaces", slug: "/projects?cat=landscape&type=civic-spaces" },
      { id: "parks", label: "Parks", slug: "/projects?cat=landscape&type=parks" },
      { id: "gardens", label: "Gardens", slug: "/projects?cat=landscape&type=gardens" },
      { id: "balconies", label: "Balconies & Terraces", slug: "/projects?cat=landscape&type=balconies" },
    ],
  },
  {
    id: "planning",
    label: "Planning",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=planning" },
      { id: "campus", label: "Campus", slug: "/projects?cat=planning&type=campus" },
      { id: "city", label: "City", slug: "/projects?cat=planning&type=city" },
      { id: "region", label: "Region", slug: "/projects?cat=planning&type=region" },
    ],
  },
  {
    id: "products",
    label: "Products",
    subcategories: [
      { id: "all", label: "View all", slug: "/projects?cat=products" },
      { id: "lighting", label: "Lighting", slug: "/projects?cat=products&type=lighting" },
      { id: "furniture", label: "Furniture", slug: "/projects?cat=products&type=furniture" },
      { id: "consumer", label: "Consumer Products", slug: "/projects?cat=products&type=consumer" },
      { id: "mobility", label: "Mobility", slug: "/projects?cat=products&type=mobility" },
      { id: "installations", label: "Installations", slug: "/projects?cat=products&type=installations" },
    ],
  },
];
