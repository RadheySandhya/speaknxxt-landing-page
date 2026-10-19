/**
 * SPEAKNXXT - Interactive English Learning Engine & WhatsApp Flow Integrations
 */

document.addEventListener('DOMContentLoaded', () => {
  initAudioPronunciation();
  initDiagnosticQuiz();
  initDailyPracticeQuiz();
  initFaqAccordion();
  initCourseTabs();
  initLeadModal();
  initMobileMenu();
});

/* ==========================================================================
   1. Web Speech API Audio Pronunciation (Interactive Pronunciation Trainer)
   ========================================================================== */
function initAudioPronunciation() {
  const listenButtons = document.querySelectorAll('.listen-btn, .listen-twister-btn');
  
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  listenButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToSpeak = btn.getAttribute('data-speak') || 'Articulate';
      speakText(textToSpeak, btn);
    });
  });
}

function speakText(text, buttonElement) {
  window.speechSynthesis.cancel(); // Stop any ongoing speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.88; // Slightly slower for crisp clear diction practice
  utterance.pitch = 1.0;

  // Visual feedback on button
  if (buttonElement) {
    buttonElement.style.transform = 'scale(1.15)';
    buttonElement.style.borderColor = '#fbbf24';
  }

  utterance.onend = () => {
    if (buttonElement) {
      buttonElement.style.transform = '';
      buttonElement.style.borderColor = '';
    }
  };

  window.speechSynthesis.speak(utterance);
}

/* ==========================================================================
   2. Interactive English Diagnostic Test (CEFR Fluency Assessment)
   ========================================================================== */
const diagnosticQuestions = [
  {
    q: "1. Choose the grammatically correct sentence for professional communication:",
    options: [
      { text: "I look forward to meet you tomorrow.", correct: false },
      { text: "I look forward to meeting you tomorrow.", correct: true },
      { text: "I am looking forward for meeting you tomorrow.", correct: false },
      { text: "I look forward to meet with you tomorrow.", correct: false }
    ],
    hint: "'Look forward to' takes a gerund (-ing form)."
  },
  {
    q: "2. Which phrasal verb means 'to postpone or delay a meeting'?",
    options: [
      { text: "Call off", correct: false },
      { text: "Put off", correct: true },
      { text: "Turn down", correct: false },
      { text: "Take over", correct: false }
    ],
    hint: "'Put off' means to delay; 'Call off' means to cancel completely."
  },
  {
    q: "3. Complete the sentence: 'If I _____ harder, I would have cleared the IELTS 8 Band exam.'",
    options: [
      { text: "had studied", correct: true },
      { text: "studied", correct: false },
      { text: "have studied", correct: false },
      { text: "would study", correct: false }
    ],
    hint: "Third conditional structure: If + past perfect, would have + past participle."
  },
  {
    q: "4. Identify the correct replacement for the Indian English phrase: 'I have a doubt':",
    options: [
      { text: "I have a suspicion", correct: false },
      { text: "I have a clarification question", correct: true },
      { text: "I doubt you", correct: false },
      { text: "I am having confusion", correct: false }
    ],
    hint: "In international English, 'I have a question' or 'clarification' is preferred."
  },
  {
    q: "5. Which word best describes someone who speaks fluently and persuasively?",
    options: [
      { text: "Hesitant", correct: false },
      { text: "Ambiguous", correct: false },
      { text: "Eloquent", correct: true },
      { text: "Reticent", correct: false }
    ],
    hint: "'Eloquent' means fluent or persuasive in speaking or writing."
  }
];

let currentDiagnosticIndex = 0;
let userScore = 0;

function initDiagnosticQuiz() {
  const container = document.getElementById('diagnostic-container');
  if (!container) return;
  renderDiagnosticQuestion();
}

