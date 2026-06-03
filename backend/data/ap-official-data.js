/**
 * Curated Andhra Pradesh civic & governance reference data.
 * Sources: ECI 2024 results, ap.gov.in district portals, aphc.gov.in (May 2026),
 * Andhra Pradesh Cabinet portfolio notification (June 2024), press reports.
 */

export const AP_DISTRICTS = [
  'Alluri Sitharama Raju', 'Anakapalli', 'Anantapur', 'Annamayya', 'Bapatla', 'Chittoor',
  'Dr. B. R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur', 'Kakinada', 'Krishna',
  'Kurnool', 'Nandyal', 'NTR', 'Palnadu', 'Parvathipuram Manyam', 'Prakasam',
  'Sri Balaji (Tirupati)', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai', 'Srikakulam',
  'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
];

/** Collector & SP from district ap.gov.in / AP Handlooms ODOP contacts (verify on district portal if transferred) */
export const districtsOfficial = [
  { name: 'Srikakulam', collectorName: 'Sri Swapnil Dinkar Pundkar, IAS', spName: 'As per srikakulam.ap.gov.in' },
  { name: 'Vizianagaram', collectorName: 'As per vizianagaram.ap.gov.in', spName: 'As per vizianagaram.ap.gov.in' },
  { name: 'Parvathipuram Manyam', collectorName: 'As per parvathipurammanyam.ap.gov.in', spName: 'As per district police portal' },
  { name: 'Visakhapatnam', collectorName: 'As per visakhapatnam.ap.gov.in', spName: 'As per visakhapatnam.ap.gov.in' },
  { name: 'Anakapalli', collectorName: 'As per anakapalli.ap.gov.in', spName: 'As per district police portal' },
  { name: 'Alluri Sitharama Raju', collectorName: 'As per allurisitharamaraju.ap.gov.in', spName: 'As per district police portal' },
  { name: 'Kakinada', collectorName: 'As per kakinada.ap.gov.in', spName: 'As per kakinada.ap.gov.in' },
  { name: 'Dr. B. R. Ambedkar Konaseema', collectorName: 'As per konaseema.ap.gov.in', spName: 'As per district police portal' },
  { name: 'East Godavari', collectorName: 'Smt. Kirti Chekuri, IAS', spName: 'As per eastgodavari.ap.gov.in' },
  { name: 'West Godavari', collectorName: 'As per westgodavari.ap.gov.in', spName: 'As per westgodavari.ap.gov.in' },
  { name: 'Eluru', collectorName: 'As per eluru.ap.gov.in', spName: 'As per eluru.ap.gov.in' },
  { name: 'Krishna', collectorName: 'Sri D.K. Balaji, IAS', spName: 'Sri V. Vidhya Sagar Naidu, IPS' },
  { name: 'NTR', collectorName: 'As per ntr.ap.gov.in', spName: 'As per ntr.ap.gov.in' },
  { name: 'Guntur', collectorName: 'As per guntur.ap.gov.in', spName: 'As per guntur.ap.gov.in' },
  { name: 'Palnadu', collectorName: 'As per palnadu.ap.gov.in', spName: 'As per district police portal' },
  { name: 'Bapatla', collectorName: 'As per bapatla.ap.gov.in', spName: 'As per district police portal' },
  { name: 'Prakasam', collectorName: 'As per prakasam.ap.gov.in', spName: 'As per prakasam.ap.gov.in' },
  { name: 'Sri Potti Sriramulu Nellore', collectorName: 'As per nellore.ap.gov.in', spName: 'As per nellore.ap.gov.in' },
  { name: 'Sri Balaji (Tirupati)', collectorName: 'As per tirupati.ap.gov.in', spName: 'As per district police portal' },
  { name: 'Chittoor', collectorName: 'As per chittoor.ap.gov.in', spName: 'As per chittoor.ap.gov.in' },
  { name: 'Annamayya', collectorName: 'As per annamayya.ap.gov.in', spName: 'As per district police portal' },
  { name: 'YSR Kadapa', collectorName: 'Dr. Sreedhar Cherukuri, IAS', spName: 'As per kadapa.ap.gov.in' },
  { name: 'Anantapur', collectorName: 'As per anantapur.ap.gov.in', spName: 'As per anantapur.ap.gov.in' },
  { name: 'Sri Sathya Sai', collectorName: 'Sri Chetan T S, IAS', spName: 'As per satyasai.ap.gov.in' },
  { name: 'Kurnool', collectorName: 'As per kurnool.ap.gov.in', spName: 'As per kurnool.ap.gov.in' },
  { name: 'Nandyal', collectorName: 'As per nandyal.ap.gov.in', spName: 'As per nandyal.ap.gov.in' }
];

