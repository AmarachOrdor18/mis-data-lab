
// ─── CONFIG ───────────────────────────────────────────────
const API_URL = '/api/chat'; // Vercel serverless route
const MODEL = 'google/gemini-2.0-flash-exp:free'; // free model on OpenRouter
const TOTAL_CREDIT_BUDGET = 200000; // lifetime free-tier token estimate
const WARN_THRESHOLD = 0.6; // show warning at 60%
const CRIT_THRESHOLD = 0.85;

// ─── LESSON CACHE ─────────────────────────────────────────
const CACHE_KEY = 'mis_lesson_cache_v1';
let lessonCache = {};
try { lessonCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch(e) {}
function cacheKey(topic, sub, type) { return `${topic}::${sub}::${type}`; }
function getCached(topic, sub, type) { return lessonCache[cacheKey(topic, sub, type)] || null; }
function setCache(topic, sub, type, text) {
  lessonCache[cacheKey(topic, sub, type)] = text;
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(lessonCache)); } catch(e) {}
}

const TOPICS = {
  'Power BI & Visualization': [
    'Connecting to Data Sources',
    'Data Cleaning in Power Query',
    'DAX Basics (Calculated Columns vs Measures)',
    'Building Interactive Dashboards',
    'Publishing & Workspaces',
    'Milestone Project'
  ],
  'dbt & Modeling': [
    'Modern Data Modeling',
    'Tables vs Views',
    'Writing Tests for Data',
    'Documentation: The Data Dictionary',
    'Career: The Analytics Engineer',
    'Milestone Project'
  ],
  'Python': [
    'Variables & Data Types',
    'Lists, Dicts & Loops',
    'Functions',
    'Reading & Writing Files',
    'Pandas Basics',
    'DataFrames & Filtering',
    'The Requests Library',
    'Writing Automation Scripts',
    'Error Handling',
    'Milestone Project'
  ],
  'ETL Pipelines': [
    'What is ETL? (Plain English)',
    'The Extract Phase',
    'Cleaning & Transforming Data',
    'Loading into a Warehouse',
    'Handling Pipeline Failures',
    'Incremental vs Full Loads',
    'ETL vs ELT',
    'ETL in a Real Nigerian Bank',
    'Milestone Project'
  ],
  'Apache Airflow': [
    'What is Airflow & Why it Exists',
    'DAGs - The Big Picture',
    'Operators & Tasks',
    'Scheduling with Cron',
    'Task Dependencies',
    'XCom: Passing Data Between Tasks',
    'Monitoring & Alerts',
    'Real Pipeline Examples',
    'Milestone Project'
  ],
  'APIs & REST': [
    'What is an API? (Really)',
    'HTTP Methods - GET, POST, PUT, DELETE',
    'JSON: The Language of APIs',
    'API Keys & Authentication',
    'Pulling Data into Python',
    'Handling Errors & Timeouts',
    'Pagination - Getting All the Data',
    'APIs in Banking & Fintech',
    'Milestone Project'
  ],
  'Cloud Computing': [
    'Cloud Basics for MIS',
    'AWS, Azure, & Google Cloud',
    'S3: Storing Data in the Sky',
    'Lambda: Functions without Servers',
    'Milestone Project'
  ]
};
const PROG_MAP = {'Power BI & Visualization':'pbi','dbt & Modeling':'dbt','Python':'python','Apache Airflow':'airflow','APIs & REST':'api','ETL Pipelines':'etl','Cloud Computing':'cloud'};

// ─── STATE ────────────────────────────────────────────────
let S = {
  xp:0, streak:0, lessons:0, qCorrect:0, qTotal:0,
  topic:null, sub:null,
  quizMode:'practice', quizTopics:['Python','ETL Pipelines'], quizDiff:['Entry Level'],
  qIdx:0, qC:0, qW:0, qSk:0, qTimes:[], qStart:0, timerInt:null, timerSec:90, answered:false,
  prog:{}, lessonText:'', isSpeaking:false,
  tokensUsedTotal:0
};

// Load saved state
try {
  const saved = JSON.parse(localStorage.getItem('mis_state_v2') || 'null');
  if (saved) {
    Object.assign(S, saved);
  }
} catch(e) {}

