/* ═══════════════════════════════════════════════════
   Entre Clicks & Enganos — script.js
   ═══════════════════════════════════════════════════ */

// ── Lucide Icons ──────────────────────────────────────
lucide.createIcons();

// ── Mobile Menu ───────────────────────────────────────
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
  document.getElementById('mobile-menu').classList.toggle('hidden');
});
document.querySelectorAll('#mobile-menu a').forEach(a => {
  a.addEventListener('click', () =>
    document.getElementById('mobile-menu').classList.add('hidden')
  );
});

// ── Scroll Fade-in ────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ══════════════════════════════════════════════════════
// QUIZ
// ══════════════════════════════════════════════════════

const questions = [
  {
    situation: 'Dona Maria, 72 anos, recebe uma mensagem no WhatsApp dizendo: "Mãe, troquei de número! Salva esse. Preciso que você faça um Pix urgente de R$ 800 pra pagar uma conta, te devolvo depois."',
    options: [
      'Fazer o Pix imediatamente, pois parece urgente',
      'Ligar para o número antigo do filho para confirmar a identidade',
      'Responder a mensagem pedindo mais detalhes antes de pagar',
      'Enviar metade do valor para testar se é verdade'
    ],
    correct: 1
  },
  {
    situation: 'Seu João, 68 anos, recebe um e-mail do "Banco do Brasil" dizendo que sua conta foi bloqueada e ele deve clicar num link para desbloqueá-la. O visual é idêntico ao do banco.',
    options: [
      'O e-mail chegou fora do horário comercial',
      'O visual parece muito profissional',
      'Bancos nunca pedem dados ou desbloqueios por e-mail com links',
      'O assunto do e-mail está em letras maiúsculas'
    ],
    correct: 2
  },
  {
    situation: 'Dona Ana, 75 anos, lê no Facebook uma notícia com título alarmante: "URGENTE: governo vai taxar todos os depósitos no Pix acima de R$ 5!" A notícia tem milhares de compartilhamentos.',
    options: [
      'Compartilhar com todos os contatos para alertar',
      'Acreditar porque muitas pessoas já compartilharam',
      'Checar em sites jornalísticos confiáveis ou no site oficial do governo antes de qualquer ação',
      'Perguntar só para amigos do WhatsApp se é verdade'
    ],
    correct: 2
  },
  {
    situation: 'Seu Pedro, 70 anos, conhece online uma "pessoa" que diz ser um médico estrangeiro. Após meses de conversa carinhosa, pede dinheiro para uma "emergência".',
    options: [
      'Golpe do PIX — pede transferência bancária',
      'Golpe do falso pretendente — explora afeto e solidão para obter dinheiro',
      'Golpe de phishing — usa e-mail com link falso',
      'Golpe do falso suporte técnico'
    ],
    correct: 1
  },
  {
    situation: 'Dona Rosa, 65 anos, recebe uma ligação de alguém dizendo ser do "suporte do banco". A pessoa sabe o nome dela, o banco e pede para confirmar a senha do cartão.',
    options: [
      'Confirmar os dados pois o atendente parece saber quem ela é',
      'Informar apenas os 4 primeiros dígitos do cartão',
      'Desligar e ligar para o banco pelo número oficial no verso do cartão',
      'Pedir que a ligação seja transferida para um supervisor'
    ],
    correct: 2
  },
  {
    situation: 'Seu Carlos, 78 anos, recebe um SMS dizendo que ganhou um prêmio de R$ 10.000. Para receber, deve clicar num link e pagar uma "taxa de liberação" de R$ 150.',
    options: [
      'Prêmios reais nunca chegam por SMS',
      'O valor do prêmio parece alto demais',
      'Prêmios legítimos nunca exigem pagamento prévio para serem liberados',
      'Ele não se cadastrou em nenhum sorteio'
    ],
    correct: 2
  }
];

let currentQ = 0;
let score     = 0;
let answered  = false;