export const policeAuthoritiesOfficial = [
  {
    designation: 'Director General of Police (DGP)',
    name: 'Harish Kumar Gupta, IPS',
    details: 'Head of Andhra Pradesh Police (appointed 2025). Overall law & order, policy, and coordination of state police forces. Source: State government notifications / press.'
  },
  {
    designation: 'Home Minister (Political Head)',
    name: 'Smt. Anitha Vangalapudi',
    details: 'Cabinet minister for Home Affairs & Disaster Management — political head overseeing police administration at state level.'
  },
  {
    designation: 'Additional DGP (Law & Order)',
    name: 'As per ap police hierarchy',
    details: 'Assists DGP on law and order, crime, and internal security across zones.'
  },
  {
    designation: 'Inspector General of Police (IGP)',
    name: 'Zone / wing heads',
    details: 'Supervises police ranges, CID, traffic, railways, or other specialised wings.'
  },
  {
    designation: 'Deputy Inspector General (DIG)',
    name: 'Range officers',
    details: 'Oversees a group of districts or a commissionerate within a police zone.'
  },
  {
    designation: 'Superintendent of Police (SP)',
    name: 'District level',
    details: 'Heads district police (except police commissionerates). Each revenue district has an SP — see Districts tab for district-wise names on ap.gov.in.'
  }
];

