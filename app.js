import { HEROES, DRAFT_ORDER } from './heroes.js';
import {
  createDraftState,
  getCurrentAction,
  applySelection,
  undoLastSelection,
  getPhaseLabel,
  getDraftProgress,
  filterHeroes,
} from './draft.js';
import { getDraftSuggestion, analyzeDraft } from './ai.js';

// ─────────────────────────────────────────
//  State
// ─────────────────────────────────────────
let draftState   = null;
let apiKey       = sessionStorage.getItem('mpl_draft_api_key') || '';
let currentRole  = 'all';
let searchQuery  = '';
let suggestedId  = null;
let autoMode     = false;
let tooltip      = document.getElementById('hero-tooltip');

// ─────────────────────────────────────────
//  Boot
// ─────────────────────────────────────────
(function init() {
  if (!apiKey) {
    document.getElementById('modal-api-key').classList.remove('hidden');
  }
  bindStaticEvents();
})();

// ─────────────────────────────────────────
//  Static event bindings (always-on)
// ─────────────────────────────────────────
function bindStaticEvents() {
  // API Key modal
  document.getElementById('btn-save-api').addEventListener('click', () => {
    const val = document.getElementById('api-key-input').value.trim();
    if (val) {
      apiKey = val;
      sessionStorage.setItem('mpl_draft_api_key', val);
      toast('API key saved ✓', 'success');
    }
    document.getElementById('modal-api-key').classList.add('hidden');
    updateAIButtons();
  });

  document.getElementById('btn-skip-api').addEventListener('click', () => {
    document.getElementById('modal-api-key').classList.add('hidden');
  });

  document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('api-key-input').value = apiKey;
    document.getElementById('modal-api-key').classList.remove('hidden');
  });

  // Setup screen
  document.getElementById('btn-start-draft').addEventListener('click', startDraft);

  // Phase bar controls
  document.getElementById('btn-reset-draft').addEventListener('click', resetDraft);
  document.getElementById('btn-undo').addEventListener('click', handleUndo);
  document.getElementById('btn-analyze').addEventListener('click', openAnalysis);

  // AI controls
  document.getElementById('btn-ai-suggest').addEventListener('click', requestSuggestion);
  document.getElementById('btn-ai-auto').addEventListener('click', toggleAutoMode);

  // Hero search
  document.getElementById('hero-search').addEventListener('input', e => {
    searchQuery = e.target.value;
    renderHeroGrid();
  });

  // Role filters
  document.getElementById('role-filters').addEventListener('click', e => {
    const btn = e.target.closest('.role-btn');
    if (!btn) return;
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentRole = btn.dataset.role;
    renderHeroGrid();
  });

  // Close analysis modal
  document.getElementById('btn-close-analysis').addEventListener('click', () => {
    document.getElementById('modal-analysis').classList.add('hidden');
  });

  // Tooltip
  document.addEventListener('mousemove', e => {
    if (tooltip.classList.contains('visible')) {
      const pad = 12;
      const tw = tooltip.offsetWidth;
      const th = tooltip.offsetHeight;
      let x = e.clientX + pad;
      let y = e.clientY + pad;
      if (x + tw > window.innerWidth)  x = e.clientX - tw - pad;
      if (y + th > window.innerHeight) y = e.clientY - th - pad;
      tooltip.style.left = x + 'px';
      tooltip.style.top  = y + 'px';
    }
  });
}

// ─────────────────────────────────────────
//  Draft lifecycle
// ─────────────────────────────────────────
function startDraft() {
  const blue = document.getElementById('select-blue-team').value;
  const red  = document.getElementById('select-red-team').value;
  draftState = createDraftState(blue, red);

  document.getElementById('setup-screen').classList.add('hidden');
  document.getElementById('draft-container').classList.remove('hidden');

  document.getElementById('blue-team-name').textContent = blue;
  document.getElementById('red-team-name').textContent  = red;

  renderAll();
  updateAIButtons();
}

function resetDraft() {
  if (draftState && !draftState.isComplete && draftState.step > 0) {
    if (!confirm('Reset the current draft?')) return;
  }
  draftState = null;
  suggestedId = null;
  autoMode = false;
  clearAI();

  document.getElementById('draft-container').classList.add('hidden');
  document.getElementById('setup-screen').classList.remove('hidden');
}

