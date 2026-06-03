/**
 * Grievance redressal (PGRS / Spandana) and WhatsApp Governance (Mana Mitra) reference content.
 * Bump GRIEVANCE_CONTENT_VERSION when official seed text changes (triggers DB refresh on server start).
 */

export const GRIEVANCE_CONTENT_VERSION = 2;

export const grievanceTopicsOfficial = [
  {
    title: 'Andhra Pradesh Grievance Redressal System (Spandana / PGRS) — Overview',
    icon: '🏛️',
    summary: 'One system for complaints against departments, schemes, delays, certificates, pensions, roads, and more.',
    content: `The Government of Andhra Pradesh uses the Spandana / Public Grievance Redressal System (PGRS) for citizens to raise complaints against government departments, officers, schemes, delays, corruption, public issues, certificates, pensions, roads, electricity, police matters, revenue issues, and related matters.

This is a "one-spot" platform linking:

• GSWS (Grama / Ward Sachivalayam)
• 1902 call centre (24×7)
• Web portal (pgrs.ap.gov.in / meekosam.ap.gov.in)
• Mobile app
• Spandana Monday at Collectorates
• CM Office monitoring

RTI applications are generally not handled through Spandana — use the RTI process separately.`
  },
  {
    title: 'Official portals & contact details',
    icon: '📞',
    summary: 'Portals, helplines 1902 & 1800-425-4440, and helpspandana-ap@ap.gov.in',
    content: `Main grievance portal — AP Spandana / PGRS:
• https://pgrs.ap.gov.in
• https://meekosam.ap.gov.in (CPGRAMS / state PGRS)

Government service information:
• AP government services portal — grievance registration section (search "AP grievance registration" on ap.gov.in)

Grievance status check:
• Track on pgrs.ap.gov.in or meekosam.ap.gov.in using your YSR# / grievance ID

Helpline numbers:
• Toll-free: 1902 (primary — Jaganannaku Chebudham / CM PGRS)
• Alternate toll-free: 1800-425-4440

Email:
• helpspandana-ap@ap.gov.in
• pgrs-helpdesk@ap.gov.in (PGRS helpdesk)
• jkchelpdesk-ap@ap.gov.in (CM helpdesk)

Office (CMGRS): Block 1, Secretariat, Velagapudi, Amaravati, Andhra Pradesh`
  },
  {
    title: 'What type of complaints can be raised?',
    icon: '📋',
    summary: 'Revenue, police, municipal, welfare, pensions, roads, electricity, and more.',
    content: `You can file grievances related to:

• Revenue Department (land, pattadar passbook, certificates)
• Police Department (law & order, harassment — not substitute for FIR in serious crimes)
• Municipal Administration (tax, drains, town planning)
• Panchayat Raj (village roads, rural issues)
• Roads & Buildings (R&B)
• Electricity (DISCOM bills, connections, outages)
• Water Supply
• Welfare Schemes & pension delays
• Ration card problems
• Land disputes & encroachments
• Corruption complaints against government staff
• Delay in certificates (income, caste, residence, etc.)
• Education (schools, scholarships)
• Health (hospitals, Aarogyasri / NTR Vaidya Seva)
• Transport & APSRTC
• Housing & TIDCO
• Agriculture & horticulture schemes
• Village / Ward Secretariat service denial
• Government employee misconduct

Choose the correct department when filing so the complaint routes to the right officer.`
  },
  {
    title: 'Departments connected to PGRS (30+ major departments)',
    icon: '🏢',
    summary: 'Complaints auto-route to Revenue, Police, Municipal, Welfare, Education, Health, and others.',
    content: `The grievance system is integrated with almost all Andhra Pradesh government departments. Major departments connected include:

• Revenue Department
• Home / Police Department
• Municipal Administration & Urban Development
• Panchayat Raj & Rural Development
• Energy Department
• Water Resources / Irrigation
• Education & Higher Education
• Health & Family Welfare
• Women & Child Welfare
• Social Welfare, BC Welfare, SC Welfare, ST Welfare, Minority Welfare
• Housing Department
• Agriculture, Horticulture, Fisheries
• Transport & APSRTC
• Civil Supplies (ration)
• Labour Department
• Registration & Stamps, Endowments
• Forest Department
• Industries & IT
• Collectorates & Village/Ward Secretariat System
• CM Office Monitoring Cell

There are usually 30+ major departments and hundreds of subordinate offices. Complaints are routed automatically to the concerned authority at district or mandal level.`
  },
  {
    title: 'Method 1 — Online portal: complete step-by-step (Steps 1–8)',
    icon: '💻',
    summary: 'Best method — register on portal, fill details, select department, upload proof, get YSR# number.',
    content: `Step 1 — Open portal
Visit https://pgrs.ap.gov.in or https://meekosam.ap.gov.in

Step 2 — Login / authentication
Usually through:
• Mobile OTP
• Aadhaar-based authentication
• Citizen credentials (if already registered)

Step 3 — Click "Register Grievance"
Choose options such as: New Complaint / Public Grievance / Lodge Complaint

Step 4 — Fill citizen details
Enter:
• Name
• Mobile number
• Aadhaar (optional or required depending on module)
• Address, District, Mandal, Village/Ward

Step 5 — Select department
Choose the department related to your issue.
Examples:
• Land issue → Revenue
• Police harassment → Home Department
• Pension delay → Welfare Department
• Road issue → Panchayat Raj / R&B

Step 6 — Write complaint clearly
Mention: problem, date, officer name (if any), location, supporting facts.
Best format:
• What happened
• Since when
• Which office/officer involved
• What action you want

Step 7 — Upload supporting documents (optional)
Aadhaar copy, photos, certificates, applications, receipts, screenshots.

Step 8 — Submit complaint
After submission a unique complaint number is generated — often called YSR# (Your Spandana Request Number). Save this carefully for all follow-up and tracking.`
  },
  {
    title: 'What happens after submission (internal workflow)',
    icon: '⚙️',
    summary: 'Registration → routing → GRA assignment → field enquiry → action → closure.',
    content: `1. Complaint registration
System generates YSR#, timestamp, and department mapping.

2. Routing to department
Complaint goes automatically to district office, mandal office, or concerned department officer.

3. Assignment to GRA (Grievance Redressal Authority)
GRA officer reviews complaint, sends to subordinate, requests field verification.

4. Field enquiry
Officials may visit location, call complainant, verify documents, seek reports from local officers.

5. Action taken
Possible actions: service approval, file movement, official warning, order issuance, resolution update, or rejection with remarks.

6. Closure
Complaint marked: Resolved / Closed / Rejected / Action Taken.
Citizen usually receives SMS update and portal status update.

If not satisfied — reopen grievance online, call 1902, visit Secretariat/Collectorate, or file escalation complaint (reopened cases go to higher authorities).`
  },
  {
    title: 'Other ways to file complaints (Call, Secretariat, Spandana Monday, App)',
    icon: '📱',
    summary: '1902 call centre, Grama/Ward Sachivalayam, Monday Collectorate hearings, mobile app.',
    content: `1. Call centre — Dial 1902 or 1800-425-4440
Operator registers complaint, generates YSR#, sends SMS acknowledgement.

2. Grama / Ward Sachivalayam
Visit nearest Village Secretariat or Ward Secretariat. Staff enter your complaint into the PGRS system (often 3:00 PM – 5:00 PM on working days).

3. Spandana Monday programme
Every Monday at District Collectorates, Revenue offices, and Police offices — public grievance hearings. Submit petitions physically to Collector or Joint Collector.

4. Mobile app
AP PGRS / Spandana mobile app (Android) — same registration and tracking as web portal.

5. Physical petition at Collectorate
For urgent or complex cases, attend Spandana Monday with copies of all documents.`
  },
  {
    title: 'Track status, timelines & escalation levels',
    icon: '🔍',
    summary: 'Track with YSR# on portal; 7–15 days simple issues; escalation up to CMO and beyond.',
    content: `How to track complaint status
Visit pgrs.ap.gov.in or meekosam.ap.gov.in → Track Grievance Status.
Enter YSR# and mobile number if required.

Status examples: Pending | Under Process | Sent to Officer | Action Taken | Closed

Typical resolution time (varies by department & verification):
• Simple issues: 7–15 days
• Revenue / land matters: 30–90 days
• Police / legal matters: varies

Escalation levels (if no action):
• Level 1 — Mandal Officer
• Level 2 — District Officer
• Level 3 — District Collector
• Level 4 — Department Head (Secretary level)
• Level 5 — CMO Monitoring Cell
• Level 6 — CPGRAMS / Court / Lokayukta (outside Spandana)

Always keep YSR#, SMS messages, and uploaded documents for appeals.`
  }
];