export const assemblyTopicsOfficial = [
  {
    title: 'What is the State Assembly?',
    icon: '🏛️',
    summary: 'Andhra Pradesh Legislative Assembly — the state legislature with 175 MLAs.',
    content: `The State Legislative Assembly (Vidhana Sabha) is the lower house of the state legislature. In Andhra Pradesh it has 175 elected Members of the Legislative Assembly (MLAs).

• MLAs are chosen by voters in Assembly constituencies (one MLA per constituency).
• The Assembly makes laws on state subjects — education, police, agriculture, health, local bodies, etc.
• It passes the state budget and holds the government accountable through questions and debates.
• The Assembly meets at the legislature complex (Amaravati / Velagapudi area) when the Governor summons sessions.

For students: When you hear "AP Assembly", it means these 175 elected representatives of the people of Andhra Pradesh.`
  },
  {
    title: 'How is the Assembly conducted?',
    icon: '📋',
    summary: 'Sessions led by the Speaker; Treasury and Opposition benches; laws passed by vote.',
    content: `Assembly proceedings follow rules laid down in the Constitution and the Assembly's own rules:

1. The Governor opens or prorogues sessions; the Speaker presides over day-to-day business.
2. MLAs sit on Treasury (ruling) or Opposition benches — see the Assembly Hierarchy diagram in Learn Hierarchies.
3. Bills are introduced, debated in the House, and passed by a majority vote.
4. The Speaker decides who may speak, maintains order, and does not vote except to break a tie.
5. Officials (Secretariat) record proceedings and assist with legislative drafting.
6. Important sessions include budget session, monsoon session, and winter session.

Students can relate this to a school parliament: agenda, debate, vote, and minutes — but at state government level.`
  },
  {
    title: 'How is the CM chosen and government formed?',
    icon: '👔',
    summary: 'The Governor invites the leader who can prove majority support among MLAs.',
    content: `After Assembly elections:

1. All 175 seats are filled by elected MLAs.
2. Political parties count their seats. The party or alliance with a majority (more than half) usually forms the government.
3. The Governor invites the leader of that majority group to become Chief Minister (CM).
4. The CM chooses ministers from MLAs (and rarely, non-MLAs where permitted) to run departments.
5. The Council of Ministers is collectively responsible to the Assembly — it must retain the confidence of the House.

In Andhra Pradesh (2024): The NDA alliance (TDP, Jana Sena, BJP) won a large majority; N. Chandrababu Naidu was sworn in as Chief Minister.`
  },
  {
    title: 'What is the ruling party? How many seats are needed?',
    icon: '👑',
    summary: 'Majority in AP = more than half of 175 seats → at least 88 seats.',
    content: `Ruling party / ruling alliance:

• The group that has a majority of MLAs in the Assembly runs the state government.
• Andhra Pradesh Assembly strength: 175 seats.
• Majority mark: more than 175 ÷ 2 → at least 88 seats (87 is not enough; 88 is the minimum majority).

Examples:
• If one party wins 90 seats, it can form the government alone.
• If Party A wins 70 and Party B wins 25, together they have 95 — an alliance can form the government.

The ruling party occupies the Treasury benches in the Assembly; the largest opposition group sits on the Opposition benches.`
  },
  {
    title: 'What if no party gets a majority?',
    icon: '🤝',
    summary: 'Hung Assembly — parties form coalitions or alliances; confidence vote decides.',
    content: `If no single party wins 88 or more seats, it is called a Hung Assembly:

1. Parties negotiate post-poll alliances to cross the majority mark together.
2. The Governor may invite the largest party or alliance to try to form the government.
3. The proposed CM must prove majority support through a floor test (confidence vote) on the Assembly floor.
4. If the government loses a no-confidence motion, it must resign; the Governor may invite another combination or call fresh elections.

Pre-poll alliance: Parties agree before elections to share seats and campaign together (e.g. TDP + JSP + BJP in 2024).

Post-poll alliance: Parties join after results to reach 88+ seats together.

At the national level, Lok Sabha needs 272+ out of 543 elected seats — the same idea, different numbers.`
  }
];

