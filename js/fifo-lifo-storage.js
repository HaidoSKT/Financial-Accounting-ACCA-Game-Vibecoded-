/**
 * FIFO vs LIFO Master - Data Storing & Persistence System
 * Dual-layer architecture: LocalStorage + Server-side REST API (/api/inventory/*)
 * Includes Audit Trail Logging, Multi-scenario Company Slots, and JSON Import/Export.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.InventoryStorage = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

  const STORAGE_KEY = 'fifo_lifo_master_storage_v1';

  const DEFAULT_STATE = {
    profile: {
      name: 'Inventory Controller',
      companyName: 'Apex Supply Chain Corp',
      avatar: '📦',
      level: 1,
      xp: 0,
      xpToNextLevel: 200,
      coins: 50,
      currentStreak: 0,
      maxStreak: 0,
      totalCorrect: 0,
      totalWrong: 0,
      soundEnabled: true
    },
    stats: {
      simulatorRuns: 0,
      dispatchSolved: 0,
      ledgerSolved: 0,
      cfoStrategyScore: 0,
      customCompaniesCreated: 0
    },
    badges: [], // [{ id, unlockedAt }]
    history: [], // Audit trail log entries
    customCompanies: [] // User-created sandbox inventory scenarios
  };

  class InventoryStorageManager {
    constructor() {
      this.data = this.loadFromLocal();
      this.isBackendAvailable = false;
      this.statusListeners = [];
      this.initBackend();
    }

    onStatusChange(callback) {
      if (typeof callback === 'function') {
        this.statusListeners.push(callback);
        callback(this.getStatusInfo());
      }
    }

    notifyStatusChange() {
      const status = this.getStatusInfo();
      this.statusListeners.forEach(cb => {
        try { cb(status); } catch (e) { console.error('Storage listener err:', e); }
      });
    }

    getStatusInfo() {
      return {
        backendAvailable: this.isBackendAvailable,
        mode: this.isBackendAvailable ? 'Server REST API + LocalStorage' : 'LocalStorage Offline',
        saveKey: STORAGE_KEY,
        historyCount: this.data.history.length,
        companiesCount: this.data.customCompanies.length
      };
    }

    loadFromLocal() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
            stats: { ...DEFAULT_STATE.stats, ...(parsed.stats || {}) },
            badges: Array.isArray(parsed.badges) ? parsed.badges : [],
            history: Array.isArray(parsed.history) ? parsed.history : [],
            customCompanies: Array.isArray(parsed.customCompanies) ? parsed.customCompanies : []
          };
        }
      } catch (err) {
        console.warn('LocalStorage read error, initializing default state:', err);
      }
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }

    save() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        this.syncToServer();
      } catch (err) {
        console.error('LocalStorage write error:', err);
      }
    }

    async initBackend() {
      try {
        const res = await fetch('/api/health', { method: 'GET' });
        if (res.ok) {
          this.isBackendAvailable = true;
          this.notifyStatusChange();
          await this.syncFromServer();
        } else {
          this.isBackendAvailable = false;
          this.notifyStatusChange();
        }
      } catch {
        this.isBackendAvailable = false;
        this.notifyStatusChange();
      }
    }

    async syncFromServer() {
      if (!this.isBackendAvailable) return;
      try {
        const res = await fetch('/api/inventory/load', { method: 'GET' });
        if (res.ok) {
          const serverData = await res.json();
          if (serverData && serverData.profile) {
            // Merge: Server state is primary if it has higher or equal XP
            if ((serverData.profile.xp || 0) >= (this.data.profile.xp || 0)) {
              this.data.profile = { ...this.data.profile, ...serverData.profile };
              this.data.stats = { ...this.data.stats, ...(serverData.stats || {}) };
              if (Array.isArray(serverData.badges) && serverData.badges.length > 0) {
                this.data.badges = serverData.badges;
              }
              if (Array.isArray(serverData.history) && serverData.history.length > 0) {
                this.data.history = serverData.history;
              }
              if (Array.isArray(serverData.customCompanies) && serverData.customCompanies.length > 0) {
                this.data.customCompanies = serverData.customCompanies;
              }
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
            } else {
              // Local is ahead, push to server
              this.syncToServer();
            }
          }
        }
      } catch (err) {
        console.warn('Server sync failed:', err);
      }
    }

    async syncToServer() {
      if (!this.isBackendAvailable) return;
      try {
        await fetch('/api/inventory/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.data)
        });
      } catch (err) {
        console.warn('Server save push failed:', err);
      }
    }

    // Award XP, coins, streaks and calculate career level-up
    awardProgress(xpGain, coinGain, isSuccess, modeName, actionDescription) {
      const p = this.data.profile;
      
      if (isSuccess) {
        p.currentStreak += 1;
        if (p.currentStreak > p.maxStreak) {
          p.maxStreak = p.currentStreak;
        }
        p.totalCorrect += 1;
        
        // Multiplier bonus on streak
        const multiplier = p.currentStreak >= 10 ? 2.5 : (p.currentStreak >= 5 ? 1.8 : (p.currentStreak >= 3 ? 1.3 : 1.0));
        const finalXp = Math.round(xpGain * multiplier);
        const finalCoins = Math.round(coinGain * multiplier);
        
        p.xp += finalXp;
        p.coins += finalCoins;

        // Check level-up against ranks
        const RANKS = [
          { level: 1, minXp: 0, title: 'Junior Stock Clerk' },
          { level: 2, minXp: 200, title: 'Warehouse Inventory Specialist' },
          { level: 3, minXp: 500, title: 'Cost Accounting Analyst' },
          { level: 4, minXp: 1000, title: 'Inventory Controller' },
          { level: 5, minXp: 1800, title: 'Senior Cost Accountant' },
          { level: 6, minXp: 2800, title: 'Supply Chain Finance Manager' },
          { level: 7, minXp: 4000, title: 'Director of Financial Reporting' },
          { level: 8, minXp: 5500, title: 'Chief Financial Officer (CFO)' }
        ];

        let currentRank = RANKS[0];
        let nextRank = RANKS[1];

        for (let i = 0; i < RANKS.length; i++) {
          if (p.xp >= RANKS[i].minXp) {
            currentRank = RANKS[i];
            nextRank = RANKS[i + 1] || null;
          }
        }

        const oldLevel = p.level;
        p.level = currentRank.level;
        p.xpToNextLevel = nextRank ? nextRank.minXp : currentRank.minXp;

        const leveledUp = p.level > oldLevel;

        this.addAuditLog({
          mode: modeName,
          action: actionDescription,
          isSuccess: true,
          xpEarned: finalXp,
          coinsEarned: finalCoins,
          streak: p.currentStreak
        });

        this.save();
        return { leveledUp, newRank: currentRank, finalXp, finalCoins, streak: p.currentStreak };
      } else {
        p.currentStreak = 0;
        p.totalWrong += 1;

        this.addAuditLog({
          mode: modeName,
          action: actionDescription,
          isSuccess: false,
          xpEarned: 0,
          coinsEarned: 0,
          streak: 0
        });

        this.save();
        return { leveledUp: false, streak: 0 };
      }
    }

    addAuditLog(entry) {
      const logItem = {
        id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toISOString(),
        ...entry
      };
      this.data.history.unshift(logItem);
      // Keep recent 100 logs
      if (this.data.history.length > 100) {
        this.data.history = this.data.history.slice(0, 100);
      }
    }

    unlockBadge(badgeId) {
      if (!this.data.badges.some(b => b.id === badgeId)) {
        this.data.badges.push({
          id: badgeId,
          unlockedAt: new Date().toISOString()
        });
        this.addAuditLog({
          mode: 'ACHIEVEMENT',
          action: `Unlocked Badge: ${badgeId}`,
          isSuccess: true,
          xpEarned: 50,
          coinsEarned: 25,
          streak: this.data.profile.currentStreak
        });
        this.data.profile.coins += 25;
        this.data.profile.xp += 50;
        this.save();
        return true;
      }
      return false;
    }

    hasBadge(badgeId) {
      return this.data.badges.some(b => b.id === badgeId);
    }

    // Custom Company Sandbox persistence
    saveCustomCompany(company) {
      const existingIdx = this.data.customCompanies.findIndex(c => c.id === company.id);
      if (existingIdx >= 0) {
        this.data.customCompanies[existingIdx] = {
          ...company,
          updatedAt: new Date().toISOString()
        };
      } else {
        this.data.customCompanies.push({
          ...company,
          id: company.id || 'cust_' + Date.now(),
          createdAt: new Date().toISOString()
        });
      }
      this.data.stats.customCompaniesCreated = this.data.customCompanies.length;
      this.unlockBadge('tycoon_builder');
      this.save();
      return company;
    }

    deleteCustomCompany(companyId) {
      this.data.customCompanies = this.data.customCompanies.filter(c => c.id !== companyId);
      this.save();
    }

    // Export entire database state to downloadable JSON
    exportBackupJSON() {
      const backupPayload = {
        schema: 'fifo_lifo_master_export_v1',
        exportedAt: new Date().toISOString(),
        data: this.data
      };
      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_master_save_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // Import from JSON string / file
    importBackupJSON(jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        let targetData = null;
        if (parsed.schema === 'fifo_lifo_master_export_v1' && parsed.data) {
          targetData = parsed.data;
        } else if (parsed.profile) {
          targetData = parsed;
        }

        if (!targetData || !targetData.profile) {
          throw new Error('Invalid save file format. Missing profile data.');
        }

        this.data = {
          profile: { ...DEFAULT_STATE.profile, ...targetData.profile },
          stats: { ...DEFAULT_STATE.stats, ...(targetData.stats || {}) },
          badges: Array.isArray(targetData.badges) ? targetData.badges : [],
          history: Array.isArray(targetData.history) ? targetData.history : [],
          customCompanies: Array.isArray(targetData.customCompanies) ? targetData.customCompanies : []
        };

        this.save();
        this.notifyStatusChange();
        return { success: true, profile: this.data.profile };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    resetAllData() {
      this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this.save();
      this.notifyStatusChange();
    }
  }

  return InventoryStorageManager;
});