function save() {
  try { localStorage.setItem('mis_state_v2', JSON.stringify(S)); } catch(e) {}
}

function todayKey() {
  return new Date().toISOString().slice(0,10);
}

// ─── TOKEN TRACKING ───────────────────────────────────────
function addTokens(n) {
  S.tokensUsedTotal += n;
  updateTokenUI();
  save();
}

function updateTokenUI() {
  const used = S.tokensUsedTotal;
  const pct = used / TOTAL_CREDIT_BUDGET;
  const pill = document.getElementById('token-pill');
  const banner = document.getElementById('token-banner');

  if (pct < WARN_THRESHOLD) {
    pill.className = 'pill pill-tokens ok';
    pill.textContent = '⬡ tokens ok';
    banner.classList.remove('show');
  } else if (pct < CRIT_THRESHOLD) {
    pill.className = 'pill pill-tokens warn';
    pill.textContent = `⚠ ${Math.round(pct*100)}% used`;
    banner.classList.add('show');
    document.getElementById('banner-used').textContent = `${Math.round(pct*100)}%`;
  } else {
    pill.className = 'pill pill-tokens crit';
    pill.textContent = `🔴 limit near`;
    banner.classList.add('show');
    document.getElementById('banner-used').textContent = `${Math.round(pct*100)}%`;
  }
}

function showTokenInfo() {
  const used = S.tokensUsedTotal;
  const pct = Math.round(used / TOTAL_CREDIT_BUDGET * 100);
  const cached = Object.keys(lessonCache).length;
  alert(`Credit Usage\n\nEstimated used: ~${used.toLocaleString()} tokens (${pct}%)\nCached lessons: ${cached} (these won't use credits again)\nModel: Free tier (Gemini Flash)\n\nTip: Lessons you've already generated are saved locally. Revisiting them costs zero credits. Use the Regenerate button only when you want fresh content.`);
}

// ─── NAVIGATION ───────────────────────────────────────────
function nav(s) {
  document.querySelectorAll('.screen').forEach(x=>x.classList.remove('on'));
  document.getElementById('screen-'+s).classList.add('on');
  document.querySelectorAll('.nb').forEach((b,i)=>b.classList.toggle('on',['home','learn','quiz'][i]===s));
}

function updateHdr() {
  document.getElementById('xp-pill').textContent = '⚡ '+S.xp+' XP';
  document.getElementById('streak-pill').textContent = S.streak+'🔥';
  document.getElementById('h-lessons').textContent = S.lessons;
  document.getElementById('h-xp').textContent = S.xp;
  document.getElementById('h-streak').textContent = S.streak;
  const acc = S.qTotal ? Math.round(S.qCorrect/S.qTotal*100)+'%' : '-';
  document.getElementById('h-acc').textContent = acc;
  updateProgress();
  updateTokenUI();
}

function addXP(n) { S.xp += n; updateHdr(); save(); }

function updateProgress() {
  Object.keys(S.prog).forEach(k => {
    const v = S.prog[k] || 0;
    const fill = document.getElementById('pp-'+k);
    const pct = document.getElementById('pct-'+k);
    if (fill) fill.style.width = v+'%';
    if (pct) pct.textContent = v+'%';
  });
}

// ─── SIDEBAR / TOPIC SELECTOR ─────────────────────────────
function buildSidebar() {
  const sb = document.getElementById('sidebar');
  sb.innerHTML = '';
  Object.keys(TOPICS).forEach(t => {
    const b = document.createElement('button');
    b.className = 'sb-btn' + (S.topic === t ? ' on' : '');
    b.textContent = t;
    b.onclick = () => selectTopic(t);
    sb.appendChild(b);
  });
}

function selectTopic(t) {
  S.topic = t; S.sub = null;
  buildSidebar();
  const cr = document.getElementById('chip-row');
  cr.innerHTML = '';
  
  // Disable buttons until a subtopic is chosen
  document.getElementById('gen-btn').disabled = true;
  document.getElementById('scen-btn').disabled = true;

  TOPICS[t].forEach(s => {
    const c = document.createElement('div');
    c.className = 'chip';
    c.textContent = s;
    c.onclick = () => {
      S.sub = s;
      document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));
      c.classList.add('on');
      // Enable buttons
      document.getElementById('gen-btn').disabled = false;
      document.getElementById('scen-btn').disabled = false;
    };
    cr.appendChild(c);
  });
}