export const whatsappServicesOfficial = [
  {
    title: 'Mana Mitra — WhatsApp Governance (official number)',
    icon: '💬',
    summary: 'Save 9552300009, send "Hi", choose English or Telugu, then pick a service from the menu.',
    content: `Andhra Pradesh launched WhatsApp Governance under the name Mana Mitra (మనా మిత్ర) — government services through WhatsApp chat.

Official WhatsApp number: +91 9552300009

How to start:
1. Save 9552300009 in your phone contacts as "Mana Mitra" or "AP Government WhatsApp"
2. Open WhatsApp and send the message: Hi
3. Select language: English or Telugu
4. Choose "Select Service" or pick a department from the menu
5. Follow the chat prompts (Aadhaar, mobile, or application details where required)
6. Receive receipts, status updates, and certificates on WhatsApp / SMS

Mana Mitra connects dozens of departments. Services expanded over time (161+ in first phase; 700+ services reported in later updates). Always use only the official government number above.`
  },
  {
    title: 'Revenue & certificate services on WhatsApp',
    icon: '📜',
    summary: 'Income, caste, land records, marriage certificate, ROR, and related revenue services.',
    content: `Through Mana Mitra you can apply for or track many Revenue department services, including:

• Income Certificate / Re-issuance of Income Certificate
• Integrated Certificate / Family Member Certificate
• OBC Certificate, EWS Certificate, No Earning Member Certificate
• Agriculture Income Certificate
• ROR-1B, Computerized Adangal, Title Deed cum Passbook
• Marriage Certificate
• Encumbrance certificate (EC) related services
• Water tax and property-related queries

You select Revenue Services from the department list, choose the certificate type, enter Aadhaar and other details as prompted, and pay online if fees apply. Approved documents are delivered digitally.`
  },
  {
    title: 'Municipal, energy, transport & civic services',
    icon: '🏙️',
    summary: 'Property tax, electricity bills, APSRTC tickets, and municipal complaints.',
    content: `Mana Mitra also covers everyday civic needs:

• CDMA / Municipal: Know your dues, pay property tax, check application status
• Energy (DISCOM): View bills, pay bills, register and track electricity complaints
• APSRTC: Bus ticket booking and cancellation
• Police: Lost document / articles certificate and related citizen services
• PGRS on WhatsApp: Lodge grievance, check grievance status, give feedback
• CM Relief Fund: Donation / application using mobile, Aadhaar, or CMRF ID
• Civil Supplies: Deepam (LPG) status and ration-related queries

These services reduce visits to offices — useful for students and families in both urban and rural areas.`
  },
  {
    title: 'Temple darshan, health & welfare on WhatsApp',
    icon: '🛕',
    summary: 'Tirumala and other temple bookings, NTR Vaidya Seva, education hall tickets.',
    content: `Other popular Mana Mitra service categories:

• Temple / Endowments: Darshan and accommodation booking for Tirumala (Srivari), Srisailam, Simhachalam, Vijayawada Kanaka Durga, Annavaram, Dwaraka Tirumala, Srikalahasti, and more
• Health: NTR Vaidya Seva card status and updates
• Education: Hall ticket download and related student services
• Agriculture & horticulture: Scheme information and farmer-related services
• Welfare schemes: Various department menus for subsidies and eligibility checks

Response time: Simple queries may be answered within 24 hours; field verification (e.g. land EC, road repair) can take 30–45 days. You receive ticket / reference numbers in chat for tracking.`
  },
  {
    title: 'Tips for using WhatsApp governance safely',
    icon: '🔒',
    summary: 'Use only the official number; never share OTPs or passwords with unknown chats.',
    content: `• Use only +91 9552300009 — verify the green business badge where shown
• Do not share OTP, PIN, or bank passwords in any chat claiming to be government
• Keep Aadhaar and mobile number ready; some services require Aadhaar authentication
• Save chat receipts and reference numbers for follow-up
• For issues not available on WhatsApp, use PGRS helpline 1902 or visit your Ward Secretariat
• GSWS staff conduct awareness campaigns (e.g. Friday outreach) — ask at your local Sachivalayam for help registering on Mana Mitra

WhatsApp governance is designed for digital Andhra Pradesh — learn it as a modern civic skill alongside traditional grievance channels.`
  }
];