function renderQuestion() {
  answered = false;
  const q    = questions[currentQ];
  const area = document.getElementById('quiz-question-area');

  document.getElementById('quiz-progress-text').textContent =
    `Pergunta ${currentQ + 1} de ${questions.length}`;
  document.getElementById('quiz-score').textContent =
    `Pontos: ${score}`;
  document.getElementById('quiz-bar').style.width =
    (((currentQ) / questions.length) * 100 + (100 / questions.length) * 0.15) + '%';

  area.innerHTML = `
    <p class="eyebrow mb-3" style="color:var(--ink-soft);opacity:.7;">
      Situação ${currentQ + 1} de ${questions.length}
    </p>
    <p class="font-archivo text-[16px] md:text-[17px] font-medium leading-relaxed mb-6"
       style="color:var(--ink);">${q.situation}</p>
    <div class="space-y-3" id="options-list">
      ${q.options.map((opt, i) => `
        <button type="button"
          class="quiz-option w-full text-left p-4 border-2 font-archivo text-[14px]"
          style="border-color:rgba(0,0,0,0.18);background:#fff;color:var(--ink);"
          data-idx="${i}">
          <span class="font-display text-[20px] mr-2" style="color:var(--blue);">
            ${String.fromCharCode(65 + i)}
          </span> ${opt}
        </button>
      `).join('')}
    </div>
    <button type="button" id="next-btn"
      class="mt-7 inline-flex items-center gap-2 px-6 py-3 font-archivo font-bold text-[14px] hard-shadow opacity-40 pointer-events-none transition"
      style="background:var(--yellow);color:var(--ink);" disabled>
      ${currentQ < questions.length - 1 ? 'Próxima' : 'Ver resultado'}
      <i data-lucide="arrow-right" style="width:16px;height:16px"></i>
    </button>
  `;

  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.idx)));
  });
  document.getElementById('next-btn').addEventListener('click', nextQuestion);
  lucide.createIcons();
}

function selectAnswer(idx) {
  if (answered) return;
  answered = true;
  const correct = questions[currentQ].correct;
  if (idx === correct) score++;

  document.querySelectorAll('.quiz-option').forEach((btn, i) => {
    if (i === correct)  btn.classList.add('correct');
    else if (i === idx) btn.classList.add('incorrect');
    btn.style.pointerEvents = 'none';
  });

  const nextBtn = document.getElementById('next-btn');
  nextBtn.classList.remove('opacity-40', 'pointer-events-none');
  nextBtn.disabled = false;
  document.getElementById('quiz-score').textContent = `Pontos: ${score}`;
}

function nextQuestion() {
  currentQ++;
  if (currentQ >= questions.length) showResult();
  else renderQuestion();
}

function showResult() {
  document.getElementById('quiz-question-area').classList.add('hidden');
  document.getElementById('quiz-progress').classList.add('hidden');
  document.getElementById('quiz-bar').parentElement.classList.add('hidden');
  document.getElementById('quiz-result').classList.remove('hidden');
  document.getElementById('quiz-final-score').textContent = `${score}/${questions.length}`;

  const msg = document.getElementById('quiz-result-msg');
  if (score === questions.length)
    msg.textContent = 'Nota máxima! Você é uma referência em segurança digital para sua família.';
  else if (score >= 4)
    msg.textContent = 'Muito bem! Você demonstrou boa consciência sobre segurança digital. Compartilhe esse conhecimento com quem você ama.';
  else if (score >= 2)
    msg.textContent = 'Há espaço para aprofundar. Reveja o material e converse com idosos próximos sobre essas situações.';
  else
    msg.textContent = 'Esses golpes são sofisticados — refaça o quiz e leia novamente os casos. Conhecimento é a melhor proteção.';

  lucide.createIcons();
}

function restartQuiz() {
  currentQ = 0;
  score    = 0;
  document.getElementById('quiz-question-area').classList.remove('hidden');
  document.getElementById('quiz-progress').classList.remove('hidden');
  document.getElementById('quiz-bar').parentElement.classList.remove('hidden');
  document.getElementById('quiz-result').classList.add('hidden');
  renderQuestion();
}

document.getElementById('quiz-restart-btn').addEventListener('click', restartQuiz);
renderQuestion();