function goLearn(t) { nav('learn'); selectTopic(t); }

// ─── AI CALL ──────────────────────────────────────────────
async function callAI(prompt, maxTokens = 900) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  const data = await res.json();

  // Track token usage
  if (data.usage) {
    const total = (data.usage.prompt_tokens || 0) + (data.usage.completion_tokens || 0);
    addTokens(total);
  } else {
    // Estimate if usage not returned
    addTokens(Math.round(prompt.length / 4) + maxTokens);
  }

  if (data.error) throw new Error(data.error.message || 'API error');
  return data.choices?.[0]?.message?.content || data.content?.[0]?.text || '';
}

// ─── LESSON GENERATION ────────────────────────────────────
async function generateLesson(forceNew = false) {
  if (!S.topic) { alert('Choose a topic first'); return; }
  const sub = S.sub || TOPICS[S.topic][0];

  // 1. Check STATIC_CONTENT first (Zero Cost)
  if (!forceNew && typeof STATIC_CONTENT !== 'undefined' && STATIC_CONTENT[S.topic]?.[sub]?.lesson) {
    const text = STATIC_CONTENT[S.topic][sub].lesson;
    S.lessonText = text;
    renderLesson(text, true);
    document.getElementById('regen-btn').style.display = 'inline-flex';
    return;
  }

  // 2. Check Browser Cache
  if (!forceNew) {
    const cached = getCached(S.topic, sub, 'lesson');
    if (cached) {
      S.lessonText = cached;
      renderLesson(cached, true);
      document.getElementById('regen-btn').style.display = 'inline-flex';
      return;
    }
  }

  setLoading(true);
  document.getElementById('regen-btn').style.display = 'none';

  const prompt = `You are a Senior Data Engineer directly mentoring a Nigerian university student studying MIS. She already knows Excel, SQL, and Power BI. You are teaching her "${sub}" in "${S.topic}".

Do NOT just give a high-level overview. You must actually TEACH her how to do it, step by step, with deep explanations and code.

Use this exact structure:

## Why are we learning ${sub}?
Explain the concept in 2-3 sentences. Tell her exactly why this is critical for a data engineer to know, comparing it to things she already knows (like Excel or SQL).

## Step-by-Step Tutorial
Break the concept down into 3 or 4 clear, actionable steps. For each step:
1. Explain *what* you are doing.
2. Explain *why* you are doing it.
3. Provide the exact code block (Python/SQL/etc).
Do not just dump code. Teach it line by line.

## Let's look at a Real Business Example
Walk through a complete, realistic scenario in an African/Nigerian context (e.g., a Fintech, Telecom, or Logistics company). Show exactly how you would apply this concept to solve their specific data problem, complete with the final code snippet.

## Common Mistakes to Avoid
List 2 or 3 beginner mistakes people make with this topic and how she can avoid them.

Write in a warm, encouraging, conversational tone, like you are pair-programming with her. No fluff, no academic jargon.`;

  try {
    const text = await callAI(prompt, 1000);
    setCache(S.topic, sub, 'lesson', text);
    S.lessonText = text;
    renderLesson(text);
    S.lessons++;
    addXP(15);
    const k = PROG_MAP[S.topic];
    if (k) { S.prog[k] = Math.min((S.prog[k]||0)+14, 100); updateProgress(); }
    save();
    document.getElementById('regen-btn').style.display = 'inline-flex';
  } catch(e) {
    document.getElementById('lesson-panel').innerHTML = `<p style="color:var(--red)">Couldn't load lesson: ${e.message}</p>`;
  }
  setLoading(false);
}