export const ministriesOfficial = [
  { name: 'Chief Minister', ministerName: 'N. Chandrababu Naidu', department: 'General Administration, Law & Order, Public Enterprises', responsibilities: 'Head of state government; portfolios not assigned to other ministers.', order: 1 },
  { name: 'Deputy Chief Minister', ministerName: 'Konidela Pawan Kalyan', department: 'Panchayati Raj, Rural Development, Environment & Forests', responsibilities: 'Deputy head of government; rural local bodies, drinking water, environment, science & technology.', order: 2 },
  { name: 'Human Resources Development', ministerName: 'Nara Lokesh', department: 'Education, IT, Electronics & Communications', responsibilities: 'School and higher education, skill development, IT policy, and RTG initiatives.', order: 3 },
  { name: 'Agriculture & Cooperation', ministerName: 'Kinjarapu Atchannaidu', department: 'Agriculture, Animal Husbandry, Fisheries', responsibilities: 'Farmers welfare, cooperatives, dairy, fisheries, and marketing.', order: 4 },
  { name: 'Mines & Excise', ministerName: 'Kollu Ravindra', department: 'Mines & Geology, Excise', responsibilities: 'Mineral resources regulation and state excise policy.', order: 5 },
  { name: 'Civil Supplies', ministerName: 'Nadendla Manohar', department: 'Food & Civil Supplies, Consumer Affairs', responsibilities: 'Public distribution system (ration), consumer protection, essential commodities.', order: 6 },
  { name: 'Municipal Administration', ministerName: 'Ponguru Narayana', department: 'Municipal Administration & Urban Development', responsibilities: 'Urban local bodies, city planning, sanitation, and urban infrastructure.', order: 7 },
  { name: 'Home Affairs', ministerName: 'Anitha Vangalapudi', department: 'Home, Disaster Management', responsibilities: 'Police administration, public order, prisons, fire services, disaster management.', order: 8 },
  { name: 'Health & Medical Education', ministerName: 'Satya Kumar Yadav', department: 'Health, Family Welfare, Medical Education', responsibilities: 'Hospitals, public health programmes, and medical education.', order: 9 },
  { name: 'Irrigation', ministerName: 'Nimmala Ramanaidu', department: 'Water Resources Development', responsibilities: 'Major and minor irrigation, canals, and water allocation for agriculture.', order: 10 },
  { name: 'Law & Minority Welfare', ministerName: 'Nasyam Mohammed Farooq', department: 'Law, Minority Welfare', responsibilities: 'Legal affairs support and minority welfare programmes.', order: 11 },
  { name: 'Endowments', ministerName: 'Anam Ramanarayana Reddy', department: 'Hindu Religious & Charitable Endowments', responsibilities: 'Temple administration and endowment institutions under government supervision.', order: 12 },
  { name: 'Finance & Planning', ministerName: 'Payyavula Keshav', department: 'Finance, Planning, Commercial Taxes, Legislative Affairs', responsibilities: 'State budget, taxation, economic planning, and legislative coordination.', order: 13 },
  { name: 'Revenue', ministerName: 'Anagani Satya Prasad', department: 'Revenue, Stamps & Registration', responsibilities: 'Land administration, registrations, and revenue collection.', order: 14 },
  { name: 'Housing & Public Relations', ministerName: 'Kolusu Parthasarathy', department: 'Housing, Information & Public Relations', responsibilities: 'Affordable housing schemes and government communications.', order: 15 },
  { name: 'Social Welfare', ministerName: 'Dr. D. Bala Veeranjaneya Swamy', department: 'Social Welfare, Sachivalayam & Village Volunteers', responsibilities: 'Welfare for disabled and senior citizens; village volunteer system coordination.', order: 16 },
  { name: 'Energy', ministerName: 'Gottipati Ravi Kumar', department: 'Energy', responsibilities: 'Power generation, distribution, and renewable energy policy.', order: 17 },
  { name: 'Tourism & Culture', ministerName: 'Kandula Durgesh', department: 'Tourism, Culture, Cinematography', responsibilities: 'Tourism promotion, cultural heritage, and film-related policy.', order: 18 },
  { name: 'Women & Child / Tribal Welfare', ministerName: 'Gummadi Sandhya Rani', department: 'Women & Child Welfare, Tribal Welfare', responsibilities: 'Women empowerment, child welfare, ICDS, and tribal welfare programmes.', order: 19 },
  { name: 'Roads & Buildings', ministerName: 'B.C. Janardhan Reddy', department: 'Roads & Buildings, Infrastructure, Investments', responsibilities: 'State highways, government buildings, and investment promotion.', order: 20 },
  { name: 'Industries & Commerce', ministerName: 'T.G. Bharat', department: 'Industries, Commerce, Food Processing', responsibilities: 'Industrial policy, MSME support, and food processing.', order: 21 },
  { name: 'Backward Classes Welfare', ministerName: 'S. Savitha', department: 'BC Welfare, Handlooms & Textiles', responsibilities: 'BC welfare corporations, handlooms, and textile sector support.', order: 22 },
  { name: 'Labour & Employment', ministerName: 'Vasamsetti Subhash', department: 'Labour, Factories, Employment, Insurance Medical Services', responsibilities: 'Labour laws, industrial safety, employment exchanges, and worker welfare.', order: 23 },
  { name: 'MSME & NRI Affairs', ministerName: 'Kondapalli Srinivas', department: 'MSME, SERP, NRI Empowerment', responsibilities: 'Micro enterprises, rural employment programmes, and NRI relations.', order: 24 },
  { name: 'Transport & Sports', ministerName: 'Mandapalli Ram Prasad Reddy', department: 'Transport, Youth Services & Sports', responsibilities: 'Transport policy, youth services, and sports development.', order: 25 }
];