function handleUndo() {
  if (!draftState || draftState.step === 0) return;
  draftState  = undoLastSelection(draftState);
  suggestedId = null;
  clearAI();
  renderAll();
}

// ─────────────────────────────────────────
//  Hero selection
// ─────────────────────────────────────────
function selectHero(hero) {
  if (!draftState || draftState.isComplete) return;
  const action = getCurrentAction(draftState);
  if (!action) return;

  draftState  = applySelection(draftState, hero);
  suggestedId = null;
  clearAI();
  renderAll();

  if (draftState.isComplete) {
    updatePhaseLabel();
    toast('Draft complete! Click "Analyze Draft" for a breakdown.', 'success');
    document.getElementById('btn-analyze').removeAttribute('disabled');
    return;
  }

  if (autoMode && apiKey) {
    setTimeout(requestSuggestion, 400);
  }
}

// ─────────────────────────────────────────
//  Render helpers
// ─────────────────────────────────────────
function renderAll() {
  updatePhaseLabel();
  renderBans();
  renderPicks();
  renderHeroGrid();
  highlightActiveSlots();
  updateProgress();
}

function updatePhaseLabel() {
  const label = document.getElementById('phase-label');
  const step  = draftState ? draftState.step : 0;
  const text  = getPhaseLabel(step);
  label.textContent = text;

  label.className = 'phase-label';
  if (!draftState || draftState.isComplete) {
    label.classList.add('done');
  } else {
    const action = getCurrentAction(draftState);
    label.classList.add(action.team === 'blue' ? 'blue-turn' : 'red-turn');
  }
}

function updateProgress() {
  const pct = draftState ? getDraftProgress(draftState.step) : 0;
  document.getElementById('progress-bar').style.width = pct + '%';
}

function renderBans() {
  if (!draftState) return;
  ['blue', 'red'].forEach(side => {
    const bans = draftState[side + 'Bans'];
    for (let i = 0; i < 4; i++) {
      const el   = document.getElementById(`${side}-ban-${i}`);
      const hero = bans[i];
      el.innerHTML = '';
      el.classList.remove('filled', 'active-slot');
      if (hero) {
        el.classList.add('filled');
        el.innerHTML = `
          <span class="hero-icon">${hero.icon}</span>
          <span class="ban-x">✕</span>
          <span class="hero-mini-name">${hero.name}</span>
        `;
      } else {
        el.innerHTML = `<span class="hero-mini-name">—</span>`;
      }
    }
  });
}

function renderPicks() {
  if (!draftState) return;
  ['blue', 'red'].forEach(side => {
    const picks = draftState[side + 'Picks'];
    for (let i = 0; i < 5; i++) {
      const el   = document.getElementById(`${side}-pick-${i}`);
      const hero = picks[i];
      el.innerHTML = '';
      el.classList.remove('filled', 'active-slot');
      if (hero) {
        el.classList.add('filled');
        el.innerHTML = `
          <div class="pick-hero-icon">${hero.icon}</div>
          <div class="pick-hero-info">
            <div class="pick-hero-name">${hero.name}</div>
            <div class="pick-hero-role" style="color:var(--role-${hero.role.toLowerCase()})">${hero.role}</div>
          </div>
          <span class="pick-slot-num">#${i+1}</span>
        `;
      } else {
        el.innerHTML = `<span class="empty-pick-label">Pick ${i+1}</span><span class="pick-slot-num">#${i+1}</span>`;
      }
    }
  });
}

function highlightActiveSlots() {
  if (!draftState || draftState.isComplete) return;
  const action = getCurrentAction(draftState);
  if (!action) return;

  const { team, type, slot } = action;
  const id = `${team}-${type}-${slot}`;
  const el = document.getElementById(id);
  if (el) el.classList.add('active-slot');
}