async function generateScenario(forceNew = false) {
  if (!S.topic) { alert('Choose a topic first'); return; }
  const sub = S.sub || TOPICS[S.topic][0];

  // 1. Check STATIC_CONTENT first (Zero Cost)
  if (!forceNew && typeof STATIC_CONTENT !== 'undefined' && STATIC_CONTENT[S.topic]?.[sub]?.scenario) {
    const text = STATIC_CONTENT[S.topic][sub].scenario;
    S.lessonText = text;
    renderLesson(text, true);
    return;
  }

  // 2. Check Browser Cache
  if (!forceNew) {
    const cached = getCached(S.topic, sub, 'scenario');
    if (cached) {
      S.lessonText = cached;
      renderLesson(cached, true);
      return;
    }
  }

  setLoading(true);

  const prompt = `You're a senior data engineer mentoring a Nigerian MIS student. Drop her into a real work scenario involving "${sub}" from "${S.topic}". Write like you're talking to a smart junior colleague, warm but direct.

Use this structure:

## Scenario: [Give it a punchy real title like "The Missing Morning Report" or "3am Pipeline Crash at GT Bank"]

**The situation:** Set the scene. A real company in Nigeria or Africa (a bank, telecom, FMCG company, fintech). Describe the business context, the stakeholders waiting, and what just went wrong. 4-5 sentences. Be specific: what data, what system, who's affected.

**What you're seeing:** Describe exactly what the junior engineer (her) finds when she logs in. Error messages, empty dashboards, angry Slack messages. Make it vivid.

**Your job:** Two or three specific tasks she needs to figure out.

**Code to look at:**
Provide a code snippet with a bug or gap she needs to spot and think about.

**Think through these:**
Three questions she should answer. Connect at least one to MIS principles: data integrity, system reliability, stakeholder trust.

**What the solution looks like:**
Walk through the right approach clearly. Tell her what a senior engineer would do. 4-5 sentences. This is where the learning happens, make it satisfying to read.

Write warmly. Make it feel real, not like a textbook exercise.`;

  try {
    const text = await callAI(prompt, 1100);
    setCache(S.topic, sub, 'scenario', text);
    S.lessonText = text;
    renderLesson(text);
    S.lessons++;
    addXP(20);
    const k = PROG_MAP[S.topic];
    if (k) { S.prog[k] = Math.min((S.prog[k]||0)+14, 100); updateProgress(); }
    save();
  } catch(e) {
    document.getElementById('lesson-panel').innerHTML = `<p style="color:var(--red)">Couldn't load scenario: ${e.message}</p>`;
  }
  setLoading(false);
}

async function answerVoiceQuestion(question) {
  if (!question.trim()) return;
  setLoading(true);
  const context = S.topic ? `The student is currently studying "${S.sub || S.topic}" in "${S.topic}".` : '';

  const prompt = `You're a friendly data engineering tutor for an MIS student. ${context}
  
She just asked (by voice): "${question}"

Answer her question directly and conversationally, like a smart friend, not a textbook. Keep it under 200 words. Use plain English. If her question mentions something technical, explain the concept first then answer. End with one practical tip she can remember.`;

  try {
    const text = await callAI(prompt, 500);
    renderLesson('## Your Question\n\n*"' + question + '"*\n\n' + text);
    speakText(text);
  } catch(e) {
    document.getElementById('lesson-panel').innerHTML = `<p style="color:var(--red)">Couldn't answer: ${e.message}</p>`;
  }
  setLoading(false);
}

function setLoading(on) {
  document.getElementById('gen-btn').disabled = on;
  document.getElementById('scen-btn').disabled = on;
  document.getElementById('gen-btn').textContent = on ? '⏳ LOADING...' : '▶ LESSON';
  if (on) {
    document.getElementById('lesson-panel').innerHTML = '<div class="loading"><div class="ldot"></div><div class="ldot"></div><div class="ldot"></div><span>AI is writing your lesson...</span></div>';
  }
}