/** Lok Sabha 2024 — ECI declared results, June 2024 */
export const mpsOfficial = [
  { name: 'Gumma Thanuja Rani', constituency: 'Araku (ST)', party: 'YSRCP', responsibilities: 'ST reserved seat; tribal welfare and Agency area development in Parliament.', order: 1 },
  { name: 'Kinjarapu Rammohan Naidu', constituency: 'Srikakulam', party: 'TDP', responsibilities: 'North coastal Andhra — railways, ports, and industrial growth.', order: 2 },
  { name: 'Appalanaidu Kalisetti', constituency: 'Vizianagaram', party: 'TDP', responsibilities: 'Education, irrigation, and employment in Uttarandhra.', order: 3 },
  { name: 'Sribharat Mathukumili', constituency: 'Visakhapatnam', party: 'TDP', responsibilities: 'Port city, IT corridor, and naval/industrial development.', order: 4 },
  { name: 'C.M. Ramesh', constituency: 'Anakapalli', party: 'BJP', responsibilities: 'Agro-processing, highways, and Uttarandhra connectivity.', order: 5 },
  { name: 'Tangella Uday Srinivas', constituency: 'Kakinada', party: 'JSP', responsibilities: 'Godavari delta, petrochemical hub, and fishing harbour development.', order: 6 },
  { name: 'G.M. Harish Balayogi', constituency: 'Amalapuram (SC)', party: 'TDP', responsibilities: 'Konaseema welfare, aquaculture, and Dalit empowerment.', order: 7 },
  { name: 'Daggubati Purandeshwari', constituency: 'Rajahmundry', party: 'BJP', responsibilities: 'Pushkaralu infrastructure, tourism, and Godavari civil works.', order: 8 },
  { name: 'Bhupathi Raju Srinivasa Varma', constituency: 'Narasapuram', party: 'BJP', responsibilities: 'Aqua exports, lace industry, and West Godavari connectivity.', order: 9 },
  { name: 'Putta Mahesh Kumar', constituency: 'Eluru', party: 'TDP', responsibilities: 'Polavaram rehabilitation, textiles, and central schemes.', order: 10 },
  { name: 'Balashowry Vallabhaneni', constituency: 'Machilipatnam', party: 'JSP', responsibilities: 'Fishing harbour modernisation and Krishna district development.', order: 11 },
  { name: 'Kesineni Sivanath', constituency: 'Vijayawada', party: 'TDP', responsibilities: 'Capital region connectivity, urban infrastructure, and NH projects.', order: 12 },
  { name: 'Dr. Chandra Sekhar Pemmasani', constituency: 'Guntur', party: 'TDP', responsibilities: 'Amaravati policy, pharma industry, and agricultural exports.', order: 13 },
  { name: 'Lavu Srikrishna Devarayalu', constituency: 'Narasaraopet', party: 'TDP', responsibilities: 'Palnadu development, chilli markets, and handloom weavers.', order: 14 },
  { name: 'Krishna Prasad Tenneti', constituency: 'Bapatla (SC)', party: 'TDP', responsibilities: 'Coastal aquaculture and Bapatla educational institutions.', order: 15 },
  { name: 'Magunta Sreenivasulu Reddy', constituency: 'Ongole', party: 'TDP', responsibilities: 'Granite industry, Ongole-Nellore corridor, and irrigation.', order: 16 },
  { name: 'Dr. Byreddy Shabari', constituency: 'Nandyal', party: 'TDP', responsibilities: 'Rayalaseema drought mitigation, solar power, and handlooms.', order: 17 },
  { name: 'Bastipati Nagaraju Panchalingala', constituency: 'Kurnool', party: 'TDP', responsibilities: 'Orvakal industrial area, uranium mining issues, and Rayalaseema water.', order: 18 },
  { name: 'Ambica G. Lakshminarayana Valmiki', constituency: 'Anantapur', party: 'TDP', responsibilities: 'Leather industry, border trade, and drought relief.', order: 19 },
  { name: 'B.K. Parthasarathi', constituency: 'Hindupur', party: 'TDP', responsibilities: 'Industrial growth near Karnataka border and MSME support.', order: 20 },
  { name: 'Y.S. Avinash Reddy', constituency: 'Kadapa', party: 'YSRCP', responsibilities: 'Opposition MP — mining, irrigation, and Rayalaseema issues.', order: 21 },
  { name: 'Prabhakar Reddy Vemireddy', constituency: 'Nellore', party: 'TDP', responsibilities: 'Port expansion, pollution control, and aquaculture exports.', order: 22 },
  { name: 'Gurumoorthy Maddila', constituency: 'Tirupati (SC)', party: 'YSRCP', responsibilities: 'Tirumala infrastructure, tourism, and Chittoor employment.', order: 23 },
  { name: 'P.V. Midhun Reddy', constituency: 'Rajampet', party: 'YSRCP', responsibilities: 'Rail connectivity and Rayalaseema industrial growth.', order: 24 },
  { name: 'Daggumalla Prasada Rao', constituency: 'Chittoor (SC)', party: 'TDP', responsibilities: 'Mango exports, border industrial parks, and water sharing.', order: 25 }
];