function renderHeroGrid() {
  const grid = document.getElementById('hero-grid');
  const usedSet = draftState ? draftState.usedHeroes : new Set();
  const visible = filterHeroes(HEROES, searchQuery, currentRole);

  grid.innerHTML = visible.map(hero => {
    const used = usedSet.has(hero.id);
    const sug  = suggestedId === hero.id;
    return `
      <div
        class="hero-card${used ? ' used' : ''}${sug ? ' suggested' : ''}"
        data-id="${hero.id}"
        data-name="${hero.name}"
      >
        <span class="hero-tier-badge tier-${hero.tier}">${hero.tier}</span>
        <span class="hero-icon-lg">${hero.icon}</span>
        <span class="hero-name">${hero.name}</span>
        <span class="hero-role-dot" style="background:var(--role-${hero.role.toLowerCase()})"></span>
      </div>
    `;
  }).join('');

  // Event delegation for clicks + tooltips
  grid.onclick = e => {
    const card = e.target.closest('.hero-card');
    if (!card || card.classList.contains('used')) return;
    const hero = HEROES.find(h => h.id === card.dataset.id);
    if (hero) selectHero(hero);
  };

  grid.addEventListener('mouseenter', handleCardHover, true);
  grid.addEventListener('mouseleave', handleCardLeave, true);
}

function handleCardHover(e) {
  const card = e.target.closest('.hero-card');
  if (!card) return;
  const hero = HEROES.find(h => h.id === card.dataset.id);
  if (!hero) return;

  document.getElementById('tip-name').textContent  = hero.name;
  document.getElementById('tip-role').textContent  = hero.role;
  document.getElementById('tip-role').style.color  = `var(--role-${hero.role.toLowerCase()})`;
  document.getElementById('tip-pick').textContent  = hero.pickRate + '%';
  document.getElementById('tip-ban').textContent   = hero.banRate + '%';
  document.getElementById('tip-win').textContent   = hero.winRate + '%';
  tooltip.classList.add('visible');
}

function handleCardLeave(e) {
  if (!e.relatedTarget?.closest('.hero-card')) {
    tooltip.classList.remove('visible');
  }
}

// ─────────────────────────────────────────
//  AI integration
// ─────────────────────────────────────────
function updateAIButtons() {
  const hasKey = !!apiKey;
  const canAct = hasKey && draftState && !draftState.isComplete;
  document.getElementById('btn-ai-suggest').disabled = !canAct;
  document.getElementById('btn-ai-auto').disabled    = !canAct;

  if (!hasKey) {
    document.getElementById('ai-idle').classList.remove('hidden');
    document.getElementById('ai-idle').textContent = 'Configure your API key to receive AI-powered draft suggestions based on MPL S17 meta.';
  } else if (!draftState) {
    document.getElementById('ai-idle').classList.remove('hidden');
    document.getElementById('ai-idle').textContent = 'Start a draft to receive AI-powered suggestions.';
  }
}

async function requestSuggestion() {
  if (!apiKey || !draftState || draftState.isComplete) return;
  const action = getCurrentAction(draftState);
  if (!action) return;

  showAILoading();

  try {
    const result = await getDraftSuggestion(apiKey, draftState, action);
    showAISuggestion(result);

    // Highlight suggested hero on grid
    const hero = HEROES.find(h => h.name.toLowerCase() === result.hero.toLowerCase());
    suggestedId = hero ? hero.id : null;
    renderHeroGrid();

  } catch (err) {
    showAIError(err.message);
  }
}

function toggleAutoMode() {
  autoMode = !autoMode;
  const btn = document.getElementById('btn-ai-auto');
  btn.textContent = autoMode ? '⏹ Stop Auto' : '⚡ Auto-Draft';
  btn.className   = autoMode ? 'btn btn-danger btn-sm' : 'btn btn-ghost btn-sm';
  if (autoMode) requestSuggestion();
}

function showAILoading() {
  document.getElementById('ai-idle').classList.add('hidden');
  document.getElementById('ai-result').classList.add('hidden');
  document.getElementById('ai-error').classList.add('hidden');
  document.getElementById('ai-loading').classList.remove('hidden');
}