// ─── MARKDOWN RENDERER ────────────────────────────────────
function renderLesson(text, isCached = false) {
  let html = text
    .replace(/```[\w]*\n([\s\S]*?)```/g, (_, c) => `<pre>${esc(c.trim())}</pre>`)
    .replace(/`([^`]+)`/g, (_, c) => `<code>${esc(c)}</code>`)
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^\*\*(.+?)\*\*$/gm, '<h3>$1</h3>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Inject cache badge into first heading if cached
  if (isCached) {
    html = html.replace(/<\/h2>/, ' <span class="cache-badge">Saved</span></h2>');
  }

  // wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>(\n|$))+/g, m => `<ul>${m}</ul>`);
  // wrap paragraphs
  html = html.split('\n\n').map(chunk => {
    chunk = chunk.trim();
    if (!chunk) return '';
    if (/^<[hup]|^<li/.test(chunk)) return chunk;
    return `<p>${chunk}</p>`;
  }).join('\n');

  const panel = document.getElementById('lesson-panel');
  panel.innerHTML = html;

  // Add speak button at bottom
  const speakRow = document.createElement('div');
  speakRow.className = 'speak-row';
  speakRow.innerHTML = `
    <button class="speak-btn" id="speak-toggle" onclick="toggleSpeak()">🔊 Read Aloud</button>
    <button class="speak-btn" onclick="speakStop()">⏹ Stop</button>
    <button class="speak-btn quiz-jump-btn" onclick="quickQuiz()">✍️ Take Quick Quiz</button>
    <button class="speak-btn next-sub-btn" onclick="nextSubtopic()" style="background:var(--accent);color:#000">⏭️ Next Subtopic</button>
    <span style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-left:auto">AI voice (female)</span>
  `;
  panel.appendChild(speakRow);
}

function nextSubtopic() {
  if (!S.topic || !S.sub) return;
  const subs = TOPICS[S.topic];
  const idx = subs.indexOf(S.sub);
  if (idx >= 0 && idx < subs.length - 1) {
    S.sub = subs[idx + 1];
    
    // Highlight correct chip visually
    document.querySelectorAll('.chip').forEach(x => {
      if (x.textContent === S.sub) x.classList.add('on');
      else x.classList.remove('on');
    });
    
    // Auto-generate lesson
    generateLesson();
    document.getElementById('lesson-panel').scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("You've reached the end of this module! Try the Quiz tab.");
  }
}

function quickQuiz() {
  nav('quiz');
  // Scroll to top of quiz panel
  document.getElementById('q-content').scrollIntoView({ behavior: 'smooth' });
  loadQ(S.topic, S.sub);
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ─── VOICE: TEXT-TO-SPEECH ────────────────────────────────
let currentUtterance = null;

function speakText(text) {
  if (!window.speechSynthesis) return;
  speakStop();
  // Strip markdown for speech
  const clean = text
    .replace(/```[\s\S]*?```/g, 'code example')
    .replace(/`[^`]+`/g, '')
    .replace(/[#\*\_]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  currentUtterance = new SpeechSynthesisUtterance(clean);
  currentUtterance.rate = 0.92;
  currentUtterance.pitch = 1.05;
  currentUtterance.volume = 1;

  // Pick a female voice
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v =>
    /female|woman|girl|fiona|victoria|samantha|karen|moira|tessa|veena|zira|hazel|susan/i.test(v.name)
  ) || voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('f'));

  if (femaleVoice) currentUtterance.voice = femaleVoice;

  currentUtterance.onstart = () => {
    S.isSpeaking = true;
    const btn = document.getElementById('speak-toggle');
    if (btn) btn.classList.add('speaking');
  };
  currentUtterance.onend = () => {
    S.isSpeaking = false;
    const btn = document.getElementById('speak-toggle');
    if (btn) btn.classList.remove('speaking');
  };

  window.speechSynthesis.speak(currentUtterance);
}

function speakStop() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  S.isSpeaking = false;
  const btn = document.getElementById('speak-toggle');
  if (btn) btn.classList.remove('speaking');
}

function toggleSpeak() {
  if (S.isSpeaking) {
    speakStop();
  } else if (S.lessonText) {
    speakText(S.lessonText);
  }
}

// Reload voices after they async-load in some browsers
window.speechSynthesis && window.speechSynthesis.addEventListener('voiceschanged', () => {});

// ─── VOICE: SPEECH-TO-TEXT ────────────────────────────────
let recognition = null;
let isListening = false;

function toggleVoice() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Voice input not supported in this browser. Try Chrome.');
    return;
  }
  if (isListening) {
    stopListening();
  } else {
    startListening();
  }
}

function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'en-NG'; // Nigerian English
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  const btn = document.getElementById('voice-btn');
  const transcript = document.getElementById('voice-transcript');
  btn.classList.add('listening');
  btn.textContent = '🔴';
  transcript.classList.add('show');
  transcript.textContent = 'Listening... (speak your question)';
  isListening = true;

  recognition.onresult = (e) => {
    let text = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      text += e.results[i][0].transcript;
    }
    transcript.textContent = '🎤 ' + text;
    if (e.results[e.results.length - 1].isFinal) {
      stopListening();
      answerVoiceQuestion(text);
    }
  };

  recognition.onerror = (e) => {
    transcript.textContent = 'Mic error: ' + e.error + '. Try again.';
    stopListening();
  };

  recognition.onend = () => {
    if (isListening) stopListening();
  };

  recognition.start();
}