function renderDiagnosticQuestion() {
  const qObj = diagnosticQuestions[currentDiagnosticIndex];
  const qText = document.getElementById('diag-question-text');
  const optList = document.getElementById('diag-options-list');
  const stepLabel = document.getElementById('diag-step-label');
  const progressFill = document.getElementById('diag-progress-fill');
  const nextBtn = document.getElementById('diag-next-btn');

  if (!qText || !optList) return;

  stepLabel.textContent = `Question ${currentDiagnosticIndex + 1} of ${diagnosticQuestions.length}`;
  progressFill.style.width = `${((currentDiagnosticIndex + 1) / diagnosticQuestions.length) * 100}%`;
  qText.textContent = qObj.q;
  optList.innerHTML = '';
  nextBtn.style.display = 'none';

  qObj.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<span><strong>${String.fromCharCode(65 + idx)}.</strong> ${opt.text}</span> <i class="opt-icon"></i>`;
    btn.onclick = () => selectDiagnosticOption(btn, opt.correct, qObj.hint);
    optList.appendChild(btn);
  });
}

function selectDiagnosticOption(btn, isCorrect, hint) {
  const allBtns = document.querySelectorAll('#diag-options-list .quiz-opt-btn');
  allBtns.forEach(b => b.disabled = true);

  const feedbackEl = document.getElementById('diag-feedback');

  if (isCorrect) {
    btn.classList.add('correct');
    userScore++;
    feedbackEl.innerHTML = `<span style="color: #059669; display: inline-flex; align-items: center; gap: 0.4rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Excellent! Correct answer.</span>`;
  } else {
    btn.classList.add('incorrect');
    feedbackEl.innerHTML = `<span style="color: #dc2626; display: inline-flex; align-items: center; gap: 0.4rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Not quite. ${hint}</span>`;
  }

  const nextBtn = document.getElementById('diag-next-btn');
  nextBtn.style.display = 'inline-flex';
}

function handleNextDiagnostic() {
  const feedbackEl = document.getElementById('diag-feedback');
  feedbackEl.innerHTML = '';

  currentDiagnosticIndex++;
  if (currentDiagnosticIndex < diagnosticQuestions.length) {
    renderDiagnosticQuestion();
  } else {
    showDiagnosticResults();
  }
}

function showDiagnosticResults() {
  const quizPanel = document.getElementById('diagnostic-active-panel');
  const resultPanel = document.getElementById('diagnostic-result-panel');
  const scoreBadge = document.getElementById('result-score-badge');
  const levelTitle = document.getElementById('result-level-title');
  const levelDesc = document.getElementById('result-level-desc');
  const whatsappCta = document.getElementById('result-whatsapp-cta');

  quizPanel.style.display = 'none';
  resultPanel.style.display = 'block';

  let cefrLevel = "A2 - Elementary English";
  let recommendation = "Spoken English Foundation Batch with daily vocabulary building and sentence construction drills.";

  if (userScore >= 4) {
    cefrLevel = "C1 / B2 - Advanced Fluency";
    recommendation = "Business Communication, Public Speaking & IELTS 7.5+ Masterclass for elite career transformation.";
  } else if (userScore >= 2) {
    cefrLevel = "B1 - Intermediate Communicator";
    recommendation = "Fluency Accelerator Batch to eliminate hesitation, master complex tenses, and build natural conversation flow.";
  }

  scoreBadge.textContent = `${userScore}/${diagnosticQuestions.length}`;
  levelTitle.textContent = `Your Estimated Level: ${cefrLevel}`;
  levelDesc.textContent = `Based on your diagnostic score of ${userScore}/5, our recommendation is: ${recommendation}`;

  // Build WhatsApp message formatted according to WhatsApp Business Flows standard
  const encodedMsg = encodeURIComponent(
    `Hi Speaknxxt! I completed the English Fluency Diagnostic Test on your website.\n\n` +
    `*My Score:* ${userScore}/5\n` +
    `*Estimated CEFR Level:* ${cefrLevel}\n` +
    `*Recommended Program:* ${recommendation}\n\n` +
    `Please share my detailed assessment roadmap and book my 1-on-1 Free Demo Session with Mentor Kunal!`
  );

  whatsappCta.href = `https://wa.me/919810735296?text=${encodedMsg}`;
}

