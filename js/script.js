/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── ROLES ── */
const roles = [
  { prefix:'>', text:'Software Developer' },
  { prefix:'>', text:'Cloud Engineer'     },
  { prefix:'>', text:'DevOps Specialist'  },
  { prefix:'>', text:'Linux Enthusiast'   },
  { prefix:'>', text:'Full-Stack Builder' },
];
const roleInner = document.getElementById('roleInner');
roles.forEach(r => {
  const d = document.createElement('div');
  d.className = 'role-line';
  d.innerHTML = `<span class="prefix">${r.prefix}</span><span class="role-text">${r.text}</span><span class="cursor">_</span>`;
  roleInner.appendChild(d);
});
let cur = 0;
setInterval(() => {
  cur = (cur + 1) % roles.length;
  roleInner.style.transform = `translateY(-${cur * 1.8}em)`;
}, 2400);

/* ── TECH STACK ── */
const techStack = ['Linux','Docker','AWS','K8s','Git','CI/CD','Terraform','Python','Node.js','Bash','Ansible','Jenkins'];

// Desktop orbit
const orbitArea = document.getElementById('orbitArea');
techStack.slice(0, 10).forEach((item, i) => {
  const el = document.createElement('div');
  el.className = 'orbit-item';
  const ringR = [85, 118, 145][i % 3];
  const angle = (i / 10) * 360;
  const rad   = angle * Math.PI / 180;
  const x = 150 + ringR * Math.cos(rad);
  const y = 150 + ringR * Math.sin(rad);
  el.style.cssText = `position:absolute;left:${x}px;top:${y}px;transform:translate(-50%,-50%);`;
  el.innerHTML = `<span>${item}</span>`;
  orbitArea.appendChild(el);
});

// Mobile pills
const pillsEl = document.getElementById('techPills');
techStack.forEach(item => {
  const p = document.createElement('div');
  p.className = 'tech-pill';
  p.textContent = item;
  pillsEl.appendChild(p);
});

/* ── CANVAS ── */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];
const mouse = { x: -999, y: -999 };

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); });

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('touchmove', e => {
  if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
}, { passive: true });
window.addEventListener('touchend', () => { mouse.x = -999; mouse.y = -999; });

const COLORS = ['0,245,212','0,212,255','57,255,20','255,45,120'];

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x     = Math.random() * W;
    this.y     = init ? Math.random() * H : H + 10;
    this.size  = Math.random() * 2 + 0.4;
    this.vy    = -(Math.random() * 0.55 + 0.18);
    this.vx    = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.45 + 0.08;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.phase = Math.random() * Math.PI * 2;
  }
  update() {
    this.phase += 0.018; this.x += this.vx; this.y += this.vy;
    const dx = this.x - mouse.x, dy = this.y - mouse.y;
    const d2 = dx*dx + dy*dy;
    if (d2 < 10000) {
      const d = Math.sqrt(d2), f = (100-d)/100;
      this.x += (dx/d)*f*1.4; this.y += (dy/d)*f*1.4;
    }
    if (this.y < -10) this.reset(false);
  }
  draw() {
    const a = this.alpha * (0.7 + 0.3*Math.sin(this.phase));
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${this.color},${a})`;
    ctx.shadowBlur = 7; ctx.shadowColor = `rgba(${this.color},.35)`;
    ctx.fill(); ctx.shadowBlur = 0;
  }
}

function pCount() { return W < 640 ? 55 : W < 960 ? 80 : 120; }
let pc = pCount();
for (let i = 0; i < pc; i++) particles.push(new Particle());
window.addEventListener('resize', () => {
  const n = pCount(); if (n !== pc) { pc = n; particles = []; for (let i = 0; i < pc; i++) particles.push(new Particle()); }
});

function drawConnections() {
  const md = W < 640 ? 70 : 90;
  for (let i = 0; i < particles.length; i++)
    for (let j = i+1; j < particles.length; j++) {
      const dx = particles[i].x-particles[j].x, dy = particles[i].y-particles[j].y;
      const d2 = dx*dx+dy*dy;
      if (d2 < md*md) {
        const d = Math.sqrt(d2);
        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,212,${(1-d/md)*.065})`; ctx.lineWidth = .5; ctx.stroke();
      }
    }
}