function stopListening() {
  isListening = false;
  if (recognition) { try { recognition.stop(); } catch(e) {} }
  const btn = document.getElementById('voice-btn');
  btn.classList.remove('listening');
  btn.textContent = '🎤';
}

// ─── QUIZ ─────────────────────────────────────────────────
function buildTopicChecks() {
  const c = document.getElementById('topic-checks');
  c.innerHTML = '';
  Object.keys(TOPICS).forEach(t => {
    const d = document.createElement('div');
    d.className = 'tc' + (S.quizTopics.includes(t) ? ' on' : '');
    d.textContent = t; d.dataset.t = t;
    d.onclick = () => {
      d.classList.toggle('on');
      S.quizTopics = Array.from(document.querySelectorAll('[data-t].on')).map(x=>x.dataset.t);
    };
    c.appendChild(d);
  });
}

function pickMode(el) {
  document.querySelectorAll('.mc').forEach(m=>m.classList.remove('on'));
  el.classList.add('on');
  S.quizMode = el.dataset.mode;
}

function togDiff(el) {
  el.classList.toggle('on');
  S.quizDiff = Array.from(document.querySelectorAll('[data-d].on')).map(x=>x.dataset.d);
}

function startQuiz() {
  if (!S.quizTopics.length) { alert('Pick at least one topic'); return; }
  S.qIdx = 0; S.qC = 0; S.qW = 0; S.qSk = 0; S.qTimes = [];
  document.getElementById('quiz-setup').style.display = 'none';
  document.getElementById('quiz-active').style.display = 'block';
  document.getElementById('quiz-results').style.display = 'none';
  document.getElementById('q-loading').style.display = 'flex';
  document.getElementById('q-content').style.display = 'none';
  loadQ();
}

