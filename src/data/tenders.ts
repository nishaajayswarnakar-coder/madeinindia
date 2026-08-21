export interface Tender {
  id: string;
  source: "CPPP" | "GeM";
  value: string;
  title: string;
  location: string;
  closingDate: string;
}

export const tendersData: Tender[] = [
  {
    id: "TND-1001",
    source: "CPPP",
    value: "₹ 1.85 CR",
    title: "Procurement of Heavy-Duty 33kV Electrical Step-Down Transformers for Power Sub-Station Grid Expansion",
    location: "Nagpur / Pune, MH",
    closingDate: "28-Aug-2026 05:00 PM"
  },
  {
    id: "TND-1002",
    source: "GeM",
    value: "₹ 92.5 LAKHS",
    title: "Supply, Commissioning and 3-Year Onsite AMC of Cloud-Ready Rack Server Blades & Industrial Firewall",
    location: "New Delhi, DL",
    closingDate: "02-Sep-2026 03:30 PM"
  },
  {
    id: "TND-1003",
    source: "CPPP",
    value: "₹ 4.50 CR",
    title: "Construction of 50-Bedded Additional Ward and Upgradation of Existing Medical Infrastructure",
    location: "Bhopal, MP",
    closingDate: "05-Sep-2026 04:00 PM"
  },
  {
    id: "TND-1004",
    source: "GeM",
    value: "₹ 25.0 LAKHS",
    title: "Annual Rate Contract for Supply of A4 Size Printing Paper and Office Stationery",
    location: "Chennai, TN",
    closingDate: "10-Sep-2026 11:00 AM"
  },
  {
    id: "TND-1005",
    source: "CPPP",
    value: "₹ 12.75 CR",
    title: "Laying of 800mm DI Pipes for Water Supply Augmentation Scheme Phase-II",
    location: "Jaipur, RJ",
    closingDate: "15-Sep-2026 02:00 PM"
  },
  {
    id: "TND-1006",
    source: "GeM",
    value: "₹ 45.8 LAKHS",
    title: "Procurement of 50 Nos. of High-End Desktop Computers for Computer Lab Upgradation",
    location: "Hyderabad, TS",
    closingDate: "12-Sep-2026 05:00 PM"
  },
  {
    id: "TND-1007",
    source: "CPPP",
    value: "₹ 8.20 CR",
    title: "Design, Supply, Installation and Commissioning of 2MW Rooftop Solar Power Plant",
    location: "Ahmedabad, GJ",
    closingDate: "20-Sep-2026 03:00 PM"
  },
  {
    id: "TND-1008",
    source: "GeM",
    value: "₹ 15.5 LAKHS",
    title: "Supply of Security Personnel and Housekeeping Staff for Zonal Office",
    location: "Lucknow, UP",
    closingDate: "25-Sep-2026 04:30 PM"
  },
  {
    id: "TND-1009",
    source: "CPPP",
    value: "₹ 3.10 CR",
    title: "Widening and Strengthening of 15KM State Highway Connecting Industrial Zone",
    location: "Coimbatore, TN",
    closingDate: "22-Sep-2026 01:00 PM"
  },
  {
    id: "TND-1010",
    source: "GeM",
    value: "₹ 85.0 LAKHS",
    title: "Procurement of Medical Equipment (ECG Machines, Defibrillators, Patient Monitors)",
    location: "Kolkata, WB",
    closingDate: "18-Sep-2026 05:00 PM"
  },
  {
    id: "TND-1011",
    source: "CPPP",
    value: "₹ 5.60 CR",
    title: "Operations and Maintenance of Effluent Treatment Plant (ETP) for 5 Years",
    location: "Surat, GJ",
    closingDate: "30-Sep-2026 02:30 PM"
  },
  {
    id: "TND-1012",
    source: "GeM",
    value: "₹ 32.4 LAKHS",
    title: "Supply of Industrial Safety Gear (Helmets, Safety Shoes, Reflective Jackets)",
    location: "Mumbai, MH",
    closingDate: "08-Oct-2026 12:00 PM"
  },
  {
    id: "TND-1013",
    source: "CPPP",
    value: "₹ 22.50 CR",
    title: "Construction of Multi-Level Smart Parking Facility with EV Charging Stations",
    location: "Bengaluru, KA",
    closingDate: "15-Oct-2026 03:00 PM"
  },
  {
    id: "TND-1014",
    source: "GeM",
    value: "₹ 55.0 LAKHS",
    title: "Procurement of Drone Systems for Aerial Survey and Mapping Applications",
    location: "Dehradun, UK",
    closingDate: "10-Oct-2026 04:00 PM"
  },
  {
    id: "TND-1015",
    source: "CPPP",
    value: "₹ 1.25 CR",
    title: "Upgradation of Fire Fighting Systems at Central Secretariat Building",
    location: "New Delhi, DL",
    closingDate: "05-Oct-2026 02:00 PM"
  },
  {
    id: "TND-1016",
    source: "GeM",
    value: "₹ 18.2 LAKHS",
    title: "Supply of 500 Nos. of Ergonomic Office Chairs and Workstations",
    location: "Chandigarh, CH",
    closingDate: "12-Oct-2026 05:00 PM"
  },
  {
    id: "TND-1017",
    source: "CPPP",
    value: "₹ 7.80 CR",
    title: "Dredging and Desilting of Navigational Channel in Port Area",
    location: "Kochi, KL",
    closingDate: "20-Oct-2026 01:30 PM"
  },
  {
    id: "TND-1018",
    source: "GeM",
    value: "₹ 42.5 LAKHS",
    title: "Supply and Installation of Interactive Digital Smart Boards for Government Schools",
    location: "Guwahati, AS",
    closingDate: "25-Oct-2026 03:00 PM"
  }
];