const fontSize = 11;
const codeChars = 'アイウエオカキクケコ01>;{}[]λΨΔ∑∞#$%&';
let cols = [];
function initCols() { cols = Array.from({ length: Math.floor(W/fontSize) }, () => Math.random()*H/fontSize); }
initCols();
window.addEventListener('resize', initCols);

function drawCodeRain() {
  ctx.font = `${fontSize}px 'JetBrains Mono',monospace`;
  cols.forEach((y,i) => {
    ctx.fillStyle = 'rgba(0,245,212,.017)';
    ctx.fillText(codeChars[Math.floor(Math.random()*codeChars.length)], i*fontSize, y*fontSize);
    if (y*fontSize > H && Math.random() > .976) cols[i] = 0; else cols[i] = y+1;
  });
}

const blobs = [
  {x:.15,y:.3, r:300,c:'0,245,212', o:.038},
  {x:.85,y:.7, r:350,c:'0,212,255', o:.032},
  {x:.5, y:.9, r:240,c:'255,45,120',o:.022},
  {x:.7, y:.12,r:190,c:'57,255,20', o:.018},
];

let frame = 0;
(function animate() {
  requestAnimationFrame(animate); frame++;
  ctx.clearRect(0,0,W,H);
  const g = ctx.createRadialGradient(W*.3,H*.4,0,W*.3,H*.4,W*.85);
  g.addColorStop(0,'rgba(5,15,30,1)'); g.addColorStop(1,'rgba(3,7,18,1)');
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  blobs.forEach(b => {
    const bx = b.x*W + Math.sin(frame*.003+b.x)*28;
    const by = b.y*H + Math.cos(frame*.004+b.y)*18;
    const g2 = ctx.createRadialGradient(bx,by,0,bx,by,b.r);
    g2.addColorStop(0,`rgba(${b.c},${b.o})`); g2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g2; ctx.fillRect(0,0,W,H);
  });
  drawCodeRain();
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
})();

// =============================== 😺 Skill Bars 😺 =============================== \\