async function loadQ(forceTopic = null, forceSub = null) {
  S.answered = false;
  document.getElementById('q-loading').style.display = 'flex';
  document.getElementById('q-content').style.display = 'none';
  document.getElementById('feedback').className = 'feedback';
  document.getElementById('next-btn').className = 'next-btn';

  const total = 8;
  document.getElementById('q-ctr').textContent = 'Q'+(S.qIdx+1)+' of '+total;
  document.getElementById('qprog-fill').style.width = (S.qIdx/total*100)+'%';

  const topic = forceTopic || S.quizTopics[Math.floor(Math.random()*S.quizTopics.length)];
  const sub = forceSub || TOPICS[topic][Math.floor(Math.random()*TOPICS[topic].length)];

  // 1. Check STATIC_CONTENT for quizzes
  if (typeof STATIC_CONTENT !== 'undefined' && STATIC_CONTENT[topic]?.[sub]?.quizzes) {
    const list = STATIC_CONTENT[topic][sub].quizzes;
    const qRaw = list[Math.floor(Math.random() * list.length)];
    // Format to match AI response expectations
    const q = {
      ...qRaw,
      topic,
      type: S.quizMode === 'scenario' ? 'scenario' : 'technical',
      scenario: qRaw.scenario || ""
    };
    renderQ(q);
    if (S.quizMode === 'timed') startTimer();
    return;
  }

  // 1. Check STATIC_CONTENT first (Zero Cost)
  if (typeof STATIC_CONTENT !== 'undefined' && STATIC_CONTENT[topic]?.[sub]?.quizzes) {
    const staticQuizzes = STATIC_CONTENT[topic][sub].quizzes;
    if (staticQuizzes.length > 0) {
      const q = staticQuizzes[Math.floor(Math.random() * staticQuizzes.length)];
      // Ensure q has topic and type for renderer
      q.topic = topic;
      q.type = q.type || 'technical';
      renderQ(q);
      document.getElementById('q-loading').style.display = 'none';
      document.getElementById('q-content').style.display = 'block';
      return;
    }
  }

  const diff = S.quizDiff.length ? S.quizDiff[Math.floor(Math.random()*S.quizDiff.length)] : 'Entry Level';
  const useScenario = S.quizMode === 'scenario' || (S.quizMode === 'practice' && Math.random() > 0.45);

  const prompt = useScenario ?
`Write a scenario-based multiple choice question for an MIS student learning data analytics engineering.

Topic: "${topic}" | Subtopic: "${sub}" | Difficulty: ${diff}

The question MUST start with a realistic business scenario (Nigerian/African company context preferred: bank, telecom, fintech, FMCG). Then ask what the student should do, or what went wrong. Make the options meaningful, no obviously wrong answers.

Return ONLY valid JSON (no markdown):
{
  "topic": "${topic}",
  "type": "scenario",
  "scenario": "Kuda Bank's data team notices their daily transaction summary report is empty every Monday morning. The ETL pipeline runs at 11:59pm Sunday and shows 'completed' in green. The data warehouse shows 0 rows for Sunday. The finance team is already pinging on Slack.",
  "question": "What is the most likely cause, and what should the engineer check first?",
  "code": "",
  "options": ["A. The pipeline is configured to skip weekends in the cron schedule", "B. The source database does a maintenance window on Sundays that locks tables during the ETL run, causing the pipeline to 'complete' with no data", "C. The data warehouse ran out of storage on Sunday", "D. The Slack notifications are misconfigured"],
  "correct": 1,
  "explanation": "Silent failures, where a pipeline finishes 'successfully' but writes zero rows, happen when the source is unavailable during the run. Many databases do maintenance at low-traffic times like Sunday midnight. The fix is to add row-count validation after the load step: if rows_loaded == 0, raise an alert.",
  "mis_link": "In MIS, data reliability is as important as the data itself. A report that says 'no data' and a report that fails to run look identical to the business. Both destroy trust in the system."
}`
:
`Write a practical multiple choice question for an MIS student learning data analytics engineering.

Topic: "${topic}" | Subtopic: "${sub}" | Difficulty: ${diff}

Make it practical. Test understanding, not memorisation. Include a short code snippet if it makes the question better.

Return ONLY valid JSON (no markdown):
{
  "topic": "${topic}",
  "type": "technical",
  "scenario": "",
  "question": "What does the pandas .dropna() method do to a DataFrame?",
  "code": "import pandas as pd\\ndf = pd.read_csv('sales.csv')\\ndf_clean = df.dropna()\\nprint(df_clean.shape)",
  "options": ["A. Removes columns that have any null values", "B. Removes rows that contain at least one null/missing value", "C. Fills null values with zero", "D. Removes duplicate rows"],
  "correct": 1,
  "explanation": "dropna() removes any row that has at least one missing (NaN) value by default. This matters in data engineering because null rows often cause downstream errors. Dashboards show wrong totals, aggregations break, joins produce unexpected results.",
  "mis_link": "Data quality is a core MIS concern. When a report shows wrong numbers, it's often because nulls slipped through. Data engineers are the last line of defence."
}`;

  try {
    const raw = await callAI(prompt, 800);
    const text = raw.replace(/```json|```/g,'').trim();
    const q = JSON.parse(text);
    renderQ(q);
  } catch(e) {
    console.error(e);
    renderQ({topic, type:'technical', scenario:'', question:'Could not load question - click Next.', options:['A. Skip'], correct:0, explanation:'', mis_link:'', code:''});
  }
  document.getElementById('q-loading').style.display = 'none';
  document.getElementById('q-content').style.display = 'block';
  if (S.quizMode === 'timed') startTimer();
}

