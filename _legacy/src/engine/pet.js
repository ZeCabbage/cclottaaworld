/* ============================================
   Character Engine — Stats & Progression
   RPG-lite stat system for personal characters
   ============================================ */

const PetEngine = {
  // Keep name "PetEngine" to avoid breaking every reference across screens

  /* ---- Stat Boosting ---- */
  boostStat(character, statName, amount) {
    if (!character || !character.stats || character.stats[statName] === undefined) return;
    character.stats[statName] = Math.min(999, character.stats[statName] + amount);
    character.totalXP = (character.totalXP || 0) + amount;

    // Level up check
    this.checkLevelUp(character);
    SaveManager.autoSave();
  },

  boostStats(character, boosts) {
    if (!character) return;
    Object.entries(boosts).forEach(([stat, amount]) => {
      if (character.stats[stat] !== undefined) {
        character.stats[stat] = Math.min(999, character.stats[stat] + amount);
        character.totalXP = (character.totalXP || 0) + amount;
      }
    });
    this.checkLevelUp(character);
    SaveManager.autoSave();
  },

  /* ---- Level system ---- */
  checkLevelUp(character) {
    // Level up every 50 total XP
    const newLevel = Math.floor((character.totalXP || 0) / 50) + 1;
    if (newLevel > (character.level || 1)) {
      character.level = newLevel;
      return true; // leveled up
    }
    return false;
  },

  getLevelProgress(character) {
    const xp = character.totalXP || 0;
    const currentLevelXP = ((character.level || 1) - 1) * 50;
    const nextLevelXP = (character.level || 1) * 50;
    return {
      current: xp - currentLevelXP,
      needed: 50,
      percent: Math.min(100, ((xp - currentLevelXP) / 50) * 100),
    };
  },

  /* ---- Interact (clicking character in town/profile) ---- */
  interactCharacter(character) {
    if (!character) return;
    // Small charisma boost from interactions
    this.boostStat(character, 'charisma', 1);
  },

  /* ---- Stat Display Helpers ---- */
  renderStatBars(character) {
    if (!character || !character.stats) return '';
    const stats = character.stats;
    const icons = { strength: 'STR', speed: 'SPD', intelligence: 'INT', charisma: 'CHA', stamina: 'STA' };
    const colors = { strength: '#FF6347', speed: '#FFD700', intelligence: '#00BFFF', charisma: '#FF69B4', stamina: '#32CD32' };
    return Object.entries(stats).map(([stat, val]) => `
      <div style="display: flex; align-items: center; gap: 6px; margin: 3px 0;">
        <span style="width: 20px;">${icons[stat] || '•'}</span>
        <span style="width: 80px; font-size: 10px; text-transform: capitalize; color: rgba(255,255,255,0.7);">${stat}</span>
        <div style="flex: 1; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${(val / 999) * 100}%; background: ${colors[stat] || '#888'}; border-radius: 4px; transition: width 0.3s;"></div>
        </div>
        <span style="width: 30px; text-align: right; font-size: 9px; color: rgba(255,255,255,0.5);">${val}</span>
      </div>
    `).join('');
  },

  renderLevelBadge(character) {
    if (!character) return '';
    const prog = this.getLevelProgress(character);
    return `
      <div style="display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; background: rgba(255,255,255,0.05); border-radius: 12px;">
        <span style="font-family: var(--font-pixel); font-size: 10px; color: #FFD700;">Lv.${character.level || 1}</span>
        <div style="width: 60px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
          <div style="height: 100%; width: ${prog.percent}%; background: #FFD700; border-radius: 3px;"></div>
        </div>
        <span style="font-size: 8px; color: rgba(255,255,255,0.4);">${prog.current}/${prog.needed}</span>
      </div>
    `;
  },

  /* ---- Mood (simplified) ---- */
  getMoodEmoji(mood) {
    return { happy: ':)', neutral: ':|', excited: ':D', tired: '-.-', sad: ':(' }[mood] || ':|';
  },

  /* ---- Legacy compat: stat grades (used by some shop screens) ---- */
  getGradeColor(grade) {
    return { S: '#FFD700', A: '#FF69B4', B: '#00BFFF', C: '#32CD32', D: '#808080', E: '#555555' }[grade] || '#808080';
  },

  renderStatGrades(grades) {
    if (!grades) return '';
    return Object.entries(grades).map(([stat, grade]) =>
      `<span style="color: ${this.getGradeColor(grade)};">${stat}: ${grade}</span>`
    ).join(' ');
  },

  /* ---- Feed/Play/Rest — legacy stubs (called by shop screens) ---- */
  feed(character, item) {
    if (!character || !item) return;
    // Items now just boost stats
    if (item.statBoosts) this.boostStats(character, item.statBoosts);
  },
  play(character) {
    if (!character) return;
    this.boostStat(character, 'speed', 2);
    this.boostStat(character, 'stamina', 1);
  },
  rest(character) {
    if (!character) return;
    this.boostStat(character, 'stamina', 3);
  },
  petCreature(character) {
    this.interactCharacter(character);
  },
};