/* ── Intersection Observer: trigger card animations ── */
  const cards = document.querySelectorAll('.skill-card');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => skillObserver.observe(c));

  /* If already in view (page loaded scrolled here) */
  setTimeout(() => {
    cards.forEach((c, i) => {
      if (!c.classList.contains('visible')) {
        const rect = c.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          setTimeout(() => c.classList.add('visible'), i * 90);
        }
      }
    });
  }, 200);

  /* ── Marquee content ── */
  const marqueeItems = [
    'Linux','Docker','Kubernetes','AWS','Terraform','CI/CD',
    'Git','Node.js','Python','React','PostgreSQL','Bash',
    'Ansible','Jenkins','Nginx','Redis','GraphQL','TypeScript'
  ];
  const track = document.getElementById('marqueeTrack');
  // Duplicate for infinite loop
  [...marqueeItems, ...marqueeItems].forEach(item => {
    const el = document.createElement('div');
    el.className = 'marquee-item';
    el.textContent = item;
    track.appendChild(el);
  });

  // =============================== 👻 End Skill Bars 👻 =============================== \\

  // ===============================  😺  Project Bars 😺  =============================== \\

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.featured-project, .project-card');
  const projectObserver = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        projectObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => projectObserver.observe(el));

  /* Initial check */
  setTimeout(() => {
    revealEls.forEach((el, i) => {
      if (!el.classList.contains('visible')) {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) setTimeout(() => el.classList.add('visible'), i * 80);
      }
    });
  }, 200);

  /* ── Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const allCards   = document.querySelectorAll('.project-card');
  const featCard   = document.getElementById('featuredCard');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;

      // Featured card
      const featCats = featCard.dataset.cats || '';
      const featShow = f === 'all' || featCats.includes(f);
      featCard.style.display = featShow ? '' : 'none';

      // Grid cards
      allCards.forEach(card => {
        const cats = card.dataset.cats || '';
        const show = f === 'all' || cats.includes(f);
        card.style.display = show ? '' : 'none';
        if (show && !card.classList.contains('visible')) {
          card.classList.add('visible');
        }
      });
    });
  });

  // =============================== 👻 End Project Bars 👻  =============================== \\


  // =============================== 😺  Certifications Bars 😺  =============================== \\

  /* ── Scroll reveal ── */
  const CertificationsCards = document.querySelectorAll('.cert-card');
  const Certificationsobs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 75);
        Certificationsobs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  CertificationsCards.forEach(c => Certificationsobs.observe(c));

  setTimeout(() => {
    CertificationsCards.forEach((c, i) => {
      if (!c.classList.contains('visible')) {
        const r = c.getBoundingClientRect();
        if (r.top < window.innerHeight) setTimeout(() => c.classList.add('visible'), i * 75);
      }
    });
  }, 200);

  /* ── Filter ── */
  const filterBtn = document.querySelectorAll('.filter-btn');
  filterBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtn.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const cats = card.dataset.cats || '';
        const show = f === 'all' || cats.includes(f);
        card.style.display = show ? '' : 'none';
        if (show && !card.classList.contains('visible')) card.classList.add('visible');
      });
    });
  });

  // =============================== 👻 End Certifications Bars 👻  =============================== \\


  // =============================== 😺  Experience Bars 😺  =============================== \\


  // ================================ 👻 End Experience Bars 👻  =============================== \\



  // =============================== 😺  Contact Bars 😺  =============================== \\

  function handleSend(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px"><polyline points="20 6 9 17 4 12"/></svg> Message Sent!`;
    btn.style.background = 'var(--green)';
    btn.style.color = '#030712';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }


// ============================ Forms ============================ \\

async function handleSend(button) {

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name) {
    alert("Name is required");
    return;
  }

  if (!email) {
    alert("Email is required");
    return;
  }

  if (!message) {
    alert("Message is required");
    return;
  }

  button.disabled = true;
  button.innerText = "Sending... Please wait";

  try {

    const response = await fetch(
      "https://portfolio-backend-lp4t.onrender.com/api/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message
        })
      }
    );

    if (response.ok) {

      alert("Message sent successfully 🚀");

      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("subject").value = "";
      document.getElementById("message").value = "";

    } else {

      alert("Failed to send message");

    }

  } catch (error) {

    console.error(error);
    alert("Server is busy. Try again.");

  }

  button.disabled = false;
  button.innerText = "Send Message";
}

  // =============================== 👻 End Contact Bars 👻  =============================== \\


// ================================  😺 AI chat widget 😺  ========================================= \\

/* ════════════════════════════════
   STATE
════════════════════════════════ */
let chatOpen = false;
let callActive = false;
let callInterval = null;
let callSeconds = 0;
let micActive = false;
let emojiOpen = false;