function renderQ(q) {
  document.getElementById('q-loading').style.display = 'none';
  document.getElementById('q-content').style.display = 'block';

  const badge = document.getElementById('q-badge');
  badge.textContent = q.type === 'scenario' ? '🏢 SCENARIO - ' + q.topic : q.topic;
  badge.className = 'q-badge ' + (q.type === 'scenario' ? 'qb-scen' : 'qb-norm');

  document.getElementById('q-text').textContent = q.question;

  const sc = document.getElementById('q-scen');
  if (q.scenario && q.scenario.trim()) { sc.textContent = q.scenario; sc.style.display = 'block'; }
  else sc.style.display = 'none';

  const cd = document.getElementById('q-code');
  if (q.code && q.code.trim()) {
    cd.textContent = q.code.replace(/\\n/g, '\n');
    cd.style.display = 'block';
  } else cd.style.display = 'none';

    const ol = document.getElementById('opts');
    ol.innerHTML = '';
    const ks = ['A','B','C','D'];
    q.options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.innerHTML = `<span class="opt-key">${ks[i]}</span><span>${o.replace(/^[A-D]\.\s*/,'')}</span>`;
      b.onclick = () => answerQ(i, q, b);
      ol.appendChild(b);
    });

    S.qStart = Date.now();
  }

  function answerQ(i, q, btn) {
    if (S.answered) return;
    S.answered = true;
    clearInterval(S.timerInt);
    S.qTimes.push(Math.round((Date.now() - S.qStart) / 1000));
    const btns = document.querySelectorAll('.opt');
    btns.forEach(b => b.disabled = true);
    const ok = i === q.correct;
    btns[q.correct].classList.add('correct');
    if (!ok) { btn.classList.add('wrong'); S.qW++; }
    else { S.qC++; S.qCorrect++; }
    S.qTotal++;
    const fb = document.getElementById('feedback');
    fb.className = 'feedback show ' + (ok ? 'ok' : 'bad');
    document.getElementById('fb-title').textContent = ok ? '✓ CORRECT' : '✗ INCORRECT';
    document.getElementById('fb-body').textContent = q.explanation || '';
    document.getElementById('fb-mis').textContent = q.mis_link ? '📌 ' + q.mis_link : '';
    document.getElementById('next-btn').className = 'next-btn show';
    addXP(ok ? 10 : 2);
    save();
  }

  function startTimer() {
    S.timerSec = 90;
    const el = document.getElementById('q-timer');
    el.style.display = 'block';
    clearInterval(S.timerInt);
    S.timerInt = setInterval(() => {
      S.timerSec--;
      const m = Math.floor(S.timerSec/60), s = S.timerSec%60;
      el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      if (S.timerSec <= 0) { clearInterval(S.timerInt); S.qSk++; nextQ(); }
    }, 1000);
  }

  function nextQ() {
    clearInterval(S.timerInt);
    S.qIdx++;
    if (S.qIdx >= 8) { showResults(); return; }
    document.getElementById('q-loading').style.display = 'flex';
    document.getElementById('q-content').style.display = 'none';
    document.getElementById('feedback').className = 'feedback';
    document.getElementById('next-btn').className = 'next-btn';
    loadQ();
  }

  function showResults() {
    document.getElementById('quiz-active').style.display = 'none';
    document.getElementById('quiz-results').style.display = 'block';
    const tot = S.qC + S.qW + S.qSk;
    const pct = tot ? Math.round(S.qC / tot * 100) : 0;
    document.getElementById('res-score').textContent = pct + '%';
    const xpE = S.qC * 10 + (pct >= 80 ? 50 : pct >= 60 ? 25 : 0);
    document.getElementById('xp-earned').textContent = '⚡ +' + xpE + ' XP earned';
    const grades = [[90,'A // Excellent 🏆','You think like a data engineer. Keep going.'],[70,'B // Good Work 🎯','Solid foundation. Target those gaps.'],[50,'C // Passing 📚','Head to the Learn tab and do a scenario drill.'],[0,'D // Keep Studying 💪','Do a few more lessons then come back.']];
    const [,g,m] = grades.find(([t]) => pct >= t);
    document.getElementById('res-grade').textContent = g;
    document.getElementById('res-msg').textContent = m;
    document.getElementById('r-c').textContent = S.qC;
    document.getElementById('r-w').textContent = S.qW;
    document.getElementById('r-s').textContent = S.qSk;
    const avg = S.qTimes.length ? Math.round(S.qTimes.reduce((a,b)=>a+b,0)/S.qTimes.length) : 0;
    document.getElementById('r-t').textContent = avg + 's';
    if (pct >= 70) { S.streak++; }
    addXP(xpE);
    save();
  }

  function resetQuiz() {
    document.getElementById('quiz-results').style.display = 'none';
    document.getElementById('quiz-active').style.display = 'none';
    document.getElementById('quiz-setup').style.display = 'block';
  }

  // ─── INIT ─────────────────────────────────────────────────
  buildSidebar();
  buildTopicChecks();
  updateHdr();
  