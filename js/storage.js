/**
 * ACCA Financial Accounting Master - Data Storage & Persistence Manager
 * Features Dual-Layer Persistence (LocalStorage + Optional REST API Backend)
 * with full JSON Export/Import & Audit Trail Logging.
 */

const STORAGE_KEY = 'acca_arena_data_v1';

const DEFAULT_PROFILE = {
  name: 'ACCA Candidate',
  title: 'Trainee Bookkeeper',
  avatar: 'ledger',
  level: 1,
  xp: 0,
  xpToNextLevel: 250,
  coins: 50,
  currentStreak: 0,
  maxStreak: 0,
  totalCorrect: 0,
  totalWrong: 0,
  stats: {
    deadClicScore: 0,
    tAccountScore: 0,
    detectiveScore: 0,
    statementScore: 0,
    inventoryScore: 0,
    blitzScore: 0,
  },
  badges: [],
  history: [],
};

const ACCA_RANKS = [
  { minXp: 0, title: 'Trainee Bookkeeper', level: 1 },
  { minXp: 200, title: 'Junior Accounts Assistant', level: 2 },
  { minXp: 500, title: 'General Ledger Accountant', level: 3 },
  { minXp: 1000, title: 'Senior Financial Accountant', level: 4 },
  { minXp: 1800, title: 'Audit Associate', level: 5 },
  { minXp: 2800, title: 'Financial Controller', level: 6 },
  { minXp: 4000, title: 'Finance Director (FD)', level: 7 },
  { minXp: 5500, title: 'ACCA Fellow (FCCA)', level: 8 },
];

const ALL_BADGES = [
  { id: 'first_step', name: 'First Double Entry', icon: '📝', desc: 'Recorded your first correct accounting entry' },
  { id: 'streak_5', name: 'Unshakable Ledger', icon: '🔥', desc: 'Achieved a combo streak of 5 correct answers' },
  { id: 'streak_10', name: 'Auditor’s Precision', icon: '⚡', desc: 'Achieved a 10x perfect streak without an error' },
  { id: 'dead_clic_hero', name: 'DEAD CLIC Virtuoso', icon: '🎯', desc: 'Scored 500+ points in DEAD CLIC Speed Arena' },
  { id: 't_account_pro', name: 'T-Account Master', icon: '⚖️', desc: 'Balanced accounts and mastered "to SPL" vs "balance c/d"' },
  { id: 'suspense_sleuth', name: 'Suspense Detective', icon: '🕵️', desc: 'Identified trial balance errors and cleared suspense to £0' },
  { id: 'sofp_architect', name: 'Statement Architect', icon: '🏛️', desc: 'Built a balanced SOFP and SPL with verified net assets' },
  { id: 'ias2_specialist', name: 'IAS 2 Inventory Pro', icon: '📦', desc: 'Mastered Lower of Cost and NRV & FIFO vs AVCO' },
  { id: 'trap_slayer', name: 'Exam Trap Slayer', icon: '🛡️', desc: 'Conquered high-stakes ACCA exam trap scenarios' },
  { id: 'chartered_ready', name: 'Charter Ready', icon: '🎓', desc: 'Reached Level 5 in your ACCA professional journey' },
];

class StorageManager {
  constructor() {
    this.data = this.load();
    this.isBackendAvailable = false;
    this.checkBackend();
  }