export const courtAuthoritiesOfficial = [
  {
    name: 'Smt. Justice Lisa Gill',
    designation: 'Chief Justice of Andhra Pradesh',
    role: 'Chief Justice',
    responsibilities: 'Head of the AP High Court at Amaravati. Sworn in 25 April 2026. Assigns benches and leads judicial administration. Source: aphc.gov.in.'
  },
  {
    name: 'Sri Justice Cheekati Manavendranath Roy',
    designation: 'Judge, Andhra Pradesh High Court',
    role: 'Puisne Judge',
    responsibilities: 'Former Registrar General of AP High Court; hears civil, criminal, and constitutional matters as per roster.'
  },
  {
    name: 'Sri Justice Ravi Nath Tilhari',
    designation: 'Judge, Andhra Pradesh High Court',
    role: 'Puisne Judge',
    responsibilities: 'Hears writ petitions, appeals, and service matters assigned by the Chief Justice.'
  },
  {
    name: 'Sri Justice Rao Raghunandan Rao',
    designation: 'Judge, Andhra Pradesh High Court',
    role: 'Puisne Judge',
    responsibilities: 'Former Senior Advocate; handles commercial, constitutional, and regulatory matters.'
  },
  {
    name: 'Sri Justice Battu Devanand',
    designation: 'Judge, Andhra Pradesh High Court',
    role: 'Puisne Judge',
    responsibilities: 'Former Government Pleader; adjudicates matters across civil and criminal jurisdictions.'
  },
  {
    name: 'Sri Justice Donadi Ramesh',
    designation: 'Judge, Andhra Pradesh High Court',
    role: 'Puisne Judge',
    responsibilities: 'Former Special Government Pleader; hears service and revenue disputes.'
  },
  {
    name: 'Sri Justice B. Krishna Mohan',
    designation: 'Judge, Andhra Pradesh High Court',
    role: 'Puisne Judge',
    responsibilities: 'Participates in division and single-judge benches as per court roster.'
  },
  {
    name: 'Sri Justice K. Suresh Reddy',
    designation: 'Judge, Andhra Pradesh High Court',
    role: 'Puisne Judge',
    responsibilities: 'Elevated 2020; practices in civil, criminal, and constitutional matters.'
  },
  {
    name: 'Registrar General',
    designation: 'Registrar General, High Court of AP',
    role: 'Administrative Head',
    responsibilities: 'Chief administrative officer — case listing, registry, and court establishment. Source: aphc.gov.in.'
  },
  {
    name: 'Advocate General of Andhra Pradesh',
    designation: 'State Legal Representative',
    role: 'Government Pleader',
    responsibilities: 'Represents the State of Andhra Pradesh before the High Court through the Advocate General and government pleaders.'
  }
];