function resetDiagnostic() {
  currentDiagnosticIndex = 0;
  userScore = 0;
  document.getElementById('diagnostic-active-panel').style.display = 'block';
  document.getElementById('diagnostic-result-panel').style.display = 'none';
  renderDiagnosticQuestion();
}

/* ==========================================================================
   3. Daily Mini Practice Quiz (Interactive card on learning hub)
   ========================================================================== */
function initDailyPracticeQuiz() {
  const quizButtons = document.querySelectorAll('.daily-quiz-btn');
  const feedback = document.getElementById('daily-quiz-feedback');

  quizButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.getAttribute('data-correct') === 'true';
      quizButtons.forEach(b => b.classList.remove('correct', 'incorrect'));
      
      if (isCorrect) {
        btn.classList.add('correct');
        if (feedback) feedback.innerHTML = `<span style="color: #059669; display: inline-flex; align-items: center; gap: 0.4rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Perfect! "Resilient" means able to withstand or recover quickly from difficult conditions.</span>`;
      } else {
        btn.classList.add('incorrect');
        if (feedback) feedback.innerHTML = `<span style="color: #dc2626; display: inline-flex; align-items: center; gap: 0.4rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> That's not it. Try again! Notice the root word.</span>`;
      }
    });
  });
}

/* ==========================================================================
   4. Course Category Tabs
   ========================================================================== */
function initCourseTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const courseCards = document.querySelectorAll('.course-card');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      courseCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Lead Capture & WhatsApp Flows API Integration
   ========================================================================== */
function initLeadModal() {
  const modal = document.getElementById('lead-modal');
  const openButtons = document.querySelectorAll('.open-lead-modal-btn');
  const closeButton = document.getElementById('modal-close-btn');
  const leadForm = document.getElementById('whatsapp-lead-form');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const coursePref = btn.getAttribute('data-course-pref') || '';
      if (coursePref && document.getElementById('form-course')) {
        document.getElementById('form-course').value = coursePref;
      }
      modal.classList.add('active');
    });
  });

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Close when clicking outside modal window
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Handle Form Submission with WhatsApp Flow Dispatch
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('form-name').value.trim();
      const phone = document.getElementById('form-phone').value.trim();
      const course = document.getElementById('form-course').value;
      const mode = document.getElementById('form-mode').value;
      const timing = document.getElementById('form-timing').value;

      // WhatsApp Flows standardized payload architecture:
      // In accordance with Meta WhatsApp Flows Guides:
      // https://developers.facebook.com/documentation/business-messaging/whatsapp/flows/guides/flowsapi
      const flowPayload = {
        version: "3.0",
        screen: "APPOINTMENT_CONFIRMATION",
        data: {
          user_name: name,
          user_phone: phone,
          selected_course: course,
          learning_mode: mode,
          preferred_slot: timing,
          source_channel: "speaknxxt_web_landing"
        }
      };

      console.log("WhatsApp Flow Payload Structured for Meta Developer API:", flowPayload);

      // Construct WhatsApp URL with prefilled flow trigger
      const flowText = encodeURIComponent(
        `*ADMISSION ENQUIRY - SPEAKNXXT*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `• *Student Name:* ${name}\n` +
        `• *Contact:* ${phone}\n` +
        `• *Interested Course:* ${course}\n` +
        `• *Preferred Mode:* ${mode}\n` +
        `• *Preferred Slot:* ${timing}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `_I would like to book my Free Demo Session and access the Speaknxxt course material._`
      );

      // WhatsApp destination number (Configured to business phone)
      const targetPhone = "919810735296";
      const targetUrl = `https://wa.me/${targetPhone}?text=${flowText}`;

      // Open WhatsApp directly
      window.open(targetUrl, '_blank');

      // Close modal & reset form
      modal.classList.remove('active');
      leadForm.reset();
    });
  }
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Mobile Navigation Drawer & Backdrop Control
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const drawer = document.getElementById('mobile-nav-drawer');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const closeBtn = document.getElementById('mobile-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeDrawer);
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}