  load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PROFILE, ...parsed, stats: { ...DEFAULT_PROFILE.stats, ...(parsed.stats || {}) } };
      }
    } catch (e) {
      console.warn('Error loading localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      this.syncToBackend();
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  async checkBackend() {
    try {
      const res = await fetch('/api/health', { method: 'GET' });
      if (res.ok) {
        this.isBackendAvailable = true;
        this.syncFromBackend();
      }
    } catch {
      this.isBackendAvailable = false;
    }
  }

  async syncToBackend() {
    if (!this.isBackendAvailable) return;
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data),
      });
    } catch (e) {
      console.warn('Backend sync failed, falling back to local storage:', e);
    }
  }

  async syncFromBackend() {
    if (!this.isBackendAvailable) return;
    try {
      const res = await fetch('/api/load');
      if (res.ok) {
        const remoteData = await res.json();
        if (remoteData && remoteData.xp && remoteData.xp > this.data.xp) {
          this.data = remoteData;
          this.save();
        }
      }
    } catch (e) {
      console.warn('Backend load failed:', e);
    }
  }

  getProfile() {
    return this.data;
  }

  updateProfile(updates) {
    Object.assign(this.data, updates);
    this.save();
    return this.data;
  }

  addXp(amount) {
    this.data.xp += amount;
    this.data.coins += Math.floor(amount / 5);

    // Calculate level & rank
    let currentRank = ACCA_RANKS[0];
    for (const rank of ACCA_RANKS) {
      if (this.data.xp >= rank.minXp) {
        currentRank = rank;
      }
    }

    const leveledUp = currentRank.level > this.data.level;
    this.data.level = currentRank.level;
    this.data.title = currentRank.title;

    // Calculate XP needed for next rank
    const nextRank = ACCA_RANKS.find(r => r.level === this.data.level + 1);
    this.data.xpToNextLevel = nextRank ? nextRank.minXp : this.data.xp + 1000;

    if (leveledUp) {
      if (window.soundEngine) window.soundEngine.play('levelUp');
      if (this.data.level >= 5) {
        this.unlockBadge('chartered_ready');
      }
    }

    this.save();
    return { leveledUp, currentRank, xp: this.data.xp };
  }

  recordAnswer(isCorrect, mode = null) {
    if (isCorrect) {
      this.data.totalCorrect++;
      this.data.currentStreak++;
      if (this.data.currentStreak > this.data.maxStreak) {
        this.data.maxStreak = this.data.currentStreak;
      }
      this.unlockBadge('first_step');
      if (this.data.currentStreak >= 5) this.unlockBadge('streak_5');
      if (this.data.currentStreak >= 10) this.unlockBadge('streak_10');
    } else {
      this.data.totalWrong++;
      this.data.currentStreak = 0;
    }
    this.save();
  }

  recordGameSession(session) {
    // session: { modeId, modeName, score, accuracy, questionsAnswered, correctCount, durationSec, timestamp }
    const sessionEntry = {
      id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...session,
    };

    this.data.history.unshift(sessionEntry);
    if (this.data.history.length > 50) {
      this.data.history.pop();
    }

    // Update best mode score
    const modeKeyMap = {
      deadClic: 'deadClicScore',
      tAccount: 'tAccountScore',
      detective: 'detectiveScore',
      statements: 'statementScore',
      inventory: 'inventoryScore',
      blitz: 'blitzScore',
    };

    const statKey = modeKeyMap[session.modeId];
    if (statKey && (!this.data.stats[statKey] || session.score > this.data.stats[statKey])) {
      this.data.stats[statKey] = session.score;
    }

    // Badge triggers
    if (session.modeId === 'deadClic' && session.score >= 500) this.unlockBadge('dead_clic_hero');
    if (session.modeId === 'tAccount' && session.correctCount >= 3) this.unlockBadge('t_account_pro');
    if (session.modeId === 'detective' && session.score >= 300) this.unlockBadge('suspense_sleuth');
    if (session.modeId === 'statements' && session.accuracy === 100) this.unlockBadge('sofp_architect');
    if (session.modeId === 'inventory' && session.accuracy >= 90) this.unlockBadge('ias2_specialist');
    if (session.modeId === 'blitz' && session.accuracy >= 80) this.unlockBadge('trap_slayer');

    this.save();
    return sessionEntry;
  }

  unlockBadge(badgeId) {
    if (!this.data.badges.includes(badgeId)) {
      const badgeInfo = ALL_BADGES.find(b => b.id === badgeId);
      if (badgeInfo) {
        this.data.badges.push(badgeId);
        this.data.coins += 25;
        if (window.soundEngine) window.soundEngine.play('badge');
        this.save();
        if (window.showToast) {
          window.showToast(`🏆 Badge Unlocked: ${badgeInfo.name}! +25 Marks`, 'success');
        }
      }
    }
  }

  hasBadge(badgeId) {
    return this.data.badges.includes(badgeId);
  }

  getAllBadges() {
    return ALL_BADGES.map(b => ({
      ...b,
      unlocked: this.data.badges.includes(b.id),
    }));
  }

  exportDataJson() {
    return JSON.stringify({
      schema: 'acca_game_save_v1',
      exportedAt: new Date().toISOString(),
      data: this.data,
    }, null, 2);
  }

  importDataJson(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      const incoming = parsed.data || parsed;
      if (!incoming || typeof incoming !== 'object') {
        throw new Error('Invalid save file format');
      }
      this.data = {
        ...DEFAULT_PROFILE,
        ...incoming,
        stats: { ...DEFAULT_PROFILE.stats, ...(incoming.stats || {}) },
      };
      this.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetData() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    this.save();
    return this.data;
  }
}

window.storageManager = new StorageManager();
