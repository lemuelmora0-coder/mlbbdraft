import { META_CONTEXT } from './heroes.js';

const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';

/**
 * Build the prompt for AI draft suggestions
 */
function buildDraftPrompt(state, action) {
  const bluePicks = state.bluePicks.filter(Boolean).map(h => h.name).join(', ') || 'none yet';
  const redPicks  = state.redPicks.filter(Boolean).map(h => h.name).join(', ') || 'none yet';
  const blueBans  = state.blueBans.filter(Boolean).map(h => h.name).join(', ') || 'none yet';
  const redBans   = state.redBans.filter(Boolean).map(h => h.name).join(', ') || 'none yet';
  const available = state.availableHeroes.map(h => h.name).join(', ');
  const team      = action.team === 'blue' ? state.blueTeamName : state.redTeamName;
  const enemy     = action.team === 'blue' ? state.redTeamName  : state.blueTeamName;
  const actionType = action.type;

  return `You are an expert MPL PH (Mobile Legends Professional League Philippines) draft analyst.

${META_CONTEXT}

Current Draft State:
- Blue Side (${state.blueTeamName}):
  Picks: ${bluePicks}
  Bans:  ${blueBans}
- Red Side (${state.redTeamName}):
  Picks: ${redPicks}
  Bans:  ${redBans}

Available heroes: ${available}

Current action: ${team} must ${actionType} a hero.
${actionType === 'ban' ? `Consider which hero would be most dangerous in enemy (${enemy}) hands, or which hero poses the biggest threat given the current draft state.` : `Consider synergy with existing picks, role coverage, and counter-picks against ${enemy}.`}

Provide your recommendation in this EXACT JSON format (no markdown, no extra text):
{
  "hero": "<hero name exactly as listed in available heroes>",
  "reasoning": "<2-3 sentence explanation referencing MPL S17 meta and current draft state>",
  "alternatives": ["<hero2>", "<hero3>"],
  "winCondition": "<brief win condition for ${team} if they follow this pick>",
  "threatLevel": "<LOW | MEDIUM | HIGH | CRITICAL>"
}`;
}

/**
 * Call the Anthropic API for a draft suggestion
 */
async function getDraftSuggestion(apiKey, state, action) {
  const prompt = buildDraftPrompt(state, action);

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    // Fallback: extract JSON from text
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI response');
  }
}

/**
 * Analyze completed draft and return team composition summary
 */
async function analyzeDraft(apiKey, state) {
  const bluePicks = state.bluePicks.filter(Boolean).map(h => h.name).join(', ');
  const redPicks  = state.redPicks.filter(Boolean).map(h => h.name).join(', ');

  const prompt = `You are an expert MPL PH analyst. Analyze this completed draft:

${META_CONTEXT}

Blue Side (${state.blueTeamName}): ${bluePicks}
Red Side (${state.redTeamName}): ${redPicks}

Provide a concise draft analysis in EXACT JSON format (no markdown):
{
  "blueWinCondition": "<main win condition for blue side>",
  "redWinCondition": "<main win condition for red side>",
  "blueStrengths": ["<strength1>", "<strength2>"],
  "redStrengths": ["<strength1>", "<strength2>"],
  "keyMatchup": "<the most important hero matchup to watch>",
  "prediction": "<which team has the draft advantage and why, in 1-2 sentences>",
  "advantage": "blue" | "red" | "even"
}`;

  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-calls': 'true',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 700,
      messages:   [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) throw new Error(`API error ${response.status}`);

  const data = await response.json();
  const text = data.content?.[0]?.text || '';

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse analysis');
  }
}

export { getDraftSuggestion, analyzeDraft };