/** Sample MLA history — 2024 & 2019 terms for major districts (ECI results) */
export const mlaHistoryOfficial = [
  { districtName: 'Guntur', mlaName: 'Galla Madhavi', party: 'TDP', termPeriod: '2024–2029', majorityMargin: 'Guntur West — 2024', termRank: 1 },
  { districtName: 'Guntur', mlaName: 'Mohammed Naseer Ahmed', party: 'TDP', termPeriod: '2024–2029', majorityMargin: 'Guntur East — 2024', termRank: 1 },
  { districtName: 'Guntur', mlaName: 'Prathipati Pullarao', party: 'TDP', termPeriod: '2019–2024', majorityMargin: 'Chilakaluripet — previous term', termRank: 2 },
  { districtName: 'Visakhapatnam', mlaName: 'Palla Srinivas Rao', party: 'TDP', termPeriod: '2024–2029', majorityMargin: 'Gajuwaka — 2024', termRank: 1 },
  { districtName: 'Visakhapatnam', mlaName: 'Konathala Ramakrishna', party: 'JSP', termPeriod: '2024–2029', majorityMargin: 'Anakapalle — 2024', termRank: 1 },
  { districtName: 'Visakhapatnam', mlaName: 'Regam Matyalingam', party: 'YSRCP', termPeriod: '2024–2029', majorityMargin: 'Araku Valley (ST) — 2024', termRank: 1 },
  { districtName: 'YSR Kadapa', mlaName: 'Y.S. Jagan Mohan Reddy', party: 'YSRCP', termPeriod: '2019–2024', majorityMargin: 'Pulivendula — CM constituency', termRank: 2 },
  { districtName: 'YSR Kadapa', mlaName: 'Dasari Sudha', party: 'YSRCP', termPeriod: '2024–2029', majorityMargin: 'Badvel (SC) — 2024', termRank: 1 },
  { districtName: 'NTR', mlaName: 'Kesineni Nani', party: 'TDP', termPeriod: '2024–2029', majorityMargin: 'Vijayawada West — 2024', termRank: 1 },
  { districtName: 'NTR', mlaName: 'Radha Krishnayya Badeti', party: 'TDP', termPeriod: '2024–2029', majorityMargin: 'Eluru — 2024', termRank: 1 },
  { districtName: 'Chittoor', mlaName: 'Gurajala Jagan Mohan (GJM)', party: 'TDP', termPeriod: '2024–2029', majorityMargin: 'Chittoor — 2024', termRank: 1 },
  { districtName: 'Chittoor', mlaName: 'Nandamuri Balakrishna', party: 'TDP', termPeriod: '2024–2029', majorityMargin: 'Hindupur — 2024', termRank: 1 },
  { districtName: 'Sri Balaji (Tirupati)', mlaName: 'Gurumoorthy Maddila', party: 'YSRCP', termPeriod: '2024–2029 (MP)', majorityMargin: 'Tirupati LS — reference', termRank: 1 }
];

export const ministerOsdsOfficial = [
  { ministerName: 'N. Chandrababu Naidu', ministry: 'Chief Minister — General Administration', osdName: 'As per GAD posting', osdDetails: 'OSDs assist ministers with coordination, files, and policy briefs. Names are notified by government from time to time.' },
  { ministerName: 'Anitha Vangalapudi', ministry: 'Home Department', osdName: 'As per Home Department', osdDetails: 'Supports law and order, police, and disaster management coordination.' }
];
