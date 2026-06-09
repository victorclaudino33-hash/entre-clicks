/* ═══════════════════════════════════════════════════
   Entre Clicks & Enganos — script.js  (quiz v3)
   ═══════════════════════════════════════════════════ */

lucide.createIcons();

document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});
document.querySelectorAll('#mobile-menu a').forEach(a => {
  a.addEventListener('click', () =>
    document.getElementById('mobile-menu').classList.add('hidden')
  );
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ══════════════════════════════════════════════════════
   QUIZ v3
══════════════════════════════════════════════════════ */

const questions = [
  {
    situation: 'Dona Maria, 72 anos, recebe uma mensagem no WhatsApp dizendo: "Mãe, troquei de número! Salva esse. Preciso que você faça um Pix urgente de R$ 800 pra pagar uma conta, te devolvo depois."',
    type: 'Golpe do WhatsApp',
    icon: 'smartphone',
    options: [
      'Fazer o Pix imediatamente, pois parece urgente',
      'Ligar para o número antigo do filho para confirmar a identidade',
      'Responder a mensagem pedindo mais detalhes antes de pagar',
      'Enviar metade do valor para testar se é verdade'
    ],
    correct: 1,
    explanation: 'Sempre ligue para o número que você já conhece para confirmar. Golpistas criam urgência artificial para impedir que você pense com clareza. Nunca faça Pix sem confirmar a identidade por voz.'
  },
  {
    situation: 'Seu João, 68 anos, recebe um e-mail do "Banco do Brasil" dizendo que sua conta foi bloqueada e ele deve clicar num link para desbloqueá-la. O visual é idêntico ao do banco.',
    type: 'Phishing',
    icon: 'mail',
    options: [
      'O e-mail chegou fora do horário comercial',
      'O visual parece muito profissional',
      'Bancos nunca pedem dados ou desbloqueios por e-mail com links',
      'O assunto do e-mail está em letras maiúsculas'
    ],
    correct: 2,
    explanation: 'Bancos legítimos NUNCA pedem senha ou desbloqueio por e-mail. Se receber algo assim, acesse o app oficial do banco diretamente ou ligue para o número no verso do seu cartão.'
  },
  {
    situation: 'Dona Ana, 75 anos, lê no Facebook uma notícia com título alarmante: "URGENTE: governo vai taxar todos os depósitos no Pix acima de R$ 5!" A notícia tem milhares de compartilhamentos.',
    type: 'Fake News',
    icon: 'alert-triangle',
    options: [
      'Compartilhar com todos os contatos para alertar',
      'Acreditar porque muitas pessoas já compartilharam',
      'Checar em sites jornalísticos confiáveis ou no site oficial do governo antes de qualquer ação',
      'Perguntar só para amigos do WhatsApp se é verdade'
    ],
    correct: 2,
    explanation: 'Muitos compartilhamentos não validam uma notícia — desinformação se espalha rapidamente. Verifique sempre em G1, UOL, Agência Lupa ou gov.br antes de acreditar ou compartilhar.'
  },
  {
    situation: 'Seu Pedro, 70 anos, conhece online uma "pessoa" que diz ser um médico estrangeiro. Após meses de conversa carinhosa, pede dinheiro para uma "emergência".',
    type: 'Golpe do Falso Pretendente',
    icon: 'heart',
    options: [
      'Golpe do PIX — pede transferência bancária',
      'Golpe do falso pretendente — explora afeto e solidão para obter dinheiro',
      'Golpe de phishing — usa e-mail com link falso',
      'Golpe do falso suporte técnico'
    ],
    correct: 1,
    explanation: 'Este é o "golpe do amor" ou romance scam. Criminosos investem semanas criando laços emocionais antes de pedir dinheiro. Nunca envie dinheiro para alguém que você só conheceu online.'
  },
  {
    situation: 'Dona Rosa, 65 anos, recebe uma ligação de alguém dizendo ser do "suporte do banco". A pessoa sabe o nome dela, o banco e pede para confirmar a senha do cartão.',
    type: 'Vishing (golpe por telefone)',
    icon: 'phone',
    options: [
      'Confirmar os dados pois o atendente parece saber quem ela é',
      'Informar apenas os 4 primeiros dígitos do cartão',
      'Desligar e ligar para o banco pelo número oficial no verso do cartão',
      'Pedir que a ligação seja transferida para um supervisor'
    ],
    correct: 2,
    explanation: 'Saber seu nome e banco não prova que a ligação é legítima — criminosos compram dados vazados. Bancos NUNCA pedem senha por telefone. Desligue e ligue você mesmo para o número oficial.'
  },
  {
    situation: 'Seu Carlos, 78 anos, recebe um SMS dizendo que ganhou um prêmio de R$ 10.000. Para receber, deve clicar num link e pagar uma "taxa de liberação" de R$ 150.',
    type: 'Golpe do Prêmio Falso',
    icon: 'gift',
    options: [
      'Prêmios reais nunca chegam por SMS',
      'O valor do prêmio parece alto demais',
      'Prêmios legítimos nunca exigem pagamento prévio para serem liberados',
      'Ele não se cadastrou em nenhum sorteio'
    ],
    correct: 2,
    explanation: 'A "taxa de liberação" é o sinal claro do golpe. Prêmios reais nunca exigem pagamento para serem entregues. Se precisou pagar para receber, não é prêmio — é prejuízo.'
  }
];

let currentQ  = 0;
let score     = 0;
let answered  = false;
let streak    = 0;
let maxStreak = 0;
let results   = [];

/* ── helpers ─────────────────────────────────────────── */
function animateIn(el, delay = 0) {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(20px)';
  setTimeout(() => {
    el.style.transition = 'opacity .45s ease, transform .45s ease';
    el.style.opacity    = '1';
    el.style.transform  = 'translateY(0)';
  }, delay);
}

function updateStepDots() {
  const wrap = document.getElementById('quiz-steps');
  if (!wrap) return;
  wrap.innerHTML = questions.map((_, i) => {
    let bg, size;
    if (i < currentQ) {
      const wasCorrect = results[i] && results[i].correct;
      bg   = wasCorrect ? '#22c55e' : '#ef4444';
      size = '10px';
    } else if (i === currentQ) {
      bg   = 'var(--yellow)';
      size = '13px';
    } else {
      bg   = 'rgba(255,255,255,.18)';
      size = '8px';
    }
    return `<span style="display:inline-block;width:${size};height:${size};border-radius:50%;background:${bg};transition:all .3s;flex-shrink:0;"></span>`;
  }).join('');
}

/* ── render question ─────────────────────────────────── */
function renderQuestion() {
  answered = false;
  const q    = questions[currentQ];
  const area = document.getElementById('quiz-question-area');

  /* header counters */
  document.getElementById('quiz-progress-text').textContent =
    `Pergunta ${currentQ + 1} de ${questions.length}`;
  document.getElementById('quiz-score').textContent = `Pontos: ${score}`;

  /* smooth progress bar */
  const pct = ((currentQ + 0.1) / questions.length) * 100;
  document.getElementById('quiz-bar').style.width = pct + '%';

  updateStepDots();

  area.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;">
      <span style="display:inline-flex;align-items:center;justify-content:center;
                   width:36px;height:36px;border-radius:50%;
                   background:rgba(255,185,21,.15);border:1.5px solid rgba(255,185,21,.35);
                   flex-shrink:0;">
        <i data-lucide="${q.icon}" style="width:16px;height:16px;color:var(--yellow);"></i>
      </span>
      <span style="font-family:'Archivo',sans-serif;font-weight:700;font-size:11px;
                   letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.5);">
        ${q.type}
      </span>
      ${streak >= 2 ? `
        <span style="margin-left:auto;font-family:'Archivo',sans-serif;font-weight:700;
                     font-size:11px;padding:3px 10px;border-radius:20px;
                     background:var(--yellow);color:var(--blue);letter-spacing:.04em;
                     animation:streakPop .35s cubic-bezier(.175,.885,.32,1.275);">
          🔥 ${streak} seguidas
        </span>` : ''}
    </div>

    <p style="font-family:'Archivo',sans-serif;font-size:16px;font-weight:500;
              line-height:1.65;color:#fff;margin-bottom:28px;">
      ${q.situation}
    </p>

    <div id="options-list" style="display:flex;flex-direction:column;gap:10px;">
      ${q.options.map((opt, i) => `
        <button type="button" class="qz-opt" data-idx="${i}"
          style="display:flex;align-items:center;gap:14px;width:100%;text-align:left;
                 padding:14px 16px;border:1.5px solid rgba(255,255,255,.14);
                 background:rgba(255,255,255,.04);cursor:pointer;
                 font-family:'Archivo',sans-serif;font-size:14px;font-weight:500;
                 color:rgba(255,255,255,.85);transition:border-color .18s,background .18s,transform .15s;">
          <span style="display:inline-flex;align-items:center;justify-content:center;
                       width:32px;height:32px;border-radius:50%;flex-shrink:0;
                       border:1.5px solid rgba(255,255,255,.2);
                       font-family:'Anton',sans-serif;font-size:16px;
                       color:var(--yellow);transition:background .18s,border-color .18s;">
            ${String.fromCharCode(65 + i)}
          </span>
          <span style="flex:1;">${opt}</span>
        </button>
      `).join('')}
    </div>

    <div id="quiz-explanation" style="display:none;margin-top:20px;"></div>

    <button type="button" id="next-btn"
      style="margin-top:24px;display:inline-flex;align-items:center;gap:8px;
             padding:13px 28px;font-family:'Archivo',sans-serif;font-weight:700;
             font-size:14px;background:var(--yellow);color:var(--blue);
             border:none;cursor:pointer;opacity:.35;pointer-events:none;
             box-shadow:4px 4px 0 rgba(255,185,21,.25);
             transition:opacity .2s,transform .15s,box-shadow .15s;">
      ${currentQ < questions.length - 1 ? 'Próxima pergunta' : 'Ver resultado'}
      <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>
    </button>
  `;

  lucide.createIcons();
  animateIn(area);

  /* hover fx */
  document.querySelectorAll('.qz-opt').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if (!answered) {
        btn.style.borderColor = 'rgba(255,185,21,.5)';
        btn.style.background  = 'rgba(255,185,21,.08)';
        btn.style.transform   = 'translateX(4px)';
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (!answered && !btn.classList.contains('qz-correct') && !btn.classList.contains('qz-wrong')) {
        btn.style.borderColor = 'rgba(255,255,255,.14)';
        btn.style.background  = 'rgba(255,255,255,.04)';
        btn.style.transform   = 'translateX(0)';
      }
    });
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.idx)));
  });
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
}

/* ── select answer ───────────────────────────────────── */
function selectAnswer(idx) {
  if (answered) return;
  answered = true;

  const correct = questions[currentQ].correct;
  const isRight = idx === correct;

  if (isRight) { score++; streak++; if (streak > maxStreak) maxStreak = streak; }
  else          { streak = 0; }

  results.push({ correct: isRight, idx, question: currentQ });

  document.querySelectorAll('.qz-opt').forEach((btn, i) => {
    btn.style.pointerEvents = 'none';
    btn.style.transform     = 'translateX(0)';
    if (i === correct) {
      btn.style.borderColor = '#22c55e';
      btn.style.background  = 'rgba(34,197,94,.12)';
      btn.style.color       = '#86efac';
      btn.querySelector('span').style.borderColor  = '#22c55e';
      btn.querySelector('span').style.background   = 'rgba(34,197,94,.18)';
      btn.querySelector('span').style.color        = '#22c55e';
    } else if (i === idx && !isRight) {
      btn.style.borderColor = '#ef4444';
      btn.style.background  = 'rgba(239,68,68,.1)';
      btn.style.color       = '#fca5a5';
      btn.querySelector('span').style.borderColor  = '#ef4444';
      btn.querySelector('span').style.color        = '#ef4444';
    } else {
      btn.style.opacity = '.3';
    }
  });

  updateStepDots();

  /* explanation card */
  const expEl = document.getElementById('quiz-explanation');
  expEl.innerHTML = `
    <div style="display:flex;gap:14px;padding:16px 18px;
                border-left:3px solid ${isRight ? '#22c55e' : '#ef4444'};
                background:${isRight ? 'rgba(34,197,94,.07)' : 'rgba(239,68,68,.07)'};">
      <span style="flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;
                   width:26px;height:26px;border-radius:50%;margin-top:1px;
                   background:${isRight ? '#22c55e' : '#ef4444'};">
        <i data-lucide="${isRight ? 'check' : 'x'}" style="width:13px;height:13px;color:#fff;"></i>
      </span>
      <div>
        <p style="font-family:'Archivo',sans-serif;font-weight:700;font-size:13px;margin:0 0 5px;
                  color:${isRight ? '#86efac' : '#fca5a5'};">
          ${isRight ? 'Resposta correta!' : 'Não era essa…'}
        </p>
        <p style="font-family:'Archivo',sans-serif;font-size:13px;line-height:1.6;margin:0;
                  color:rgba(255,255,255,.65);">
          ${questions[currentQ].explanation}
        </p>
      </div>
    </div>
  `;
  expEl.style.display = 'block';
  lucide.createIcons();
  animateIn(expEl, 60);

  const nb = document.getElementById('next-btn');
  nb.style.opacity       = '1';
  nb.style.pointerEvents = 'auto';
  document.getElementById('quiz-score').textContent = `Pontos: ${score}`;
}

/* ── next ────────────────────────────────────────────── */
function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) showResult();
  else renderQuestion();
}

/* ── result ──────────────────────────────────────────── */
function showResult() {
  document.getElementById('quiz-question-area').classList.add('hidden');
  document.getElementById('quiz-progress').classList.add('hidden');
  document.getElementById('quiz-bar').parentElement.classList.add('hidden');

  const resultEl = document.getElementById('quiz-result');
  resultEl.classList.remove('hidden');

  const pct = Math.round((score / questions.length) * 100);
  let headline, msg;
  if      (score === questions.length) { headline = 'Especialista!';  msg = 'Nota máxima! Você é uma referência em segurança digital para sua família.'; }
  else if (score >= 4)                 { headline = 'Muito bem!';     msg = 'Você demonstrou boa consciência sobre segurança digital. Compartilhe com quem você ama.'; }
  else if (score >= 2)                 { headline = 'Quase lá!';      msg = 'Há espaço para aprofundar. Reveja os casos e converse com idosos próximos.'; }
  else                                  { headline = 'Aprenda mais!'; msg = 'Esses golpes são sofisticados — refaça o quiz. Conhecimento é a melhor proteção.'; }

  const scoreColor = pct === 100 ? '#22c55e' : pct >= 67 ? 'var(--yellow)' : '#ef4444';
  const circ = 2 * Math.PI * 52;

  const breakdown = results.map((r) => {
    const q = questions[r.question];
    return `
      <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 14px;
                  border:1.5px solid ${r.correct ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'};
                  background:${r.correct ? 'rgba(34,197,94,.06)' : 'rgba(239,68,68,.06)'};">
        <span style="flex-shrink:0;width:22px;height:22px;border-radius:50%;margin-top:1px;
                     display:inline-flex;align-items:center;justify-content:center;
                     background:${r.correct ? '#22c55e' : '#ef4444'};">
          <i data-lucide="${r.correct ? 'check' : 'x'}" style="width:11px;height:11px;color:#fff;"></i>
        </span>
        <div>
          <p style="font-family:'Archivo',sans-serif;font-weight:700;font-size:10px;
                    letter-spacing:.13em;text-transform:uppercase;margin:0 0 3px;
                    color:${r.correct ? 'rgba(134,239,172,.7)' : 'rgba(252,165,165,.7)'};">
            ${q.type}
          </p>
          <p style="font-family:'Archivo',sans-serif;font-size:12px;line-height:1.5;margin:0;
                    color:rgba(255,255,255,.55);">
            ${q.situation.substring(0, 85)}…
          </p>
        </div>
      </div>`;
  }).join('');

  resultEl.innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0 4px;">

      <div style="position:relative;width:160px;height:160px;margin-bottom:24px;">
        <svg viewBox="0 0 120 120" style="width:100%;height:100%;transform:rotate(-90deg);">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="9"/>
          <circle id="result-ring" cx="60" cy="60" r="52" fill="none"
            stroke="${scoreColor}" stroke-width="9"
            stroke-dasharray="${circ}"
            stroke-dashoffset="${circ}"
            stroke-linecap="round"
            style="transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1);"/>
        </svg>
        <div style="position:absolute;inset:0;display:flex;flex-direction:column;
                    align-items:center;justify-content:center;gap:1px;">
          <span style="font-family:'Anton',sans-serif;font-size:38px;line-height:1;
                       color:#fff;">${score}<span style="font-size:20px;opacity:.6;">/${questions.length}</span></span>
          <span style="font-family:'Archivo',sans-serif;font-size:11px;font-weight:700;
                       letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.4);">acertos</span>
        </div>
      </div>

      <h3 style="font-family:'Anton',sans-serif;font-size:clamp(44px,7vw,72px);
                 line-height:.9;letter-spacing:-.01em;text-transform:uppercase;
                 text-align:center;color:${scoreColor};margin:0 0 10px;">${headline}</h3>

      <p style="font-family:'Archivo',sans-serif;font-size:14px;line-height:1.65;
                color:rgba(255,255,255,.6);text-align:center;max-width:360px;margin:0 0 20px;">
        ${msg}
      </p>

      ${maxStreak >= 2 ? `
        <div style="display:inline-flex;align-items:center;gap:8px;
                    padding:8px 16px;background:rgba(255,185,21,.12);
                    border:1.5px solid rgba(255,185,21,.3);margin-bottom:20px;">
          <span style="font-size:16px;">🔥</span>
          <span style="font-family:'Archivo',sans-serif;font-weight:700;font-size:12px;
                       color:var(--yellow);letter-spacing:.04em;">
            Maior sequência: ${maxStreak} corretas seguidas
          </span>
        </div>` : ''}

      <div style="width:100%;margin-top:4px;">
        <p style="font-family:'Archivo',sans-serif;font-weight:700;font-size:10px;
                  letter-spacing:.16em;text-transform:uppercase;
                  color:rgba(255,255,255,.3);margin:0 0 12px;">Revisão das perguntas</p>
        <div style="display:flex;flex-direction:column;gap:8px;">${breakdown}</div>
      </div>

      <button id="quiz-restart-btn"
        style="margin-top:28px;display:inline-flex;align-items:center;gap:8px;
               padding:13px 32px;font-family:'Archivo',sans-serif;font-weight:700;
               font-size:14px;background:var(--yellow);color:var(--blue);border:none;
               cursor:pointer;box-shadow:4px 4px 0 rgba(255,185,21,.25);
               transition:transform .15s,box-shadow .15s;">
        Tentar novamente
        <i data-lucide="refresh-cw" style="width:15px;height:15px;"></i>
      </button>
    </div>
  `;

  lucide.createIcons();
  animateIn(resultEl);

  /* ring animation — needs a tiny delay so the element is in DOM */
  setTimeout(() => {
    const ring = document.getElementById('result-ring');
    if (ring) ring.style.strokeDashoffset = circ * (1 - pct / 100);
  }, 80);

  const rb = document.getElementById('quiz-restart-btn');
  rb.addEventListener('mouseenter', () => {
    rb.style.transform  = 'translateY(-2px)';
    rb.style.boxShadow  = '4px 6px 0 rgba(255,185,21,.35)';
  });
  rb.addEventListener('mouseleave', () => {
    rb.style.transform  = 'translateY(0)';
    rb.style.boxShadow  = '4px 4px 0 rgba(255,185,21,.25)';
  });
  rb.addEventListener('click', restartQuiz);
}

/* ── restart ─────────────────────────────────────────── */
function restartQuiz() {
  currentQ = 0; score = 0; answered = false; streak = 0; maxStreak = 0; results = [];
  document.getElementById('quiz-question-area').classList.remove('hidden');
  document.getElementById('quiz-progress').classList.remove('hidden');
  document.getElementById('quiz-bar').parentElement.classList.remove('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  renderQuestion();
}

renderQuestion();