const AI_REPLIES = {
  "👋 Just Saying Hi": [
  "Hey there! 👋 Nice to see you here. How can I assist you today?",
  "Hello! 😊 I'm glad you stopped by. Are you looking to start a project, explore ideas, or just say hi?",
  "Hi! 👋 Feel free to ask about projects, collaboration, or anything you'd like to know.",
  "Hey! Welcome to my portfolio assistant. 🚀 What would you like to explore today?"
],
  "🚀 Launch My Project": [
    "Awesome! Let's talk about your project. 🚀 What stage are you at — idea, prototype, or ready to launch?",
    "Great! Tell me more about your project scope and timeline, and I'll help you map out the next steps."
  ],
  "💡 Get Ideas": [
    "I love brainstorming! 💡 What area do you need ideas for — design, features, marketing, or something else?",
    "Let's think creatively! Give me a topic or problem and I'll generate some fresh ideas for you."
  ],
  "📋 View Portfolio": [
    "The portfolio showcases UI/UX design, web apps, and creative development work. Shall I walk you through any specific project? ✨",
    "There are some incredible projects here! Check out the Projects section above, or I can highlight a specific one for you."
  ],
  "📞 Schedule a Call": [
    "Happy to schedule a call! 📅 I'm available Monday–Friday, 9AM–6PM. What time works best for you?",
    "Let's connect! Drop your preferred date and time below contact info and I'll confirm the slot. You'll get a calendar invite right away."
  ],
  "👨‍💻 Developer Collaboration": [
  "Love collaborating with developers! 👨‍💻 Are you interested in open-source projects, freelancing together, or building a startup idea?",
  "Great! If you want to collaborate, you can check my GitHub repositories or tell me about the tech stack you're working with."
],
"🛠 Tech Stack": [
  "Here are some technologies I work with: React, Node.js, MongoDB, Express, JavaScript, and Tailwind CSS. 🚀",
  "My core stack includes Full-Stack JavaScript technologies like MERN. I also enjoy working on UI/UX and scalable web apps."
],
"💼 Hire Me": [
  "I'd love to help with your project! 💼 Tell me about your requirements, timeline, and budget.",
  "Great! If you're looking for a developer, share your project idea and I'll suggest the best approach."
],
"📬 Contact Me": [
  "You can reach me through email, LinkedIn, or schedule a call directly from here. 📬",
  "I'd love to connect! Choose your preferred method and I'll respond as soon as possible."
],
"📄 View Resume": [
  "You can view or download my resume here. 📄 It includes my projects, skills, and experience.",
  "Would you like to download my CV or see a quick summary of my experience?"
],
"🧪 View Live Projects": [
  "Here are some live projects you can explore! 🚀 Let me know if you'd like a walkthrough of any of them.",
  "Feel free to test the live demos. Each project showcases different full-stack features."
],
"💡 Startup Ideas": [
  "If you have a startup idea, I'd love to help build an MVP! 🚀 Tell me about your concept.",
  "Building startups is exciting! Let's discuss your idea and how we can turn it into a real product."
],
"📚 Learning Help": [
  "If you're learning development, I can share resources, roadmaps, and project ideas. 📚",
  "Tell me what you're learning — frontend, backend, or full-stack — and I'll guide you."
],
  "default": [
    "That's a great question! Let me think about that for you… 🤔",
    "Thanks for reaching out! I'm here to help. Could you give me a bit more context?",
    "Interesting! Here's what I'd suggest: start by breaking it down into smaller steps. What's your main goal?",
    "Got it! I can definitely help with that. Let me pull up the relevant information for you. 💼",
    "Sure thing! I'll need just a moment to put together the best answer for you. 🚀"
  ]
};

/* ════════════════════════════════
   CHAT OPEN / CLOSE
════════════════════════════════ */
function toggleChat() {
  chatOpen ? closeChat() : openChat();
}

function openChat() {
  chatOpen = true;
  document.getElementById('chatWindow').classList.add('open');
  document.getElementById('launcherBtn').classList.add('open');
  document.getElementById('unreadBadge').style.display = 'none';
  dismissNotif({ stopPropagation: ()=>{} });
  setTimeout(() => document.getElementById('chatInput').focus(), 400);
}

function closeChat() {
  chatOpen = false;
  document.getElementById('chatWindow').classList.remove('open');
  document.getElementById('launcherBtn').classList.remove('open');
}

/* ════════════════════════════════
   MESSAGES
════════════════════════════════ */
function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  input.value = '';
  input.style.height = 'auto';

  // hide quick replies after first message
  document.getElementById('quickReplies').style.display = 'none';

  showTyping();
  setTimeout(() => {
    removeTyping();
    const replies = AI_REPLIES[text] || AI_REPLIES['default'];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    appendMessage(reply, 'ai');
  }, 1200 + Math.random() * 800);
}

