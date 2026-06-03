import { readDb, writeDb, generateId } from './db.js';

const db = readDb();
db.quizQuestions = db.quizQuestions || [];

const existing = new Set(db.quizQuestions.map((q) => String(q.question || '').trim().toLowerCase()));

function add(question, options, correctAnswer, explanation = '') {
  const key = String(question).trim().toLowerCase();
  if (existing.has(key)) return;
  existing.add(key);
  db.quizQuestions.push({
    id: generateId(),
    question,
    options,
    correctAnswer,
    explanation,
    active: true,
    createdAt: new Date().toISOString()
  });
}

// Fundamental Rights
add('Which article range covers the Right to Equality?', ['Articles 14–18', 'Articles 19–22', 'Articles 23–24', 'Articles 25–28'], 'Articles 14–18', 'Right to Equality is covered under Articles 14 to 18.');
add('Which right includes freedom of speech and expression?', ['Right to Equality', 'Right to Freedom', 'Right against Exploitation', 'Right to Education'], 'Right to Freedom', 'Right to Freedom includes freedoms in Article 19.');
add('Prohibition of human trafficking is part of which right?', ['Right against Exploitation', 'Right to Religion', 'Cultural and Educational Rights', 'Right to Property'], 'Right against Exploitation', 'Articles 23–24 prohibit trafficking and forced labour.');
add('Freedom of religion is covered under which articles?', ['Articles 25–28', 'Articles 14–18', 'Articles 19–22', 'Articles 29–30'], 'Articles 25–28', 'Right to Freedom of Religion is Articles 25 to 28.');
add('Cultural and educational rights are under which articles?', ['Articles 29–30', 'Articles 25–28', 'Articles 14–18', 'Articles 23–24'], 'Articles 29–30', 'Cultural and Educational Rights are Articles 29 and 30.');

// Government & Legislature basics
add('Who is the head of the state government in Andhra Pradesh?', ['Governor', 'Chief Minister', 'Speaker', 'Chief Justice'], 'Chief Minister', 'The Chief Minister heads the elected state government.');
add('Who presides over sessions of the Andhra Pradesh Legislative Assembly?', ['Governor', 'Speaker', 'Chief Minister', 'District Collector'], 'Speaker', 'The Speaker conducts Assembly business and maintains order.');
add('How many constituencies are there in the Andhra Pradesh Legislative Assembly?', ['175', '150', '200', '234'], '175', 'Andhra Pradesh has 175 Assembly constituencies.');
add('Which house represents states in the Parliament of India?', ['Lok Sabha', 'Rajya Sabha', 'Legislative Assembly', 'Legislative Council'], 'Rajya Sabha', 'Rajya Sabha is the Council of States.');
add('Members of Lok Sabha are elected by', ['State legislatures', 'The people (direct election)', 'The President', 'The Supreme Court'], 'The people (direct election)', 'Lok Sabha members are directly elected by voters.');

// Local administration
add('Who is the administrative head of a district?', ['District Collector', 'MLA', 'MP', 'Speaker'], 'District Collector', 'The District Collector leads civil administration.');
add('Who is responsible for law and order in a district police administration?', ['Superintendent of Police (SP)', 'District Collector', 'MRO', 'Mayor'], 'Superintendent of Police (SP)', 'SP heads the district police (law and order).');
add('Mandals are managed by which officer?', ['Mandal Revenue Officer (MRO)', 'District Collector', 'Governor', 'Speaker'], 'Mandal Revenue Officer (MRO)', 'MRO is the key administrative officer at mandal level.');

// Helplines
add('Which helpline number is for police emergency in India?', ['100', '101', '102', '1098'], '100', '100 is for Police emergencies (legacy).');
add('Which helpline number is for fire emergencies?', ['100', '101', '102', '1098'], '101', '101 is the Fire emergency number (legacy).');
add('1098 is known as', ['Women Helpline', 'Child Helpline', 'Ambulance', 'Cyber Crime'], 'Child Helpline', '1098 is the Child Helpline.');

// Constitution / civics quick checks
add('The Constitution of India is the', ['Supreme law of the land', 'A school rule book', 'A newspaper', 'A local ordinance only'], 'Supreme law of the land', 'It is the supreme law of India.');
add('A fundamental duty is', ['A responsibility of citizens', 'A power of the Governor', 'A court procedure', 'A school exam'], 'A responsibility of citizens', 'Fundamental Duties describe responsibilities of citizens.');
add('The judiciary’s main job is to', ['Make laws', 'Execute laws', 'Interpret laws and deliver justice', 'Run elections'], 'Interpret laws and deliver justice', 'Courts interpret laws and ensure justice.');

// Andhra Pradesh-specific quick checks (safe general)
add('Andhra Pradesh is a state in', ['Northern India', 'Southern India', 'Western India', 'North-Eastern India'], 'Southern India', 'Andhra Pradesh is in South India.');
add('Which of the following is a famous temple town in Andhra Pradesh?', ['Tirupati', 'Shimla', 'Guwahati', 'Jaipur'], 'Tirupati', 'Tirupati is widely known for Sri Venkateswara Temple.');

// More mixed questions (easy/medium)
add('A bill becomes a law after it is', ['Passed by the legislature and gets assent', 'Only announced in school', 'Posted on social media', 'Signed by a district collector only'], 'Passed by the legislature and gets assent', 'Bills require passage and assent as per procedure.');
add('Elections help citizens to', ['Choose representatives', 'Stop all laws', 'Close schools', 'Remove the Constitution'], 'Choose representatives', 'Elections are for choosing representatives.');
add('The right to vote in India is given to citizens who are', ['18 years and above', '10 years and above', 'Only government employees', 'Only students'], '18 years and above', 'Voting age is 18.');

writeDb(db);
console.log(`Quiz seed complete. Total questions: ${db.quizQuestions.length}`);

