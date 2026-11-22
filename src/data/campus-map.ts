export type LocationCategory =
  | 'administration'
  | 'student-services'
  | 'academic'
  | 'library'
  | 'food-housing'
  | 'sports-events';

export const LOCATION_CATEGORY_LABELS: Record<LocationCategory, string> = {
  administration: 'Admin & Records',
  'student-services': 'Student Services',
  academic: 'Colleges & Labs',
  library: 'Libraries',
  'food-housing': 'Food & Housing',
  'sports-events': 'Sports & Events',
};

export interface CampusLocation {
  id: string;
  name: string;
  floor?: string;
  category: LocationCategory;
  keywords?: string[];
  notes?: string;
  articleSlug?: string;
}

export interface CampusBuilding {
  id: string;
  name: string;
  shortLabel: string;
  floors?: number | null;
  svgPath: string;
  center: { x: number; y: number };
  summary: string;
  locations: CampusLocation[];
}

export interface CampusPark {
  name: string;
  svgPath: string;
  center: { x: number; y: number };
}

export interface CampusGate {
  name: string;
  x: number;
  y: number;
}

export const SHOW_CAMPUS_2 = false;
export const CAMPUS_MAP_VIEWBOX = SHOW_CAMPUS_2 ? "-120 -520 1240 1380" : "0 0 1000 850";
export const CAMPUS_PERIMETER_PATH = "M175.1,411.1 L269.0,324.3 L368.0,235.0 L525.2,408.3 L704.6,257.8 L545.3,79.2 L575.1,50.0 L612.5,84.5 L618.5,93.2 L779.9,280.6 L785.9,286.6 L940.9,456.3 L904.2,486.9 L872.6,454.4 L804.5,509.0 L704.9,593.4 L680.1,559.5 L643.0,573.5 L555.7,628.5 L489.8,670.9 L440.6,702.1 L423.7,720.2 L397.3,744.3 L344.6,795.1 L330.3,800.0 L272.1,733.1 L160.9,612.5 L91.6,669.3 L70.1,637.8 L119.9,601.3 L127.0,595.0 L59.1,515.2 L175.1,411.1 Z";
export const CAMPUS_PATHS: readonly string[] = [
  "M-43.7,551.1 L-18.0,582.0 L58.0,673.6 L196.0,832.0",
  "M58.0,673.6 L80.9,653.6",
  "M80.9,653.6 L145.4,603.8 L207.8,547.6",
  "M207.8,547.6 L271.0,490.7 L363.9,407.1 L371.3,400.4 L313.7,336.5",
  "M207.8,547.6 L318.2,670.2 L381.4,613.4 L271.0,490.7",
  "M268.0,614.5 L292.8,592.2",
  "M307.2,579.2 L331.2,557.6",
  "M239.8,518.8 L291.3,576.1",
  "M308.7,595.4 L350.2,641.5",
  "M313.0,585.7 L312.0,590.7 L309.2,594.9 L305.0,597.7 L300.0,598.7 L295.0,597.7 L290.8,594.9 L288.0,590.7 L287.0,585.7 L288.0,580.7 L290.8,576.5 L295.0,573.7 L300.0,572.7 L305.0,573.7 L309.2,576.5 L312.0,580.7 L313.0,585.7",
  "M381.4,613.4 L474.3,529.7",
  "M381.4,613.4 L447.6,686.9",
  "M425.5,662.4 L326.7,751.4",
  "M363.9,407.1 L388.6,434.6 L441.5,493.3 L503.0,561.7 L545.9,609.2",
  "M545.9,609.2 L555.7,628.5",
  "M388.6,434.6 L473.3,358.3 L526.2,417.0",
  "M441.5,493.3 L533.6,410.3 L595.2,478.7 L617.9,504.0 L794.1,345.4",
  "M503.0,561.7 L595.2,478.7",
  "M560.2,64.6 L588.0,116.5 L794.1,345.4 L890.4,452.4 L922.6,471.6",
  "M-43.7,551.1 L111.4,403.3 L340.5,185.0 L522.4,21.5 L634.0,-85.4 L646.6,-97.4 L686.3,-135.3 L818.3,-259.9 L838.8,-276.8 L861.9,-293.2 L899.4,-316.9",
  "M522.4,21.5 L541.2,45.8 L560.2,64.6"
];
export const CAMPUS_2_PATHS: readonly string[] = [
  "M538.5,-169.4 L552.6,-157.0 L593.9,-120.5 L634.0,-85.4",
  "M453.2,-67.3 L538.5,-169.4",
  "M646.6,-97.4 L604.5,-132.9 L577.0,-156.1 L496.2,-224.2",
  "M320.9,-334.5 L330.2,-346.3 L338.7,-357.1 L497.3,-559.1",
  "M577.0,-156.1 L655.7,-255.9",
  "M433.1,-271.5 L476.8,-326.7 L522.4,-382.5 L533.9,-396.6 L592.2,-346.5 L582.5,-334.2 L537.9,-277.4 L496.2,-224.2 L487.3,-212.8",
  "M476.8,-326.7 L462.1,-343.5 L457.8,-354.0 L456.8,-365.3 L459.1,-376.3 L464.7,-385.8 L472.9,-393.0 L482.9,-397.1 L493.8,-397.7 L504.5,-394.9 L522.4,-382.5",
  "M582.5,-334.2 L601.5,-308.8 L603.8,-297.7 L602.7,-286.5 L598.3,-276.3 L591.0,-268.2 L581.5,-262.9 L570.8,-260.9 L559.9,-262.4 L549.9,-267.4 L537.9,-277.4",
  "M496.2,-224.2 L476.1,-231.3 L487.3,-212.8",
  "M476.1,-231.3 L433.1,-271.5 L338.7,-357.1",
  "M487.3,-212.8 L538.5,-169.4"
];
export const CAMPUS_PARKS: readonly CampusPark[] = [
  {
    "name": "Heroes Park",
    "svgPath": "M470.3,483.5 L535.7,424.6 L582.6,476.6 L517.2,535.5 Z",
    "center": {
      "x": 526.4,
      "y": 480.1
    }
  },
  {
    "name": "Rizal Park",
    "svgPath": "M228.5,558.6 L280.5,511.8 L371.5,612.8 L319.5,659.7 Z",
    "center": {
      "x": 300.0,
      "y": 585.7
    }
  }
];
export const CAMPUS_GATES: readonly CampusGate[] = [
  {
    "name": "Gate 4",
    "x": 560.2,
    "y": 64.6
  },
  {
    "name": "Gate 3",
    "x": 922.6,
    "y": 471.6
  },
  {
    "name": "Gate 2",
    "x": 555.7,
    "y": 628.5
  },
  {
    "name": "Gate 1",
    "x": 80.9,
    "y": 653.6
  },
  ...(SHOW_CAMPUS_2
    ? [
        {
          "name": "Campus 2 Entrance",
          "x": 552.6,
          "y": -157.0
        }
      ]
    : [])
];
export const CAMPUS_2_BUILDINGS: readonly CampusBuilding[] = [
  {
    "id": "campus2-building-1",
    "name": "Building 1",
    "shortLabel": "Building 1",
    "floors": null,
    "svgPath": "M380.4,-263.2 L405.8,-242.2 L390.0,-221.4 L456.7,-166.5 L470.5,-184.7 L493.5,-165.8 L461.5,-123.7 L346.5,-218.6 Z",
    "center": {
      "x": 425.6,
      "y": -198.3
    },
    "summary": "BulSU Campus 2 building (name to be confirmed).",
    "locations": []
  },
  {
    "id": "campus2-building-2",
    "name": "Building 2",
    "shortLabel": "Building 2",
    "floors": null,
    "svgPath": "M384.0,-356.4 L424.9,-319.7 L443.5,-343.0 L425.0,-360.6 L434.9,-374.8 L442.4,-368.2 L469.8,-401.4 L461.6,-407.1 L477.8,-425.3 L494.3,-411.0 L513.8,-435.1 L472.0,-469.8 Z",
    "center": {
      "x": 453.7,
      "y": -389.4
    },
    "summary": "BulSU Campus 2 building (name to be confirmed).",
    "locations": []
  },
  {
    "id": "campus2-building-3",
    "name": "Building 3",
    "shortLabel": "Building 3",
    "floors": null,
    "svgPath": "M559.7,-250.0 L578.3,-234.5 L587.8,-247.0 L580.1,-253.4 L605.9,-287.1 L616.5,-278.3 L632.5,-299.2 L613.2,-315.3 L630.4,-337.8 L672.7,-302.7 L583.2,-185.5 L538.7,-222.4 Z",
    "center": {
      "x": 599.9,
      "y": -267.8
    },
    "summary": "BulSU Campus 2 building (name to be confirmed).",
    "locations": []
  }
];
export const CAMPUS_BUILDINGS: readonly CampusBuilding[] = [
  ...(SHOW_CAMPUS_2 ? CAMPUS_2_BUILDINGS : []),
  {
    "id": "federizo-hall",
    "name": "Federizo Hall",
    "shortLabel": "Federizo Hall",
    "floors": 3,
    "svgPath": "M543.7,406.6 L701.3,264.8 L774.9,346.5 L754.1,365.2 L699.2,304.3 L583.3,408.7 L627.4,457.7 L606.6,476.5 Z",
    "center": {
      "x": 631.9,
      "y": 346.1
    },
    "summary": "Historic three-storey academic building near Bulacan Heroes Park housing CAL, CS, and CAFA.",
    "locations": [
      {
        "id": "cal",
        "name": "College of Arts & Letters (CAL)",
        "category": "academic",
        "keywords": [
          "CAL",
          "Arts",
          "Letters",
          "Federizo Hall"
        ]
      },
      {
        "id": "cs",
        "name": "College of Science (CS)",
        "category": "academic",
        "keywords": [
          "CS",
          "Science",
          "Federizo Hall"
        ]
      },
      {
        "id": "cafa",
        "name": "College of Architecture and Fine Arts (CAFA)",
        "category": "academic",
        "keywords": [
          "CAFA",
          "Architecture",
          "Fine Arts",
          "Federizo Hall"
        ]
      },
      {
        "id": "cafa-dean",
        "name": "CAFA Dean's Office",
        "category": "administration",
        "keywords": [
          "CAFA",
          "Dean",
          "Architecture",
          "Fine Arts",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-mt-lab-a",
        "name": "MT Lab A",
        "category": "academic",
        "keywords": [
          "MT Lab A",
          "Medical Technology",
          "Lab",
          "CS",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-mt-lab-b",
        "name": "MT Lab B",
        "category": "academic",
        "keywords": [
          "MT Lab B",
          "Medical Technology",
          "Lab",
          "CS",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-comp-lab",
        "name": "FH Comp Lab",
        "category": "academic",
        "keywords": [
          "FH Comp Lab",
          "Computer Lab",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-speech-lab",
        "name": "Speech Laboratory",
        "category": "academic",
        "keywords": [
          "Speech Lab",
          "Speech Library",
          "CAL",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-avr-a",
        "name": "AVR A",
        "category": "academic",
        "keywords": [
          "AVR A",
          "Audio Visual Room",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-avr-b",
        "name": "AVR B",
        "category": "academic",
        "keywords": [
          "AVR B",
          "Audio Visual Room",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-avr",
        "name": "FH AVR",
        "category": "academic",
        "keywords": [
          "FH AVR",
          "Audio Visual Room",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-cal-library-a",
        "name": "CAL Library A",
        "category": "library",
        "keywords": [
          "CAL Library A",
          "Library",
          "CAL",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-cal-library-b",
        "name": "CAL Library B",
        "category": "library",
        "keywords": [
          "CAL Library B",
          "Library",
          "CAL",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-cal-theater-a",
        "name": "CAL Theater A",
        "category": "sports-events",
        "keywords": [
          "CAL Theater A",
          "Theater",
          "CAL",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-theater-b",
        "name": "Theater B",
        "category": "sports-events",
        "keywords": [
          "Theater B",
          "Theater",
          "CAL",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-cal-theater-c",
        "name": "CAL Theater C",
        "category": "sports-events",
        "keywords": [
          "CAL Theater C",
          "Theater",
          "CAL",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-studio-room",
        "name": "Studio Room",
        "category": "academic",
        "keywords": [
          "Studio Room",
          "CAL",
          "DCPA",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-multimedia-room",
        "name": "Multimedia Room",
        "category": "academic",
        "keywords": [
          "Multimedia Room",
          "CAL",
          "DCPA",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-r-and-e",
        "name": "R & E",
        "category": "administration",
        "keywords": [
          "R & E",
          "Research and Extension",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-accre",
        "name": "FH ACCRE",
        "category": "administration",
        "keywords": [
          "FH ACCRE",
          "Accreditation",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-tl",
        "name": "FH TL",
        "category": "academic",
        "keywords": [
          "FH TL",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-106",
        "name": "FH 106",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "FH106",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-107",
        "name": "FH 107",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "FH107",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-108",
        "name": "FH 108",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "FH108",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-110",
        "name": "FH 110",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "FH110",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-113",
        "name": "FH 113",
        "category": "academic",
        "keywords": [
          "FH113",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-201a",
        "name": "FH 201 A",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH201A",
          "FH 201A",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-201b",
        "name": "FH 201 B",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH201B",
          "FH 201B",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-205",
        "name": "FH 205",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH205",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-206",
        "name": "FH 206",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH206",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-207",
        "name": "FH 207",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH207",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-208",
        "name": "FH 208",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH208",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-209",
        "name": "FH 209",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH209",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-210",
        "name": "FH 210",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "FH210",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-n202",
        "name": "N202",
        "category": "academic",
        "keywords": [
          "N202",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-301a",
        "name": "FH 301A",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH301A",
          "FH 301 A",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-302",
        "name": "FH 302",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH302",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-303",
        "name": "FH 303",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH303",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-304",
        "name": "FH 304",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH304",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-305",
        "name": "FH 305",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH305",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-306",
        "name": "FH 306",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH306",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-307",
        "name": "FH 307",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH307",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-308",
        "name": "FH 308",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH308",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-309",
        "name": "FH 309",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH309",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-311a",
        "name": "FH 311 A",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH311A",
          "FH 311A",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-311b",
        "name": "FH 311 B",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH311B",
          "FH 311B",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-314",
        "name": "FH 314",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH314",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-315",
        "name": "FH 315",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH315",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-316",
        "name": "FH 316",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH316",
          "Classroom",
          "Federizo Hall"
        ]
      },
      {
        "id": "fh-317",
        "name": "FH 317",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "FH317",
          "Classroom",
          "Federizo Hall"
        ]
      }
    ]
  },
  {
    "id": "cser-building",
    "name": "CSER Building",
    "shortLabel": "CSER Building",
    "floors": null,
    "svgPath": "M625.7,430.4 L674.7,386.3 L694.8,408.6 L645.7,452.7 Z",
    "center": {
      "x": 660.2,
      "y": 419.5
    },
    "summary": "Academic building near Federizo Hall housing the College of Sports, Exercise and Recreation (CSER).",
    "locations": [
      {
        "id": "cser",
        "name": "College of Sports, Exercise and Recreation (CSER)",
        "category": "academic",
        "keywords": [
          "CSER",
          "Sports",
          "Exercise",
          "Recreation",
          "PE",
          "PATHFIT",
          "CSER Building"
        ]
      }
    ]
  },
  {
    "id": "bulsu-sg-office",
    "name": "BulSU Student Government Office",
    "shortLabel": "BulSU SG Office",
    "floors": null,
    "svgPath": "M683.3,383.9 L699.7,369.2 L714.4,385.5 L698.0,400.2 Z",
    "center": {
      "x": 698.9,
      "y": 384.7
    },
    "summary": "BulSU Student Government office beside CSER Building.",
    "locations": []
  },
  {
    "id": "alvarado-hall",
    "name": "Alvarado Hall",
    "shortLabel": "Alvarado Hall",
    "floors": 4,
    "svgPath": "M67.9,514.8 L179.4,414.4 L244.9,487.2 L133.5,587.6 Z",
    "center": {
      "x": 156.4,
      "y": 501
    },
    "summary": "Academic building on the MacArthur Highway (west) side housing the College of Industrial Technology.",
    "locations": [
      {
        "id": "cit",
        "name": "College of Industrial Technology (CIT)",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "BIT",
          "Industrial Technology",
          "TVL",
          "NC II",
          "CIT"
        ]
      },
      {
        "id": "alvarado-lactation-room",
        "name": "Lactation Room",
        "floor": "4th Floor",
        "category": "student-services",
        "keywords": [
          "Lactation",
          "GAD",
          "Alvarado Hall"
        ]
      }
    ]
  },
  {
    "id": "college-of-law",
    "name": "Marcelo H. del Pilar Hall",
    "shortLabel": "Marcelo H. del Pilar Hall",
    "floors": 3,
    "svgPath": "M293.9,499.7 L320.6,475.6 L403.6,567.8 L376.8,591.9 L346.1,557.7 L342.3,561.0 L327.6,544.7 L331.3,541.3 Z",
    "center": {
      "x": 348.7,
      "y": 533.8
    },
    "summary": "Academic building housing the College of Law (COL).",
    "locations": [
      {
        "id": "col",
        "name": "College of Law (COL)",
        "category": "academic",
        "keywords": [
          "COL",
          "College of Law",
          "Law",
          "Juris Doctor",
          "Marcelo H. del Pilar Hall"
        ]
      },
      {
        "id": "pacesetter-office",
        "name": "Pacesetter Office",
        "floor": "3rd Floor",
        "category": "student-services",
        "keywords": [
          "The Pacesetter",
          "Student Publication",
          "Newspaper",
          "COL",
          "Marcelo H. del Pilar Hall"
        ],
        "articleSlug": "bulsu-student-publication-guide"
      },
      {
        "id": "law-202",
        "name": "LAW 202",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "LAW202",
          "Classroom",
          "COL",
          "College of Law",
          "Marcelo H. del Pilar Hall"
        ]
      },
      {
        "id": "law-301",
        "name": "LAW 301",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "LAW301",
          "Classroom",
          "COL",
          "College of Law",
          "Marcelo H. del Pilar Hall"
        ]
      }
    ]
  },
  {
    "id": "activity-center",
    "name": "Activity Center",
    "shortLabel": "Activity Center",
    "floors": null,
    "svgPath": "M170.5,610.8 L218.1,568.0 L305.0,664.6 L257.5,707.4 Z",
    "center": {
      "x": 237.8,
      "y": 637.7
    },
    "summary": "Covered multi-sport activity center on Main Campus.",
    "locations": []
  },
  {
    "id": "carpio-hall",
    "name": "Carpio Hall",
    "shortLabel": "Carpio Hall",
    "floors": null,
    "svgPath": "M329.5,467.6 L354.8,444.9 L445.8,545.9 L420.5,568.7 Z",
    "center": {
      "x": 387.7,
      "y": 506.8
    },
    "summary": "Campus hall housing the Laboratory High School.",
    "locations": [
      {
        "id": "lhs",
        "name": "Laboratory High School",
        "category": "academic",
        "keywords": [
          "LHS",
          "Laboratory High School",
          "High School",
          "Carpio Hall"
        ]
      },
      {
        "id": "ch-210",
        "name": "CH 210",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "CH210",
          "Classroom",
          "Carpio Hall"
        ]
      }
    ]
  },
  {
    "id": "chtm-building",
    "name": "CHTM Building",
    "shortLabel": "CHTM Building",
    "floors": null,
    "svgPath": "M273.2,381.1 L311.8,346.3 L335.9,373.1 L321.0,386.4 L339.8,407.2 L316.0,428.7 Z",
    "center": {
      "x": 305.9,
      "y": 378.6
    },
    "summary": "College of Hospitality and Tourism Management building near the E-Library.",
    "locations": [
      {
        "id": "chtm",
        "name": "College of Hospitality and Tourism Management (CHTM)",
        "category": "academic",
        "keywords": [
          "CHTM",
          "Hospitality",
          "Tourism",
          "Home Economics",
          "CHE"
        ]
      }
    ]
  },
  {
    "id": "bulsu-hostel",
    "name": "BulSU University Hostel",
    "shortLabel": "Hostel",
    "floors": null,
    "svgPath": "M277.3,328.9 L366.5,248.6 L383.9,267.9 L294.7,348.2 Z",
    "center": {
      "x": 330.6,
      "y": 298.4
    },
    "summary": "BulSU University Hostel on Main Campus.",
    "locations": [
      {
        "id": "hostel-function-hall",
        "name": "Hostel Function Hall",
        "category": "sports-events",
        "keywords": [
          "Function Hall",
          "Hostel",
          "Events",
          "BulSU Hostel"
        ]
      }
    ]
  },
  {
    "id": "e-library",
    "name": "BulSU E-Library",
    "shortLabel": "E-Library",
    "floors": 7,
    "svgPath": "M329.1,341.5 L395.9,281.3 L441.4,331.9 L426.6,345.2 L450.7,372.0 L398.6,418.8 Z",
    "center": {
      "x": 392.4,
      "y": 349.1
    },
    "summary": "Seven-storey University Library building.",
    "locations": [
      {
        "id": "admissions-office",
        "name": "University Admissions Office",
        "floor": "2nd Floor",
        "category": "administration",
        "keywords": [
          "Admissions",
          "Freshmen",
          "Enrollment",
          "Application",
          "E-Library"
        ],
        "articleSlug": "admission-test-for-bulsu-atbulsu"
      },
      {
        "id": "elib-lactation-room",
        "name": "Lactation Room",
        "floor": "1st Floor",
        "category": "student-services",
        "keywords": [
          "Lactation",
          "GAD",
          "E-Library"
        ]
      },
      {
        "id": "elib-teleconferencing-room",
        "name": "Teleconferencing Room",
        "floor": "5th Floor",
        "category": "library",
        "keywords": [
          "Teleconference Room",
          "E-Library"
        ]
      },
      {
        "id": "elib-multipurpose-hall-1",
        "name": "Multipurpose Hall 1",
        "category": "library",
        "keywords": [
          "Multipurpose Hall",
          "E-Library"
        ]
      },
      {
        "id": "elib-multipurpose-hall-2",
        "name": "Multipurpose Hall 2",
        "category": "library",
        "keywords": [
          "Multipurpose Hall",
          "E-Library"
        ]
      },
      {
        "id": "elib-smart-learning-1",
        "name": "Smart Learning Room 1",
        "category": "library",
        "keywords": [
          "Smart Learning",
          "E-Library"
        ]
      },
      {
        "id": "elib-smart-learning-2",
        "name": "Smart Learning Room 2",
        "category": "library",
        "keywords": [
          "Smart Learning",
          "E-Library"
        ]
      },
      {
        "id": "elib-amphitheater",
        "name": "Amphitheater",
        "category": "library",
        "keywords": [
          "Amphitheater",
          "E-Library"
        ]
      },
      {
        "id": "elib-book-gallery",
        "name": "Book Gallery & Exhibit",
        "category": "library",
        "keywords": [
          "Book Gallery",
          "Exhibit",
          "E-Library"
        ]
      },
      {
        "id": "elib-cafeteria",
        "name": "Library Cafeteria",
        "category": "food-housing",
        "keywords": [
          "Cafeteria",
          "Food",
          "E-Library"
        ]
      }
    ]
  },
  {
    "id": "flores-hall",
    "name": "Flores Hall",
    "shortLabel": "Flores Hall",
    "floors": 2,
    "svgPath": "M665.8,536.2 L723.8,484.0 L693.0,449.8 L713.8,431.1 L762.0,484.6 L683.2,555.5 Z",
    "center": {
      "x": 726.7,
      "y": 496.2
    },
    "summary": "Main administration building facing Bulacan Heroes Park housing the Office of the University Registrar and BulSU Clinic Main.",
    "locations": [
      {
        "id": "registrar",
        "name": "Office of the University Registrar",
        "floor": "1st Floor",
        "category": "administration",
        "keywords": [
          "Registrar",
          "TOR",
          "Transcript",
          "COR",
          "COG",
          "Clearance",
          "LOA",
          "Graduation",
          "Diploma",
          "Transfer Credentials"
        ],
        "articleSlug": "how-to-request-transcript-and-certificates"
      },
      {
        "id": "clinic",
        "name": "BulSU Clinic Main",
        "floor": "1st Floor",
        "category": "student-services",
        "keywords": [
          "BulSU Clinic Main",
          "Clinic",
          "University Health Services",
          "Medical",
          "Dental",
          "Health",
          "Medical Certificate",
          "First Aid"
        ],
        "articleSlug": "bulsu-medical-and-health-services-guide"
      },
      {
        "id": "flores-lactation-room",
        "name": "Lactation Room",
        "floor": "1st Floor",
        "category": "student-services",
        "keywords": [
          "Lactation",
          "GAD",
          "Flores Hall"
        ]
      }
    ]
  },
  {
    "id": "mendoza-hall",
    "name": "Mendoza Hall",
    "shortLabel": "Mendoza Hall",
    "floors": 2,
    "svgPath": "M597.3,113.4 L615.2,97.4 L779.8,280.2 L761.9,296.3 Z",
    "center": {
      "x": 688.6,
      "y": 196.8
    },
    "summary": "Two-storey academic building on the north campus wing housing the College of Social Sciences and Philosophy.",
    "locations": [
      {
        "id": "cssp",
        "name": "College of Social Sciences and Philosophy (CSSP)",
        "category": "academic",
        "keywords": [
          "Mendoza Hall",
          "CSSP",
          "Psychology",
          "Social Sciences",
          "Philosophy"
        ]
      },
      {
        "id": "procurement-office",
        "name": "Procurement Office",
        "category": "administration",
        "keywords": [
          "Procurement",
          "BAC",
          "Mendoza Hall",
          "APP",
          "CSSP"
        ]
      }
    ]
  },
  {
    "id": "valencia-hall",
    "name": "Valencia Hall",
    "shortLabel": "Valencia Hall",
    "floors": null,
    "svgPath": "M732.1,433.5 L778.2,392.0 L815.6,433.6 L769.6,475.1 Z",
    "center": {
      "x": 773.9,
      "y": 433.5
    },
    "summary": "Multi-purpose university auditorium on Main Campus.",
    "locations": [
      {
        "id": "valencia-registrar",
        "name": "University Registrar Office (Enrollment Station)",
        "category": "administration",
        "keywords": [
          "Registrar",
          "Enrollment",
          "Valencia Hall"
        ],
        "articleSlug": "how-to-request-transcript-and-certificates"
      },
      {
        "id": "valencia-health-services",
        "name": "University Health Services (Enrollment Station)",
        "category": "student-services",
        "keywords": [
          "Health Services",
          "Medical",
          "Clinic",
          "Enrollment",
          "Valencia Hall"
        ],
        "articleSlug": "bulsu-medical-and-health-services-guide"
      },
      {
        "id": "cser-lsc-office",
        "name": "CSER LSC Office",
        "floor": "Beside Valencia Hall",
        "category": "student-services",
        "keywords": [
          "CSER LSC",
          "CSER",
          "Local Student Council",
          "Valencia Hall"
        ]
      },
      {
        "id": "valencia-lactation-room",
        "name": "Lactation Room",
        "floor": "Back",
        "category": "student-services",
        "keywords": [
          "Lactation",
          "GAD",
          "Valencia Hall"
        ]
      }
    ]
  },
  {
    "id": "pimentel-hall",
    "name": "Pimentel Hall",
    "shortLabel": "Pimentel Hall",
    "floors": 4,
    "svgPath": "M271.0,719.4 L291.8,700.7 L309.2,720.0 L393.9,643.8 L412.7,664.6 L307.2,759.6 Z",
    "center": {
      "x": 352.8,
      "y": 699.7
    },
    "summary": "Academic Building housing the College of Information and Communications Technology (CICT) and the College of Nursing (CON).",
    "locations": [
      {
        "id": "cict",
        "name": "College of Information & Communications Technology (CICT)",
        "category": "academic",
        "keywords": [
          "CICT",
          "IT",
          "BSIT",
          "BLIS",
          "Computer"
        ]
      },
      {
        "id": "con",
        "name": "College of Nursing (CON)",
        "category": "academic",
        "keywords": [
          "CON",
          "Nursing",
          "BSN",
          "Pimentel Hall"
        ]
      },
      {
        "id": "cict-deans-office",
        "name": "CICT Dean's Office",
        "floor": "3rd Floor",
        "category": "administration",
        "keywords": [
          "CICT",
          "Dean",
          "Dean's Office",
          "Pimentel Hall"
        ]
      },
      {
        "id": "cict-ojt-dept-heads",
        "name": "OJT Office / Office of Department Heads",
        "floor": "3rd Floor",
        "category": "administration",
        "keywords": [
          "CICT",
          "OJT",
          "Department Heads",
          "Program Chairs",
          "Pimentel Hall"
        ]
      },
      {
        "id": "cict-faculty-room",
        "name": "CICT Faculty Room",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "CICT",
          "Faculty",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pdo-office",
        "name": "Planning and Development Office (PDO)",
        "floor": "2nd Floor",
        "category": "administration",
        "keywords": [
          "PDO",
          "Planning and Development",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-a1",
        "name": "A1",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "A1",
          "CICT",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-a2",
        "name": "A2",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "A2",
          "CICT",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-a3",
        "name": "A3",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "A3",
          "CICT",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-a4",
        "name": "A4",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "A4",
          "CICT",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-it-13",
        "name": "IT 13",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "IT13",
          "CICT",
          "Lab",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-it-14",
        "name": "IT 14",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "IT14",
          "CICT",
          "Lab",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-it-1",
        "name": "IT 1",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "IT1",
          "CICT",
          "Lab",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-it-2",
        "name": "IT 2",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "IT2",
          "CICT",
          "Lab",
          "Classroom",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-sdl-1",
        "name": "SDL 1",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "SDL1",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-sdl-2",
        "name": "SDL 2",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "SDL2",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-sdl-3",
        "name": "SDL 3",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "SDL3",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-sdl-4",
        "name": "SDL 4",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "SDL4",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-prog-lab-1",
        "name": "Prog Lab 1",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "PROG LAB 1",
          "Programming Lab 1",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-prog-lab-2",
        "name": "Prog Lab 2",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "PROG LAB 2",
          "Programming Lab 2",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-prog-lab-3",
        "name": "Prog Lab 3",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "PROG LAB 3",
          "Programming Lab 3",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-cict-avr",
        "name": "CICT AVR",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "CICT AVR",
          "Audio Visual Room",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-conference-room",
        "name": "Conference Room",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "Conference Room",
          "CICT",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-ideation-room",
        "name": "Ideation Room",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "Ideation Room",
          "CICT",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-net-lab-1",
        "name": "Networking Lab 1",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NET LAB 1",
          "Networking Lab",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-net-lab-2",
        "name": "Networking Lab 2",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NET LAB 2",
          "Networking Lab",
          "CICT",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-server-room",
        "name": "Server Room",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "Server Room",
          "CICT",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-ct-6",
        "name": "CT 6",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "CT6",
          "CICT",
          "Classroom",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-ct-7",
        "name": "CT 7",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "CT7",
          "CICT",
          "Classroom",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-ct-8",
        "name": "CT 8",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "CT8",
          "CICT",
          "Classroom",
          "Lab",
          "Pimentel Hall"
        ]
      },
      {
        "id": "pimentel-acad-1",
        "name": "ACAD 1",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "ACAD1",
          "CICT",
          "Classroom",
          "Pimentel Hall"
        ]
      }
    ]
  },
  {
    "id": "nstp-building",
    "name": "NSTP Building",
    "shortLabel": "NSTP Building",
    "floors": null,
    "svgPath": "M334.4,753.9 L422.0,675.0 L442.1,697.3 L354.4,776.2 Z",
    "center": {
      "x": 388.2,
      "y": 725.6
    },
    "summary": "National Service Training Program (NSTP) Building.",
    "locations": [
      {
        "id": "nstp-faculty-lounge",
        "name": "Faculty Lounge",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "Faculty Lounge",
          "GAD",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-lsc-student-center",
        "name": "CICT LSC Office",
        "category": "student-services",
        "keywords": [
          "LSC",
          "CICT LSC",
          "Student Center",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-acad-2",
        "name": "ACAD 2",
        "category": "academic",
        "keywords": [
          "ACAD2",
          "CICT ACAD 2",
          "CICT",
          "Classroom",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-acad-3",
        "name": "ACAD 3",
        "category": "academic",
        "keywords": [
          "ACAD3",
          "CICT ACAD 3",
          "CICT",
          "Classroom",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-acad-4",
        "name": "ACAD 4",
        "category": "academic",
        "keywords": [
          "ACAD4",
          "CICT ACAD 4",
          "CICT",
          "Classroom",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-acad-5",
        "name": "ACAD 5",
        "category": "academic",
        "keywords": [
          "ACAD5",
          "CICT ACAD 5",
          "CICT",
          "Classroom",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-acad-6",
        "name": "ACAD 6",
        "category": "academic",
        "keywords": [
          "ACAD6",
          "CICT ACAD 6",
          "CICT",
          "Classroom",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-acad-7",
        "name": "ACAD 7",
        "category": "academic",
        "keywords": [
          "ACAD7",
          "CICT ACAD 7",
          "CICT",
          "Classroom",
          "NSTP Building"
        ]
      },
      {
        "id": "nstp-acad-8",
        "name": "ACAD 8",
        "category": "academic",
        "keywords": [
          "ACAD8",
          "CICT ACAD 8",
          "CICT",
          "Classroom",
          "NSTP Building"
        ]
      }
    ]
  },
  {
    "id": "con-canteen",
    "name": "CON Canteen",
    "shortLabel": "CON Canteen",
    "floors": null,
    "svgPath": "M406.1,627.4 L429.9,606.0 L478.1,659.5 L454.3,680.9 Z",
    "center": {
      "x": 442.1,
      "y": 643.4
    },
    "summary": "CON Canteen near the central walkway.",
    "locations": [
      {
        "id": "tindahan-ni-ka-ekek",
        "name": "Tindahan ni Ka Ekek",
        "category": "food-housing",
        "keywords": [
          "Tindahan ni Ka Ekek",
          "Ka Ekek",
          "Tindahan",
          "Store",
          "CON Canteen",
          "Food",
          "Snacks"
        ]
      },
      {
        "id": "campus-chicken",
        "name": "Campus Chicken",
        "category": "food-housing",
        "keywords": [
          "Campus Chicken",
          "Chicken",
          "CON Canteen",
          "Food",
          "Meals"
        ]
      }
    ]
  },
  {
    "id": "bsu-canteen",
    "name": "BulSU Canteen",
    "shortLabel": "Canteen",
    "floors": null,
    "svgPath": "M777.6,376.4 L793.9,361.7 L846.1,419.6 L829.8,434.3 Z",
    "center": {
      "x": 811.8,
      "y": 398
    },
    "summary": "Main University Canteen building.",
    "locations": []
  },
  {
    "id": "chocolate-building",
    "name": "Chocolate Building",
    "shortLabel": "Chocolate Building",
    "floors": null,
    "svgPath": "M808.8,348.3 L825.1,333.5 L906.5,423.8 L890.1,438.5 Z",
    "center": {
      "x": 857.6,
      "y": 386
    },
    "summary": "Academic building across from the Main Canteen near Gate 3 housing the College of Criminal Justice Education (CCJE).",
    "locations": [
      {
        "id": "ccje",
        "name": "College of Criminal Justice Education (CCJE)",
        "category": "academic",
        "keywords": [
          "CCJE",
          "Criminology",
          "Criminal Justice",
          "Chocolate Building"
        ]
      }
    ]
  },
  {
    "id": "srlc-building",
    "name": "Science, Research and Learning Center",
    "shortLabel": "SRLC",
    "floors": null,
    "svgPath": "M406.8,424.9 L464.8,372.7 L482.2,392.1 L424.2,444.2 Z",
    "center": {
      "x": 444.5,
      "y": 408.5
    },
    "summary": "Science, Research and Learning Center beside the E-Library and Heroes Park.",
    "locations": []
  },
  {
    "id": "cbea-building",
    "name": "CBEA Building",
    "shortLabel": "CBEA Building",
    "floors": 4,
    "svgPath": "M429.6,450.2 L487.5,398.0 L506.3,418.8 L448.3,471.0 Z",
    "center": {
      "x": 467.9,
      "y": 434.5
    },
    "summary": "College of Business Education and Accountancy building facing Heroes Park.",
    "locations": [
      {
        "id": "cbea",
        "name": "College of Business Education and Accountancy (CBEA)",
        "category": "academic",
        "keywords": [
          "Accountancy",
          "BSA",
          "Business Administration",
          "CBEA",
          "CBA"
        ]
      },
      {
        "id": "cba-103",
        "name": "CBA 103",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "CBA103",
          "CBEA 103",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-201",
        "name": "CBA 201",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "CBA201",
          "CBEA 201",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-202",
        "name": "CBA 202",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "CBA202",
          "CBEA 202",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-203",
        "name": "CBA 203",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "CBA203",
          "CBEA 203",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-301",
        "name": "CBA 301",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "CBA301",
          "CBEA 301",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-302",
        "name": "CBA 302",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "CBA302",
          "CBEA 302",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-303",
        "name": "CBA 303",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "CBA303",
          "CBEA 303",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-401",
        "name": "CBA 401",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "CBA401",
          "CBEA 401",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-402",
        "name": "CBA 402",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "CBA402",
          "CBEA 402",
          "Classroom",
          "CBEA Building"
        ]
      },
      {
        "id": "cba-403",
        "name": "CBA 403",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "CBA403",
          "CBEA 403",
          "Classroom",
          "CBEA Building"
        ]
      }
    ]
  },
  {
    "id": "natividad-hall",
    "name": "Natividad Hall",
    "shortLabel": "Natividad Hall",
    "floors": 5,
    "svgPath": "M522.5,568.4 L538.9,553.6 L531.5,545.5 L552.3,526.7 L559.7,534.9 L580.5,516.2 L618.0,557.8 L560.0,610.0 Z M546.6,568.2 L574.8,542.8 L590.9,560.6 L562.7,586.0 Z",
    "center": {
      "x": 569.5,
      "y": 563.7
    },
    "summary": "Five-storey building near Gate 2 serving the College of Engineering.",
    "locations": [
      {
        "id": "coe",
        "name": "College of Engineering (COE)",
        "category": "academic",
        "keywords": [
          "Engineering",
          "Civil",
          "Mechanical",
          "Electrical",
          "ECE",
          "CpE",
          "IE"
        ]
      },
      {
        "id": "nh-107",
        "name": "NH 107",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "NH107",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-201-avr",
        "name": "NH 201 AVR",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "NH201",
          "NH 201",
          "AVR",
          "Audio Visual Room",
          "COE",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-307",
        "name": "NH 307",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "NH307",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-308",
        "name": "NH 308",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "NH308",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-309",
        "name": "NH 309",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "NH309",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-402",
        "name": "NH 402",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH402",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-403",
        "name": "NH 403",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH403",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-404",
        "name": "NH 404",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH404",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-405",
        "name": "NH 405",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH405",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-406",
        "name": "NH 406",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH406",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-407",
        "name": "NH 407",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH407",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-408",
        "name": "NH 408",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH408",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-409",
        "name": "NH 409",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "NH409",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-501",
        "name": "NH 501",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH501",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-502",
        "name": "NH 502",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH502",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-503",
        "name": "NH 503",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH503",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-504",
        "name": "NH 504",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH504",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-505",
        "name": "NH 505",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH505",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-507",
        "name": "NH 507",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH507",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-508",
        "name": "NH 508",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH508",
          "Classroom",
          "Natividad Hall"
        ]
      },
      {
        "id": "nh-509",
        "name": "NH 509",
        "floor": "5th Floor",
        "category": "academic",
        "keywords": [
          "NH509",
          "Classroom",
          "Natividad Hall"
        ]
      }
    ]
  },
  {
    "id": "roxas-hall",
    "name": "Roxas Hall",
    "shortLabel": "Roxas Hall",
    "floors": 4,
    "svgPath": "M425.4,583.1 L471.5,541.6 L533.1,610.0 L487.0,651.5 Z M457.9,586.2 L471.2,574.2 L500.7,606.9 L487.3,618.9 Z",
    "center": {
      "x": 479.3,
      "y": 596.5
    },
    "summary": "Four-storey academic building near Gate 2 housing the College of Professional Teacher Education (CPTEd), PPESO Office, and classrooms.",
    "locations": [
      {
        "id": "cpted",
        "name": "College of Professional Teacher Education (CPTEd)",
        "category": "academic",
        "keywords": [
          "CPTEd",
          "CPTE",
          "COED",
          "Education",
          "Teacher Education",
          "Roxas Hall"
        ]
      },
      {
        "id": "ppeso-office",
        "name": "PPESO Office",
        "floor": "1st Floor",
        "category": "student-services",
        "keywords": [
          "PPESO",
          "Placement",
          "ISA",
          "Student Assistantship",
          "Rojas Hall",
          "Roxas Hall"
        ],
        "articleSlug": "how-to-apply-for-student-assistantships"
      },
      {
        "id": "roxas-lactation-room",
        "name": "Lactation Room",
        "floor": "1st Floor",
        "category": "student-services",
        "keywords": [
          "Lactation",
          "GAD",
          "Roxas Hall"
        ]
      },
      {
        "id": "roxas-child-minding",
        "name": "Child-Minding Center",
        "floor": "1st Floor",
        "category": "student-services",
        "keywords": [
          "Child-Minding",
          "GAD",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-101",
        "name": "RH 101",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "RH101",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-102",
        "name": "RH 102",
        "floor": "1st Floor",
        "category": "academic",
        "keywords": [
          "RH102",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-202",
        "name": "RH 202",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "RH202",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-203",
        "name": "RH 203",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "RH203",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-204",
        "name": "RH 204",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "RH204",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-207",
        "name": "RH 207",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "RH207",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-209",
        "name": "RH 209",
        "floor": "2nd Floor",
        "category": "academic",
        "keywords": [
          "RH209",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-303",
        "name": "RH 303",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "RH303",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-304",
        "name": "RH 304",
        "floor": "3rd Floor",
        "category": "academic",
        "keywords": [
          "RH304",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-402",
        "name": "RH 402",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "RH402",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-404",
        "name": "RH 404",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "RH404",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-405",
        "name": "RH 405",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "RH405",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-406",
        "name": "RH 406",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "RH406",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-406a",
        "name": "RH 406A",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "RH406A",
          "RH 406 A",
          "Classroom",
          "Roxas Hall"
        ]
      },
      {
        "id": "rh-407",
        "name": "RH 407",
        "floor": "4th Floor",
        "category": "academic",
        "keywords": [
          "RH407",
          "Classroom",
          "Roxas Hall"
        ]
      }
    ]
  }
];