function showAISuggestion(result) {
  document.getElementById('ai-loading').classList.add('hidden');
  document.getElementById('ai-idle').classList.add('hidden');
  document.getElementById('ai-error').classList.add('hidden');

  document.getElementById('ai-hero-name').textContent   = result.hero;
  document.getElementById('ai-reasoning').textContent   = result.reasoning;
  document.getElementById('ai-alt-1').textContent       = result.alternatives?.[0] || '';
  document.getElementById('ai-alt-2').textContent       = result.alternatives?.[1] || '';

  const badge = document.getElementById('ai-threat-badge');
  badge.textContent = result.threatLevel || 'MEDIUM';
  badge.className   = `ai-threat-badge threat-${result.threatLevel || 'MEDIUM'}`;

  document.getElementById('ai-result').classList.remove('hidden');
}

function showAIError(msg) {
  document.getElementById('ai-loading').classList.add('hidden');
  document.getElementById('ai-result').classList.add('hidden');
  const errEl = document.getElementById('ai-error');
  errEl.textContent = '⚠ ' + msg;
  errEl.classList.remove('hidden');
}

function clearAI() {
  document.getElementById('ai-loading').classList.add('hidden');
  document.getElementById('ai-result').classList.add('hidden');
  document.getElementById('ai-error').classList.add('hidden');
  document.getElementById('ai-idle').classList.remove('hidden');
  document.getElementById('ai-idle').textContent = apiKey
    ? 'Click "Suggest" for an AI recommendation based on MPL S17 meta.'
    : 'Configure your API key to receive AI-powered draft suggestions based on MPL S17 meta.';
  updateAIButtons();
}

// ─────────────────────────────────────────
//  Analysis modal
// ─────────────────────────────────────────
async function openAnalysis() {
  if (!draftState || !draftState.isComplete) return;
  const modal   = document.getElementById('modal-analysis');
  const loading = document.getElementById('analysis-loading');
  const content = document.getElementById('analysis-content');

  modal.classList.remove('hidden');
  loading.classList.remove('hidden');
  content.classList.add('hidden');
  content.innerHTML = '';

  if (!apiKey) {
    loading.classList.add('hidden');
    content.innerHTML = '<p style="color:var(--text-secondary);grid-column:1/-1">Configure an API key to get AI analysis.</p>';
    content.classList.remove('hidden');
    return;
  }

  try {
    const res = await analyzeDraft(apiKey, draftState);

    const advColor = res.advantage === 'blue' ? 'var(--blue-glow)' : res.advantage === 'red' ? 'var(--red-glow)' : 'var(--text-primary)';
    const blueStrengths = (res.blueStrengths || []).map(s => `<div class="analysis-strength">${s}</div>`).join('');
    const redStrengths  = (res.redStrengths  || []).map(s => `<div class="analysis-strength">${s}</div>`).join('');

    content.innerHTML = `
      <div class="analysis-team-block blue">
        <div class="analysis-team-name">${draftState.blueTeamName}</div>
        <div class="analysis-win-con">${res.blueWinCondition || ''}</div>
        <div class="analysis-strengths">${blueStrengths}</div>
      </div>
      <div class="analysis-team-block red">
        <div class="analysis-team-name">${draftState.redTeamName}</div>
        <div class="analysis-win-con">${res.redWinCondition || ''}</div>
        <div class="analysis-strengths">${redStrengths}</div>
      </div>
      <div class="analysis-prediction">
        <div class="analysis-prediction-label">Key Matchup to Watch</div>
        <div class="analysis-prediction-text" style="margin-bottom:0.75rem;color:var(--gold-bright)">${res.keyMatchup || ''}</div>
        <div class="analysis-prediction-label">AI Prediction</div>
        <div class="analysis-prediction-text"><span style="color:${advColor};font-weight:700">${res.advantage?.toUpperCase() || 'EVEN'} ADVANTAGE</span> — ${res.prediction || ''}</div>
      </div>
    `;

    loading.classList.add('hidden');
    content.classList.remove('hidden');

  } catch (err) {
    loading.classList.add('hidden');
    content.innerHTML = `<p style="color:var(--red-accent);grid-column:1/-1">Analysis failed: ${err.message}</p>`;
    content.classList.remove('hidden');
  }
}

// ─────────────────────────────────────────
//  Toast notifications
// ─────────────────────────────────────────
function toast(msg, type = '') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 3200);
}