function quickReply(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

function appendMessage(text, role) {
  const msgs = document.getElementById('chatMessages');
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');

  const row = document.createElement('div');
  row.className = `msg-row ${role}`;
  row.innerHTML = role === 'ai'
    ? `<div class="msg-avatar">🤖</div>
       <div class="msg-content">
         <div class="msg-bubble">${escHtml(text)}</div>
         <div class="msg-time">${time}</div>
       </div>`
    : `<div class="msg-content">
         <div class="msg-bubble">${escHtml(text)}</div>
         <div class="msg-time">${time}</div>
       </div>
       <div class="msg-avatar" style="background:linear-gradient(135deg,#10b981,#06b6d4)">🧑</div>`;

  msgs.appendChild(row);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const el = document.createElement('div');
  el.className = 'msg-row ai typing-indicator';
  el.id = 'typingRow';
  el.innerHTML = `<div class="msg-avatar">🤖</div>
    <div class="typing-dots"><span></span><span></span><span></span></div>`;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
}
function removeTyping() {
  const el = document.getElementById('typingRow');
  if (el) el.remove();
}
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ════════════════════════════════
   KEYBOARD
════════════════════════════════ */
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}
function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 90) + 'px';
}

/* ════════════════════════════════
   EMOJI
════════════════════════════════ */
function toggleEmoji() {
  emojiOpen = !emojiOpen;
  document.getElementById('emojiPicker').classList.toggle('open', emojiOpen);
}
function insertEmoji(em) {
  const inp = document.getElementById('chatInput');
  inp.value += em;
  inp.focus();
  emojiOpen = false;
  document.getElementById('emojiPicker').classList.remove('open');
}

/* ════════════════════════════════
   MIC (simulated)
════════════════════════════════ */
function toggleMic() {
  micActive = !micActive;
  const btn = document.getElementById('micBtn');
  btn.classList.toggle('mic-active', micActive);
  btn.textContent = micActive ? '⏹️' : '🎤';
  if (micActive) {
    setTimeout(() => {
      if (micActive) {
        document.getElementById('chatInput').value = 'Hello, I need help with my project!';
        toggleMic();
      }
    }, 2500);
  }
}

/* ════════════════════════════════
   VOICE CALL
════════════════════════════════ */
function toggleCall() {
  callActive ? endCall() : startCall();
}
function startCall() {
  callActive = true;
  callSeconds = 0;
  document.getElementById('callBanner').classList.add('active');
  document.getElementById('callBtn').textContent = '📵';
  callInterval = setInterval(() => {
    callSeconds++;
    const m = Math.floor(callSeconds/60).toString().padStart(2,'0');
    const s = (callSeconds%60).toString().padStart(2,'0');
    document.getElementById('callTimer').textContent = `${m}:${s}`;
  }, 1000);
  appendMessage('📞 Voice call started…', 'ai');
}
function endCall() {
  callActive = false;
  clearInterval(callInterval);
  document.getElementById('callBanner').classList.remove('active');
  document.getElementById('callBtn').textContent = '📞';
  const dur = document.getElementById('callTimer').textContent;
  appendMessage(`📞 Call ended · Duration ${dur}`, 'ai');
  document.getElementById('callTimer').textContent = '00:00';
}

/* ════════════════════════════════
   VIDEO CALL (placeholder)
════════════════════════════════ */
function startVideo() {
  appendMessage('🎥 Video call feature coming soon! For now, you can schedule via the button below. 😊', 'ai');
}

/* ════════════════════════════════
   NOTIFICATION TOAST
════════════════════════════════ */
function dismissNotif(e) {
  e.stopPropagation();
  document.getElementById('notifToast').classList.remove('show');
}

// Show notification after 1.5s
setTimeout(() => {
  if (!chatOpen) document.getElementById('notifToast').classList.add('show');
}, 1500);

// Auto-dismiss after 6s
setTimeout(() => {
  document.getElementById('notifToast').classList.remove('show');
}, 7500);

// ================================ 👻 End AI chat widget 👻 ====================================== \\ 
