import { HEROES, DRAFT_ORDER } from './heroes.js';

/**
 * Create initial draft state
 */
function createDraftState(blueTeamName = 'Blue Side', redTeamName = 'Red Side') {
  return {
    blueTeamName,
    redTeamName,
    bluePicks:  Array(5).fill(null),
    redPicks:   Array(5).fill(null),
    blueBans:   Array(4).fill(null),
    redBans:    Array(4).fill(null),
    usedHeroes: new Set(),
    step:       0,
    isComplete: false,
    history:    [],
    availableHeroes: [...HEROES],
  };
}

/**
 * Get the current draft action
 */
function getCurrentAction(state) {
  if (state.step >= DRAFT_ORDER.length) return null;
  return DRAFT_ORDER[state.step];
}

/**
 * Apply a hero selection to the draft state
 */
function applySelection(state, hero) {
  if (!hero || state.isComplete) return state;

  const action = getCurrentAction(state);
  if (!action) return state;

  const newState = {
    ...state,
    bluePicks:      [...state.bluePicks],
    redPicks:       [...state.redPicks],
    blueBans:       [...state.blueBans],
    redBans:        [...state.redBans],
    usedHeroes:     new Set(state.usedHeroes),
    availableHeroes: state.availableHeroes.filter(h => h.id !== hero.id),
    history:        [...state.history, { step: state.step, action, hero }],
    step:           state.step + 1,
  };

  newState.usedHeroes.add(hero.id);

  if (action.type === 'pick') {
    if (action.team === 'blue') newState.bluePicks[action.slot] = hero;
    else                        newState.redPicks[action.slot]  = hero;
  } else {
    if (action.team === 'blue') newState.blueBans[action.slot] = hero;
    else                        newState.redBans[action.slot]  = hero;
  }

  newState.isComplete = newState.step >= DRAFT_ORDER.length;
  return newState;
}

/**
 * Undo the last selection
 */
function undoLastSelection(state) {
  if (state.history.length === 0) return state;

  const last   = state.history[state.history.length - 1];
  const action = last.action;
  const hero   = last.hero;

  const newState = {
    ...state,
    bluePicks:       [...state.bluePicks],
    redPicks:        [...state.redPicks],
    blueBans:        [...state.blueBans],
    redBans:         [...state.redBans],
    usedHeroes:      new Set(state.usedHeroes),
    availableHeroes: [...state.availableHeroes, hero].sort((a, b) => a.name.localeCompare(b.name)),
    history:         state.history.slice(0, -1),
    step:            state.step - 1,
    isComplete:      false,
  };

  newState.usedHeroes.delete(hero.id);

  if (action.type === 'pick') {
    if (action.team === 'blue') newState.bluePicks[action.slot] = null;
    else                        newState.redPicks[action.slot]  = null;
  } else {
    if (action.team === 'blue') newState.blueBans[action.slot] = null;
    else                        newState.redBans[action.slot]  = null;
  }

  return newState;
}

/**
 * Get phase label
 */
function getPhaseLabel(step) {
  if (step >= DRAFT_ORDER.length) return 'Draft Complete';
  const action = DRAFT_ORDER[step];
  const team = action.team.charAt(0).toUpperCase() + action.team.slice(1);
  const type = action.type.charAt(0).toUpperCase() + action.type.slice(1);
  const phase = action.phase;
  return `Phase ${phase} — ${team} Side ${type}`;
}

/**
 * Get progress as percentage
 */
function getDraftProgress(step) {
  return Math.round((step / DRAFT_ORDER.length) * 100);
}

/**
 * Filter heroes by search and role
 */
function filterHeroes(heroes, query, role) {
  let filtered = heroes;
  if (role && role !== 'all') {
    filtered = filtered.filter(h => h.role.toLowerCase() === role.toLowerCase());
  }
  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(h => h.name.toLowerCase().includes(q));
  }
  return filtered;
}

export {
  createDraftState,
  getCurrentAction,
  applySelection,
  undoLastSelection,
  getPhaseLabel,
  getDraftProgress,
  filterHeroes,
};
