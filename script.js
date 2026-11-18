(() => {
  const coinEvolutions = [
    { name: "Reality Coin", face: "", chance: 10000000, mult: 100000, color: "reality" },
    { name: "Star Coin", face: "", chance: 5000000, mult: 10000, color: "celestial" },
    { name: "Cosmic Coin", face: "", chance: 1000000, mult: 2500, color: "cosmic" },
    { name: "King's Coin", face: "", chance: 500000, mult: 500, color: "gold" },
    { name: "Radioactive Coin", face: "", chance: 100000, mult: 100, color: "radioactive" },
    { name: "Molten Coin", face: "", chance: 50000, mult: 50, color: "molten" },
    { name: "Diamond Coin", face: "", chance: 10000, mult: 15, color: "diamond" },
    { name: "Gold Coin", face: "", chance: 2500, mult: 5, color: "gold" },
    { name: "Silver Coin", face: "", chance: 500, mult: 2, color: "silver" }
  ];

  const prestigeMilestones = [
    { level: 1, name: "Pocket Reserve", reward: "Start each run with 100 coins" },
    { level: 3, name: "Founding Flipper", reward: "Start each run with 1 free Auto Flipper" },
    { level: 5, name: "Fortune's Favor", reward: "Permanent x2 base luck" },
    { level: 10, name: "Master Mint", reward: "All upgrades cost 10% less" }
  ];
  const challengeTarget = 1000;

  const defaultState = {
    coins: 0,
    perFlip: 1,
    prestigeLevel: 0,
    flipCount: 0,
    ownedCoins: ["Copper Coin"],
    equippedCoin: "Copper Coin",
    rareMultiplier: 1,
    luckLevel: 0,
    luckMultiplier: 1,
    upgradePurchases: 0,
    maxFlipPower: 1,
    autoFlippers: 0,
    buildingLevels: {},
    prestigeCount: 0,
    rareHistory: {},
    rushProgress: 0,
    rushReady: false,
    rushActiveUntil: 0,
    challengeActive: false,
    challengeProgress: 0,
    challengeFailed: false,
    challengeCompleted: false,
    equippedSkin: false,
    specialUpgradeLevels: {},
    secretGrantedCoins: [],
    secretGrantedBuildings: {},
    secretGrantedAutoFlippers: 0,
    secretPreviousEquippedCoin: null,
    secretPreviousKingCoinSkinEquipped: false,
    secretPreviousCoins: null,
    secretRushUntil: 0,
    kingCoinSkinUnlocked: false,
    kingCoinSkinEquipped: false,
    soundEnabled: true,
    lastSavedAt: Date.now()
  };

  let state = loadState();
  let secretSequenceDirection = "";
  let secretSequenceStep = 0;
  let kingCoinSkinSequenceArmed = false;
  let kingCoinSkinSoundToggles = 0;

  const colorTiers = [
    { count: 0, name: "Copper", emoji: "", mult: 1, className: "copper" },
    { count: 10, name: "Silver", emoji: "⚪", mult: 2, className: "silver" },
    { count: 20, name: "Gold", emoji: "🟡", mult: 5, className: "gold" },
    { count: 30, name: "Sapphire", emoji: "🔵", mult: 10, className: "sapphire" },
    { count: 40, name: "Amethyst", emoji: "🟣", mult: 25, className: "amethyst" },
    { count: 50, name: "Ruby", emoji: "🔴", mult: 50, className: "ruby" },
    { count: 60, name: "Emerald", emoji: "🟢", mult: 100, className: "emerald" },
    { count: 70, name: "Diamond", emoji: "💎", mult: 250, className: "diamond" },
    { count: 80, name: "Obsidian", emoji: "⚫", mult: 500, className: "obsidian" },
    { count: 90, name: "Prismatic", emoji: "🌈", mult: 1000, className: "reality" },
    { count: 100, name: "Celestial", emoji: "⭐", mult: 5000, className: "celestial" }
  ];

  const shopBuildings = [
    { id: "coin_seller", name: "Coin Seller", detail: "+2 coins/sec", baseCost: 100, cps: 2, icon: "seller" },
    { id: "coin_factory", name: "Coin Factory", detail: "+10 coins/sec", baseCost: 1000, cps: 10, icon: "factory" },
    { id: "coin_mine", name: "Coin Mine", detail: "+50 coins/sec", baseCost: 5000, cps: 50, icon: "mine" },
    { id: "coin_mint", name: "Coin Mint", detail: "+250 coins/sec", baseCost: 25000, cps: 250, icon: "mint" },
    { id: "coin_bank", name: "Coin Bank", detail: "+1,000 coins/sec", baseCost: 100000, cps: 1000, icon: "bank" },
    { id: "coin_train", name: "Coin Train", detail: "+5,000 coins/sec", baseCost: 500000, cps: 5000, icon: "train" },
    { id: "coin_city", name: "Coin City", detail: "+25,000 coins/sec", baseCost: 2500000, cps: 25000, icon: "city" },
    { id: "coin_empire", name: "Coin Empire", detail: "+100,000 coins/sec", baseCost: 10000000, cps: 100000, icon: "empire" },
    { id: "coin_planet", name: "Coin Planet", detail: "+500,000 coins/sec", baseCost: 50000000, cps: 500000, icon: "planet" },
    { id: "coin_galaxy", name: "Coin Galaxy", detail: "+2.5 million coins/sec", baseCost: 250000000, cps: 2500000, icon: "galaxy" },
    { id: "diamond_mint", name: "Diamond Mint", detail: "+10 million coins/sec", baseCost: 1000000000, cps: 10000000, icon: "diamond" },
    { id: "cosmic_vault", name: "Cosmic Vault", detail: "+50 million coins/sec", baseCost: 5000000000, cps: 50000000, icon: "vault" },
    { id: "galactic_treasury", name: "Galactic Treasury", detail: "+250 million coins/sec", baseCost: 25000000000, cps: 250000000, icon: "treasury" },
    { id: "reality_engine", name: "Reality Engine", detail: "+1 billion coins/sec", baseCost: 100000000000, cps: 1000000000, icon: "engine" },
    { id: "dark_matter_harvester", name: "Dark Matter Harvester", detail: "+5 billion coins/sec", baseCost: 500000000000, cps: 5000000000, icon: "matter" },
    { id: "stardust_refinery", name: "Stardust Refinery", detail: "+25 billion coins/sec", baseCost: 2500000000000, cps: 25000000000, icon: "stardust" },
    { id: "black_hole_bank", name: "Black Hole Bank", detail: "+100 billion coins/sec", baseCost: 10000000000000, cps: 100000000000, icon: "blackhole" }
  ];

  const specialUpgrades = [
    { id: "luck_upgrade", name: "Luck Upgrade", detail: "Improves all rare coin odds.", baseCost: 500, maxLevel: 6, icon: "luck" },
    { id: "flip_surge", name: "2x Flip Surge", detail: "Doubles Flip Power.", baseCost: 5000, maxLevel: 5, icon: "power" },
    { id: "rush_timer", name: "Rush Timer", detail: "+5 seconds to Mint Rush.", baseCost: 15000, maxLevel: 5, icon: "auto" },
    { id: "rush_overdrive", name: "Rush Overdrive", detail: "Mint Rush gives x5 instead of x3.", baseCost: 50000, maxLevel: 3, icon: "galaxy" },
    { id: "rare_magnet", name: "Rare Magnet", detail: "Adds 25% extra rare coin luck.", baseCost: 250000, maxLevel: 10, icon: "planet" },
    { id: "flip_multiplier", name: "Triple Flip", detail: "Triples each coin flip reward.", baseCost: 1000000, maxLevel: 3, icon: "empire" },
    { id: "challenge_multiplier", name: "Challenge Master", detail: "Challenge progress gains 2x faster.", baseCost: 5000000, maxLevel: 5, icon: "treasury" },
    { id: "achievement_boost", name: "Achievement Amplifier", detail: "Adds 10 achievement perk levels.", baseCost: 25000000, maxLevel: 5, icon: "diamond" }
  ];

  const achievements = [
    { id: "first_flip", name: "First Click", detail: "Click the coin once", test: () => state.flipCount >= 1 },
    { id: "flips_100", name: "Getting Started", detail: "Make 100 flips", test: () => state.flipCount >= 100 },
    { id: "flips_1000", name: "Coin Roller", detail: "Make 1,000 flips", test: () => state.flipCount >= 1000 },
    { id: "flips_10000", name: "Dedicated Flipper", detail: "Make 10,000 flips", test: () => state.flipCount >= 10000 },
    { id: "flips_100000", name: "Coin Veteran", detail: "Make 100,000 flips", test: () => state.flipCount >= 100000 },
    { id: "flips_million", name: "Millionaire Roller", detail: "Make 1,000,000 flips", test: () => state.flipCount >= 1000000 },
    { id: "coins_100", name: "Pocket Change", detail: "Earn 100 coins", test: () => state.coins >= 100 },
    { id: "coins_1k", name: "Thousand Club", detail: "Earn 1,000 coins", test: () => state.coins >= 1000 },
    { id: "coins_10k", name: "Ten Thousand", detail: "Earn 10,000 coins", test: () => state.coins >= 10000 },
    { id: "coins_100k", name: "Fortune Hunter", detail: "Earn 100,000 coins", test: () => state.coins >= 100000 },
    { id: "coins_million", name: "Millionaire", detail: "Earn 1 million coins", test: () => state.coins >= 1e6 },
    { id: "coins_billion", name: "Billionaire", detail: "Earn 1 billion coins", test: () => state.coins >= 1e9 },
    { id: "coins_trillion", name: "Trillionaire", detail: "Earn 1 trillion coins", test: () => state.coins >= 1e12 },
    { id: "first_upgrade", name: "Power Up", detail: "Buy your first upgrade", test: () => state.upgradePurchases >= 1 },
    { id: "upgrades_10", name: "Upgrade Collector", detail: "Buy 10 upgrades", test: () => state.upgradePurchases >= 10 },
    { id: "upgrades_50", name: "Machine Builder", detail: "Buy 50 upgrades", test: () => state.upgradePurchases >= 50 },
    { id: "power_25", name: "Heavy Hitter", detail: "Reach Flip Power 25", test: () => state.maxFlipPower >= 25 },
    { id: "power_100", name: "Maximum Impact", detail: "Reach Flip Power 100", test: () => state.maxFlipPower >= 100 },
    { id: "auto_1", name: "Passive Start", detail: "Buy a first auto flipper", test: () => state.autoFlippers >= 1 },
    { id: "auto_10", name: "Automated Mint", detail: "Own 10 auto flippers", test: () => state.autoFlippers >= 10 },
    { id: "auto_100", name: "Industrial Mint", detail: "Own 100 auto flippers", test: () => state.autoFlippers >= 100 },
    { id: "luck_1", name: "Feeling Lucky", detail: "Buy your first luck upgrade", test: () => state.luckLevel >= 1 },
    { id: "luck_10", name: "Lucky Ten", detail: "Reach x10 luck", test: () => state.luckMultiplier >= 10 },
    { id: "luck_100", name: "Impossible Luck", detail: "Reach x100 luck", test: () => state.luckMultiplier >= 100 },
    { id: "silver", name: "Silver Seeker", detail: "Find Silver Coin", test: () => state.ownedCoins.includes("Silver Coin") },
    { id: "gold", name: "Gold Hunter", detail: "Find Gold Coin", test: () => state.ownedCoins.includes("Gold Coin") },
    { id: "diamond", name: "Diamond Hunter", detail: "Find Diamond Coin", test: () => state.ownedCoins.includes("Diamond Coin") },
    { id: "molten", name: "Heat Resistant", detail: "Find Molten Coin", test: () => state.ownedCoins.includes("Molten Coin") },
    { id: "radioactive", name: "Radiation Ready", detail: "Find Radioactive Coin", test: () => state.ownedCoins.includes("Radioactive Coin") },
    { id: "king", name: "Royal", detail: "Find King's Coin", test: () => state.ownedCoins.includes("King's Coin") },
    { id: "cosmic", name: "Cosmic Traveler", detail: "Find Cosmic Coin", test: () => state.ownedCoins.includes("Cosmic Coin") },
    { id: "star", name: "Starlight", detail: "Find Star Coin", test: () => state.ownedCoins.includes("Star Coin") },
    { id: "reality", name: "Reality Breaker", detail: "Find Reality Coin", test: () => state.ownedCoins.includes("Reality Coin") },
    { id: "collection_5", name: "Collector", detail: "Own 5 coin types", test: () => state.ownedCoins.length >= 5 },
    { id: "collection_10", name: "Complete Set", detail: "Own every coin", test: () => state.ownedCoins.length >= 10 },
    { id: "prestige_1", name: "New Beginnings", detail: "Prestige once", test: () => state.prestigeCount >= 1 },
    { id: "prestige_5", name: "Five Lives", detail: "Prestige 5 times", test: () => state.prestigeCount >= 5 },
    { id: "prestige_25", name: "Returner", detail: "Prestige 25 times", test: () => state.prestigeCount >= 25 },
    { id: "prestige_100", name: "Ascended", detail: "Prestige 100 times", test: () => state.prestigeCount >= 100 }
  ];

  let unlockedAchievements = JSON.parse(localStorage.getItem("coinAscensionAchievements") || "[]");
  let lastRushCoinPosition = null;

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem("coinAscensionSave"));
      if (!saved) return structuredClone(defaultState);
      const loaded = { ...structuredClone(defaultState), ...saved };
      if (!loaded.specialUpgradeLevels || typeof loaded.specialUpgradeLevels !== "object") {
        loaded.specialUpgradeLevels = {};
      }
      if (!Array.isArray(loaded.secretGrantedCoins)) loaded.secretGrantedCoins = [];
      if (!loaded.secretGrantedBuildings || typeof loaded.secretGrantedBuildings !== "object") {
        loaded.secretGrantedBuildings = {};
      }
      if (typeof loaded.secretPreviousEquippedCoin !== "string") loaded.secretPreviousEquippedCoin = null;
      if (typeof loaded.secretPreviousKingCoinSkinEquipped !== "boolean") {
        loaded.secretPreviousKingCoinSkinEquipped = false;
      }
      if (!Number.isFinite(loaded.secretPreviousCoins)) loaded.secretPreviousCoins = null;
      if (!Number.isFinite(loaded.secretRushUntil)) loaded.secretRushUntil = 0;
      if (!loaded.equippedCoin) loaded.equippedCoin = "Copper Coin";
      if (loaded.prestigeLevel >= 3) loaded.autoFlippers = Math.max(loaded.autoFlippers, 1);
      if (loaded.equippedCoin === "Copper Coin") {
        loaded.rareMultiplier = 1;
      } else {
        const equipped = coinEvolutions.find((coin) => coin.name === loaded.equippedCoin);
        loaded.rareMultiplier = equipped ? equipped.mult : 1;
      }
      const awaySeconds = Math.min(4 * 60 * 60, Math.max(0, (Date.now() - (loaded.lastSavedAt || Date.now())) / 1000));
      if (awaySeconds > 60) {
        const offlineIncome = Math.floor(passiveIncomeForLoadedState(loaded) * awaySeconds);
        if (offlineIncome > 0) {
          loaded.coins += offlineIncome;
          addChallengeProgress(loaded, offlineIncome);
          setTimeout(() => {
            const result = document.getElementById("result");
            if (result) result.textContent = `Welcome back! +${formatNumber(offlineIncome)} offline coins`;
          }, 100);
        }
      }
      return loaded;
    } catch {
      return structuredClone(defaultState);
    }
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return "0";
    const abs = Math.abs(value);
    if (abs < 100000) return Math.floor(value).toLocaleString();
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi"];
    const tier = Math.min(Math.floor(Math.log10(abs) / 3), suffixes.length - 1);
    if (tier <= 0) return Math.floor(value).toLocaleString();
    const scaled = value / (1000 ** tier);
    return `${scaled >= 100 ? scaled.toFixed(0) : scaled.toFixed(2)}${suffixes[tier]}`;
  }

  function prestigeMultiplier() {
    return 1 + state.prestigeLevel * 0.5;
  }

  function effectiveLuckMultiplier() {
    const magnetLevel = state.specialUpgradeLevels.rare_magnet || 0;
    return state.luckMultiplier
      * (1 + magnetLevel * 0.25)
      * (state.prestigeLevel >= 5 ? 2 : 1);
  }

  function specialFlipMultiplier() {
    const surgeLevel = state.specialUpgradeLevels.flip_surge || 0;
    const tripleLevel = state.specialUpgradeLevels.flip_multiplier || 0;
    return (2 ** surgeLevel) * (3 ** tripleLevel);
  }

  function activeRushUntil() {
    return Math.max(state.rushActiveUntil || 0, state.secretRushUntil || 0);
  }

  function upgradeCost(cost) {
    return Math.max(1, Math.floor(cost * (state.prestigeLevel >= 10 ? 0.9 : 1)));
  }

  function addChallengeProgress(gameState, amount) {
    if (!gameState.challengeActive || amount <= 0) return false;
    const masterLevel = gameState.specialUpgradeLevels?.challenge_multiplier || 0;
    const boostedAmount = amount * (2 ** masterLevel);
    gameState.challengeProgress = Math.min(challengeTarget, gameState.challengeProgress + boostedAmount);
    if (gameState.challengeProgress < challengeTarget) return false;
    gameState.challengeActive = false;
    gameState.challengeCompleted = true;
    gameState.challengeFailed = false;
    return true;
  }

  function achievementMultiplier() {
    const tier = [...colorTiers].reverse().find((item) => unlockedAchievements.length >= item.count);
    return tier?.mult || 1;
  }

  function totalMultiplier() {
    return state.rareMultiplier * achievementMultiplier() * prestigeMultiplier();
  }

  function passiveIncome() {
    const buildingIncome = shopBuildings.reduce((sum, building) => {
      const level = state.buildingLevels[building.id] || 0;
      return sum + building.cps * level;
    }, 0);
    return (state.autoFlippers + buildingIncome) * totalMultiplier();
  }

  function passiveIncomeForLoadedState(saved) {
    const buildingIncome = shopBuildings.reduce((sum, building) => {
      const level = saved.buildingLevels?.[building.id] || 0;
      return sum + building.cps * level;
    }, 0);
    let rare = saved.rareMultiplier || 1;
    let achievement = 1;
    let prestige = 1 + (saved.prestigeLevel || 0) * 0.5;
    return ((saved.autoFlippers || 0) + buildingIncome) * rare * achievement * prestige;
  }

  function luckCost(level) {
    return Math.floor(500 * (10 ** level));
  }

  function flipCoin() {
    state.flipCount++;
    const now = Date.now();
    if (!state.rushReady && activeRushUntil() <= now && Math.floor(Math.random() * 750) === 0) {
      spawnMintRushCoin();
    }
    const rushMultiplier = activeRushUntil() > now
      ? (state.specialUpgradeLevels.rush_overdrive ? 5 : 3)
      : 1;
    const reward = state.perFlip * specialFlipMultiplier() * totalMultiplier() * rushMultiplier;
    state.coins += reward;
    if (addChallengeProgress(state, reward)) showChallengeCompletion();
    launchClickBurst(reward);

    const coinBtn = document.getElementById("coinBtn");
    coinBtn.classList.remove("spinning");
    void coinBtn.offsetWidth;
    coinBtn.classList.add("spinning");

    rollForCoin();
    checkAchievements();
    update();
  }

  function rollForCoin() {
    for (const coin of coinEvolutions) {
      if (state.ownedCoins.includes(coin.name)) continue;
      const effectiveChance = Math.max(1, Math.floor(coin.chance / effectiveLuckMultiplier()));
      if (Math.floor(Math.random() * effectiveChance) !== 0) continue;

      state.ownedCoins.push(coin.name);
      state.secretGrantedCoins = state.secretGrantedCoins.filter((name) => name !== coin.name);
      state.equippedCoin = coin.name;
      state.rareMultiplier = coin.mult;
      state.rareHistory[coin.name] = state.flipCount;
      showRarityAnimation(coin);
      checkAchievements();
      update();
      break;
    }
  }

  function showRarityAnimation(coin) {
    const overlay = document.getElementById("rarityOverlay");
    overlay.className = `rarity-overlay ${coin.color}`;
    overlay.innerHTML = `
      <div class="rarity-content">
        <span class="rarity-emoji">${coin.emoji}</span>
        <h2>${coin.name.toUpperCase()}</h2>
        <p>1 IN ${formatNumber(coin.chance)}</p>
        <strong>PERMANENT x${formatNumber(coin.mult)}</strong>
      </div>`;
    overlay.classList.add("active");

    launchParticles(coin.name);
    playRaritySound();
    if (coin.name === "Reality Coin") {
      document.querySelector(".game-shell").classList.add("fake-crash");
      setTimeout(() => document.querySelector(".game-shell").classList.remove("fake-crash"), 2000);
    }

    const duration = coin.name === "Reality Coin" ? 4500 : coin.name === "Star Coin" ? 4000 : coin.name === "Cosmic Coin" ? 3500 : 2400;
    setTimeout(() => overlay.classList.remove("active"), duration);
  }

  function playRaritySound() {
    if (!state.soundEnabled) return;
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return;
    const audioContext = new AudioContextConstructor();
    const now = audioContext.currentTime;
    [660, 880, 1100].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const volume = audioContext.createGain();
      const start = now + index * 0.12;
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      volume.gain.setValueAtTime(0.0001, start);
      volume.gain.exponentialRampToValueAtTime(0.12, start + 0.025);
      volume.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      oscillator.connect(volume);
      volume.connect(audioContext.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.3);
    });
    setTimeout(() => audioContext.close(), 800);
  }

  function launchParticles(name) {
    const layer = document.getElementById("particleLayer");
    layer.innerHTML = "";
    const baseCount = name === "Reality Coin" ? 45 : name === "Star Coin" ? 35 : 20;
    const count = baseCount;
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("span");
      particle.textContent = ["Spark","Gold","Lava","Green","Crystal"][i % 5];
      particle.className = "particle";
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 0.4}s`;
      particle.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
      layer.appendChild(particle);
    }
    setTimeout(() => { layer.innerHTML = ""; }, 2400);
  }

  function launchClickBurst(reward) {
    const coinBtn = document.getElementById("coinBtn");
    const burst = document.createElement("span");
    burst.className = "coin-burst";
    burst.textContent = `+${formatNumber(reward)}`;
    const rect = coinBtn.getBoundingClientRect();
    burst.style.left = `${rect.left + rect.width * (0.35 + Math.random() * 0.3)}px`;
    burst.style.top = `${rect.top + rect.height * 0.3}px`;
    document.body.appendChild(burst);
    setTimeout(() => burst.remove(), 950);
  }

  function renderTierTrack() {
    const track = document.getElementById("coinTierTrack");
    track.innerHTML = colorTiers.map((tier) => {
      const unlocked = unlockedAchievements.length >= tier.count;
      return `<span class="${unlocked ? "unlocked" : ""}" title="${tier.name} · ${tier.count} achievements">${tier.emoji}</span>`;
    }).join("");
  }

  function checkAchievements() {
    const previousCount = unlockedAchievements.length;
    let popup = null;
    achievements.forEach((achievement) => {
      if (!unlockedAchievements.includes(achievement.id) && achievement.test()) {
        unlockedAchievements.push(achievement.id);
        popup = achievement;
      }
    });

    if (popup) {
      showAchievementPopup(popup);
    }
    if (unlockedAchievements.length > previousCount) {
      localStorage.setItem("coinAscensionAchievements", JSON.stringify(unlockedAchievements));
    }
  }

  function showAchievementPopup(achievement) {
    const popup = document.getElementById("achievementPopup");
    popup.innerHTML = `<span>🏆 ACHIEVEMENT UNLOCKED</span><strong>${achievement.name}</strong><small>${achievement.detail}</small>`;
    popup.classList.add("active");
    setTimeout(() => popup.classList.remove("active"), 3500);
  }

  function showChallengeCompletion() {
    const popup = document.getElementById("achievementPopup");
    popup.innerHTML = "<span>CHALLENGE COMPLETE</span><strong>Patient Mint</strong><small>Mint Crown skin unlocked</small>";
    popup.classList.add("active");
    setTimeout(() => popup.classList.remove("active"), 3500);
  }

  function showMilestonePopup(milestone) {
    const popup = document.getElementById("achievementPopup");
    popup.innerHTML = `<span>PRESTIGE MILESTONE</span><strong>${milestone.name}</strong><small>${milestone.reward}</small>`;
    popup.classList.add("active");
    setTimeout(() => popup.classList.remove("active"), 3500);
  }

  function startChallenge() {
    state.challengeActive = true;
    state.challengeFailed = false;
    state.challengeProgress = 0;
    update();
  }

  function toggleChallengeSkin() {
    if (!state.challengeCompleted) return;
    state.equippedSkin = !state.equippedSkin;
    update();
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (kingCoinSkinSequenceArmed) {
      kingCoinSkinSoundToggles++;
      if (kingCoinSkinSoundToggles >= 2) {
        state.kingCoinSkinUnlocked = true;
        kingCoinSkinSequenceArmed = false;
        kingCoinSkinSoundToggles = 0;
        persistSecretState();
        document.getElementById("result").textContent = "King Coin Skin unlocked!";
      }
    }
    update();
  }

  function armKingCoinSkinSequence() {
    if (state.kingCoinSkinUnlocked) return;
    kingCoinSkinSequenceArmed = true;
    kingCoinSkinSoundToggles = 0;
  }

  function buyUpgrade(type) {
    let purchased = false;
    if (type.startsWith("special_")) {
      const id = type.slice("special_".length);
      const upgrade = specialUpgrades.find((item) => item.id === id);
      if (!upgrade) return;
      const level = state.specialUpgradeLevels[id] || 0;
      if (level >= upgrade.maxLevel) return;
      const cost = upgradeCost(Math.floor(upgrade.baseCost * (1.35 ** level)));
      if (state.coins < cost) return;
      state.coins -= cost;
      state.specialUpgradeLevels[id] = level + 1;
      if (id === "luck_upgrade") {
        state.luckLevel++;
        state.luckMultiplier = [1, 1.1, 1.25, 1.5, 2, 10, 100][Math.min(state.luckLevel, 6)];
      }
      state.upgradePurchases++;
      purchased = true;
    } else if (type === "power") {
      const cost = upgradeCost(Math.floor(10 * (1.8 ** (state.perFlip - 1))));
      if (state.coins < cost) return;
      state.coins -= cost;
      state.perFlip++;
      state.maxFlipPower = Math.max(state.maxFlipPower, state.perFlip);
      state.upgradePurchases++;
      purchased = true;
    } else if (type === "luck") {
      const cost = upgradeCost(luckCost(state.luckLevel));
      if (state.coins < cost) return;
      state.coins -= cost;
      state.luckLevel++;
      state.luckMultiplier = [1, 1.1, 1.25, 1.5, 2, 10, 100][Math.min(state.luckLevel, 6)];
      purchased = true;
    } else if (type === "auto") {
      const cost = upgradeCost(Math.floor(25 * (1.15 ** state.autoFlippers)));
      if (state.coins < cost) return;
      state.coins -= cost;
      state.autoFlippers++;
      state.upgradePurchases++;
      purchased = true;
    } else {
      const building = shopBuildings.find((item) => item.id === type);
      if (building) {
        const level = state.buildingLevels[building.id] || 0;
        const cost = upgradeCost(Math.floor(building.baseCost * (1.18 ** level)));
        if (state.coins < cost) return;
        state.coins -= cost;
        state.buildingLevels[building.id] = level + 1;
        state.upgradePurchases++;
        purchased = true;
      }
    }
    if (purchased && state.challengeActive) {
      state.challengeActive = false;
      state.challengeFailed = true;
    }
    checkAchievements();
    update();
  }

  function prestige() {
    if (state.coins < 100000000) return;
    state.prestigeLevel++;
    state.prestigeCount++;
    state.coins = state.prestigeLevel >= 1 ? 100 : 0;
    state.perFlip = 1;
    state.autoFlippers = state.prestigeLevel >= 3 ? 1 : 0;
    checkAchievements();
    update();
    const milestone = prestigeMilestones.find((item) => item.level === state.prestigeLevel);
    if (milestone) showMilestonePopup(milestone);
  }

  function save() {
    localStorage.setItem("coinAscensionSave", JSON.stringify(state));
    localStorage.setItem("coinAscensionAchievements", JSON.stringify(unlockedAchievements));
    document.getElementById("result").textContent = "Game saved";
  }

  function equipCoin(name) {
    if (name === "King Coin Skin") {
      if (!state.kingCoinSkinUnlocked) return;
      state.kingCoinSkinEquipped = !state.kingCoinSkinEquipped;
      update();
      return;
    }
    if (!state.ownedCoins.includes(name)) return;
    if (name === state.equippedCoin) {
      state.equippedCoin = "Copper Coin";
      state.rareMultiplier = 1;
      state.kingCoinSkinEquipped = false;
      update();
      return;
    }
    state.kingCoinSkinEquipped = false;
    state.equippedCoin = name;
    if (name === "Copper Coin") {
      state.rareMultiplier = 1;
    } else {
      const coin = coinEvolutions.find((item) => item.name === name);
      state.rareMultiplier = coin ? coin.mult : 1;
    }
    document.getElementById("result").textContent = `${name} equipped`;
    update();
  }

  function renderPrestigeMilestones() {
    document.getElementById("prestigeMilestones").innerHTML = prestigeMilestones.map((milestone) => {
      const unlocked = state.prestigeLevel >= milestone.level;
      return `<div class="milestone-row ${unlocked ? "unlocked" : ""}">
        <strong>Prestige ${milestone.level} · ${milestone.name}</strong>
        <span>${milestone.reward}</span>
        <small>${unlocked ? "Unlocked" : "At prestige " + milestone.level}</small>
      </div>`;
    }).join("");
  }

  function renderChallenge() {
    const status = document.getElementById("challengeStatus");
    const button = document.getElementById("challengeBtn");
    const progress = state.challengeCompleted ? challengeTarget : state.challengeProgress;
    document.getElementById("challengeProgress").value = progress;
    document.getElementById("challengeProgressText").textContent =
      `${formatNumber(progress)} / ${formatNumber(challengeTarget)}`;

    if (state.challengeCompleted) {
      status.textContent = "Complete · Patient Mint title unlocked";
      document.getElementById("challengeReward").textContent = "Reward unlocked: Mint Crown skin and Patient Mint title";
      button.textContent = state.equippedSkin ? "Remove Mint Crown" : "Wear Mint Crown";
      button.disabled = false;
      button.dataset.action = "skin";
    } else if (state.challengeActive) {
      status.textContent = "In progress";
      button.textContent = "Challenge Active";
      button.disabled = true;
      button.dataset.action = "";
    } else if (state.challengeFailed) {
      status.textContent = "Failed · an upgrade was purchased";
      button.textContent = "Try Again";
      button.disabled = false;
      button.dataset.action = "start";
    } else {
      status.textContent = "Not started";
      button.textContent = "Start Challenge";
      button.disabled = false;
      button.dataset.action = "start";
    }
  }

  function currentColor() {
    return [...colorTiers].reverse().find((tier) => unlockedAchievements.length >= tier.count) || colorTiers[0];
  }

  function renderUpgrades() {
    const powerCost = upgradeCost(Math.floor(10 * (1.8 ** (state.perFlip - 1))));
    const luckCostValue = upgradeCost(luckCost(state.luckLevel));
    const autoCost = upgradeCost(Math.floor(25 * (1.15 ** state.autoFlippers)));
    const rows = [
      { type: "power", name: "Flip Power", detail: `+1 coin per click`, cost: powerCost, value: `Level ${state.perFlip}`, icon: "power" },
      { type: "auto", name: "Auto Flipper", detail: `+1 coin of output/sec`, cost: autoCost, value: `${state.autoFlippers} owned`, icon: "auto" }
    ];
    shopBuildings.forEach((building) => {
      const level = state.buildingLevels[building.id] || 0;
      const cost = upgradeCost(Math.floor(building.baseCost * (1.18 ** level)));
      rows.push({
        type: building.id,
        name: building.name,
        detail: building.detail,
        cost,
        value: `${level} owned`,
        icon: building.icon
      });
    });
    document.getElementById("upgradeList").innerHTML = rows.map((row) => `
      <div class="shop-row">
        <div class="upgrade-art upgrade-${row.icon}" aria-hidden="true"><span></span></div>
        <div class="shop-info"><strong>${row.name}</strong><span>${row.detail} · ${row.value}</span></div>
        <button class="buy-button" data-upgrade="${row.type}" ${state.coins < row.cost ? "disabled" : ""}>${formatNumber(row.cost)}</button>
      </div>`).join("");
  }

  function renderSpecialUpgrades() {
    document.getElementById("utilityList").innerHTML = specialUpgrades.map((upgrade) => {
      const level = state.specialUpgradeLevels[upgrade.id] || 0;
      const maxed = level >= upgrade.maxLevel;
      const cost = upgradeCost(Math.floor(upgrade.baseCost * (1.35 ** level)));
      return `<div class="shop-row special-row ${maxed ? "owned" : ""}">
        <div class="upgrade-art upgrade-${upgrade.icon}" aria-hidden="true"><span></span></div>
        <div class="shop-info"><strong>${upgrade.name}</strong><span>${upgrade.detail} · Level ${level}/${upgrade.maxLevel}</span></div>
        <button class="buy-button" data-upgrade="special_${upgrade.id}" ${maxed || state.coins < cost ? "disabled" : ""}>
          ${maxed ? "Max" : formatNumber(cost)}
        </button>
      </div>`;
    }).join("");
  }

  function renderCollection() {
    const allCoins = [
      { name: "Copper Coin", mult: 1 },
      ...coinEvolutions.slice().reverse().map((coin) => ({ name: coin.name, mult: coin.mult })),
      { name: "King Coin Skin", skin: true }
    ];
    document.getElementById("coinCollection").innerHTML = allCoins.map((coin) => {
      const owned = coin.skin ? state.kingCoinSkinUnlocked : state.ownedCoins.includes(coin.name);
      const equipped = coin.skin ? state.kingCoinSkinEquipped : state.equippedCoin === coin.name;
      const chance = coin.skin
        ? "Cosmetic Skin"
        : coin.name === "Copper Coin" ? "Starting Coin" : `1 in ${formatNumber(coinEvolutions.find((item) => item.name === coin.name).chance)}`;
      const canUnequip = equipped && (coin.skin || coin.name !== "Copper Coin");
      const buttonLabel = equipped ? (canUnequip ? "Unequip" : "Equipped") : "Equip";
      return `<div class="mutation-chip ${owned ? "owned" : ""} ${equipped ? "equipped" : ""}">
        <span>${coin.skin ? "♛" : ""}</span><strong>${coin.name}</strong>
        <small>${owned ? `${coin.skin ? "Cosmetic" : `x${formatNumber(coin.mult)}`} · ${equipped ? "Equipped" : "Owned"}` : chance}</small>
        ${owned ? `<button class="equip-button" data-equip="${coin.name}" ${equipped && !canUnequip ? "disabled" : ""}>${buttonLabel}</button>` : ""}
      </div>`;
    }).join("");
    document.getElementById("collectionCount").textContent =
      `${state.ownedCoins.length + Number(state.kingCoinSkinUnlocked)} / ${allCoins.length}`;
  }

  function renderAchievements() {
    document.getElementById("achievementList").innerHTML = achievements.map((achievement, index) => {
      const owned = unlockedAchievements.includes(achievement.id);
      const secretCorner = index === achievements.length - 1 ? "secret-corner-trigger" : "";
      return `<div class="achievement-chip ${owned ? "owned" : ""} ${secretCorner}" ${secretCorner ? 'data-secret-corner="true"' : ""}>
        <span>${owned ? "✓" : ""}</span><strong>${achievement.name}</strong><small>${achievement.detail}</small>
      </div>`;
    }).join("");
    document.getElementById("achievementCount").textContent =
      `${unlockedAchievements.length} / ${achievements.length}`;
  }

  function renderKingSkinEffects() {
    const effects = document.getElementById("kingSkinEffects");
    effects.hidden = !state.kingCoinSkinEquipped;
    if (effects.childElementCount) return;

    const positions = [];
    for (let index = 0; index <= 14; index++) {
      const percent = index / 14 * 100;
      positions.push({ left: percent, top: 0 }, { left: percent, top: 100 });
      if (index > 0 && index < 14) {
        positions.push({ left: 0, top: percent }, { left: 100, top: percent });
      }
    }
    const gemTypes = ["diamond", "emerald", "ruby", "gold"];
    positions.forEach((position, index) => {
      const gem = document.createElement("span");
      gem.className = `king-skin-gem king-skin-gem-${gemTypes[index % gemTypes.length]}`;
      gem.style.left = `${position.left}%`;
      gem.style.top = `${position.top}%`;
      gem.style.animationDelay = `${index % 7 * 0.13}s`;
      effects.appendChild(gem);
    });
  }

  function initializeSecretPanel() {
    const coinOptions = [
      { name: "Copper Coin" },
      ...coinEvolutions.map((coin) => ({ name: coin.name }))
    ];
    document.getElementById("secretCoinSelect").innerHTML = coinOptions
      .map((coin) => `<option value="${coin.name}">${coin.name}</option>`)
      .join("");
    document.getElementById("secretBuildingSelect").innerHTML = [
      { id: "auto_flipper", name: "Auto Flipper" },
      ...shopBuildings.map((building) => ({ id: building.id, name: building.name }))
    ].map((building) => `<option value="${building.id}">${building.name}</option>`).join("");
  }

  function setSecretStatus(message) {
    document.getElementById("secretStatus").textContent = message;
  }

  function persistSecretState() {
    localStorage.setItem("coinAscensionSave", JSON.stringify(state));
  }

  function recordSecretGrantBalance() {
    if (state.secretPreviousCoins === null) state.secretPreviousCoins = state.coins;
  }

  function readSecretAmount(id) {
    const amount = Number(document.getElementById(id).value);
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > 1000000) {
      setSecretStatus("Enter a whole number between 1 and 1,000,000.");
      return null;
    }
    return amount;
  }

  function grantSecretCoin() {
    const name = document.getElementById("secretCoinSelect").value;
    const knownCoin = name === "Copper Coin" || coinEvolutions.some((coin) => coin.name === name);
    if (!knownCoin) {
      setSecretStatus("That coin is not available.");
      return;
    }
    recordSecretGrantBalance();
    if (state.secretPreviousEquippedCoin === null) {
      state.secretPreviousEquippedCoin = state.equippedCoin;
      state.secretPreviousKingCoinSkinEquipped = state.kingCoinSkinEquipped;
    }
    if (!state.ownedCoins.includes(name)) {
      state.ownedCoins.push(name);
      state.secretGrantedCoins.push(name);
    }
    equipCoin(name);
    persistSecretState();
    setSecretStatus(`${name} granted and equipped.`);
  }

  function grantSecretBuilding() {
    const amount = readSecretAmount("secretBuildingAmount");
    if (amount === null) return;
    const id = document.getElementById("secretBuildingSelect").value;
    if (id === "auto_flipper") {
      recordSecretGrantBalance();
      state.autoFlippers += amount;
      state.secretGrantedAutoFlippers += amount;
    } else {
      const building = shopBuildings.find((item) => item.id === id);
      if (!building) {
        setSecretStatus("That building is not available.");
        return;
      }
      recordSecretGrantBalance();
      state.buildingLevels[id] = (state.buildingLevels[id] || 0) + amount;
      state.secretGrantedBuildings[id] = (state.secretGrantedBuildings[id] || 0) + amount;
    }
    update();
    persistSecretState();
    setSecretStatus(`${amount} ${id === "auto_flipper" ? "Auto Flipper(s)" : shopBuildings.find((item) => item.id === id).name + "(s)"} granted.`);
  }

  function grantSecretRushes() {
    const amount = readSecretAmount("secretRushAmount");
    if (amount === null) return;
    recordSecretGrantBalance();
    const duration = 10000 + (state.specialUpgradeLevels.rush_timer || 0) * 5000;
    state.secretRushUntil = Math.max(Date.now(), state.secretRushUntil || 0) + amount * duration;
    update();
    persistSecretState();
    setSecretStatus(`${amount} Mint Rush${amount === 1 ? "" : "es"} spawned.`);
  }

  function resetSecretGrants() {
    const grantedCoins = new Set(state.secretGrantedCoins);
    state.ownedCoins = state.ownedCoins.filter((name) => !grantedCoins.has(name));
    const restoredCoin = state.ownedCoins.includes(state.secretPreviousEquippedCoin)
      ? state.secretPreviousEquippedCoin
      : state.ownedCoins.includes(state.equippedCoin) ? state.equippedCoin : "Copper Coin";
    state.equippedCoin = restoredCoin;
    state.kingCoinSkinEquipped =
      state.secretPreviousKingCoinSkinEquipped && state.kingCoinSkinUnlocked;
    state.rareMultiplier = restoredCoin === "Copper Coin"
      ? 1
      : coinEvolutions.find((coin) => coin.name === restoredCoin)?.mult || 1;
    for (const [id, amount] of Object.entries(state.secretGrantedBuildings)) {
      state.buildingLevels[id] = Math.max(0, (state.buildingLevels[id] || 0) - amount);
    }
    state.autoFlippers = Math.max(0, state.autoFlippers - state.secretGrantedAutoFlippers);
    state.secretRushUntil = 0;
    if (Number.isFinite(state.secretPreviousCoins)) state.coins = state.secretPreviousCoins;
    state.secretGrantedCoins = [];
    state.secretGrantedBuildings = {};
    state.secretGrantedAutoFlippers = 0;
    state.secretPreviousEquippedCoin = null;
    state.secretPreviousKingCoinSkinEquipped = false;
    state.secretPreviousCoins = null;
    document.getElementById("secretPanel").hidden = true;
    document.getElementById("collectionsDialog").close();
    update();
    persistSecretState();
    setSecretStatus("Secret grants reset.");
  }

  function handleSecretIdleClick() {
    if (secretSequenceDirection === "reset" && secretSequenceStep === 3) {
      secretSequenceDirection = "";
      secretSequenceStep = 0;
      resetSecretGrants();
      return;
    }
    secretSequenceDirection = "unlock";
    secretSequenceStep = 1;
  }

  function handleSecretAscensionClick() {
    if (secretSequenceDirection === "unlock" && secretSequenceStep === 1) {
      secretSequenceStep = 2;
    } else if (secretSequenceDirection === "reset" && secretSequenceStep === 2) {
      secretSequenceStep = 3;
    }
  }

  function handleSecretCornerClick() {
    if (secretSequenceDirection === "unlock" && secretSequenceStep === 3) {
      document.getElementById("secretPanel").hidden = false;
      secretSequenceDirection = "";
      secretSequenceStep = 0;
      setSecretStatus("Secret panel unlocked.");
    } else if (!document.getElementById("secretPanel").hidden || state.secretGrantedCoins.length ||
        Object.keys(state.secretGrantedBuildings).length ||
        state.secretPreviousEquippedCoin !== null ||
        state.secretGrantedAutoFlippers || state.secretPreviousCoins !== null ||
        state.secretRushUntil > Date.now()) {
      secretSequenceDirection = "reset";
      secretSequenceStep = 1;
      document.getElementById("secretPanel").hidden = true;
      setSecretStatus("Reset sequence started.");
    }
  }

  function closeCollections() {
    document.getElementById("collectionsDialog").close();
    if (secretSequenceDirection === "reset" && secretSequenceStep === 1) {
      secretSequenceStep = 2;
    } else if (secretSequenceDirection === "unlock") {
      secretSequenceDirection = "";
      secretSequenceStep = 0;
    }
  }

  function activateMintRush() {
    const now = Date.now();
    if (!state.rushReady || activeRushUntil() > now) return;

    const rushDuration = 10000 + (state.specialUpgradeLevels.rush_timer || 0) * 5000;
    state.rushActiveUntil = now + rushDuration;
    state.rushReady = false;
    update();
  }

  function spawnMintRushCoin() {
    const existing = document.querySelector(".mint-rush-coin");
    if (existing) existing.remove();

    const coin = document.createElement("button");
    coin.type = "button";
    coin.className = "mint-rush-coin";
    coin.setAttribute("aria-label", "Collect Mint Rush");
    coin.textContent = "🪙";
    let left;
    let top;
    do {
      left = 8 + Math.random() * 84;
      top = 12 + Math.random() * 76;
    } while (
      lastRushCoinPosition &&
      Math.abs(left - lastRushCoinPosition.left) < 18 &&
      Math.abs(top - lastRushCoinPosition.top) < 18
    );
    lastRushCoinPosition = { left, top };
    coin.style.left = `${left}%`;
    coin.style.top = `${top}%`;
    coin.addEventListener("click", () => {
      state.rushReady = true;
      coin.remove();
      update();
    }, { once: true });
    document.body.appendChild(coin);
    setTimeout(() => coin.remove(), 8000);
  }

  function renderMintRush() {
    const now = Date.now();
    const active = activeRushUntil() > now;
    const button = document.getElementById("rushBtn");
    button.hidden = !state.rushReady || active;
    button.disabled = !state.rushReady || active;
  }

  function update() {
    const color = currentColor();
    renderTierTrack();
    document.getElementById("coins").textContent = formatNumber(state.coins);
    document.getElementById("perFlip").textContent = formatNumber(state.perFlip);
    document.getElementById("prestigeLevel").textContent = formatNumber(state.prestigeLevel);
    document.getElementById("globalMultiplier").textContent = `x${formatNumber(totalMultiplier())}`;
    document.getElementById("incomePerSecond").textContent = `+${formatNumber(passiveIncome())} / second`;
    document.getElementById("rareMultiplier").textContent = `x${formatNumber(state.rareMultiplier)}`;
    document.getElementById("achievementMultiplier").textContent = `x${formatNumber(achievementMultiplier())}`;
    document.getElementById("prestigeMultiplier").textContent = `x${formatNumber(prestigeMultiplier())}`;
    document.getElementById("totalMultiplier").textContent = `x${formatNumber(totalMultiplier())}`;
    document.getElementById("luckValue").textContent = `x${formatNumber(effectiveLuckMultiplier())} Luck`;
    document.getElementById("soundBtn").textContent = `Sound: ${state.soundEnabled ? "On" : "Off"}`;
    document.getElementById("soundBtn").setAttribute("aria-pressed", String(state.soundEnabled));
    document.getElementById("prestigeNext").innerHTML = state.coins >= 100000000
      ? "READY"
      : '100<button id="secretKingSkinTrigger" class="prestige-secret-letter" type="button" aria-label="M">M</button>';
    document.getElementById("prestigeBtn").disabled = state.coins < 100000000;

    const highestOwned = [...coinEvolutions]
      .reverse()
      .find((coin) => state.ownedCoins.includes(coin.name)) || null;
    const highestName = highestOwned?.name || "Copper Coin";
    const nextCoin = [...coinEvolutions]
      .slice()
      .reverse()
      .find((coin) => !state.ownedCoins.includes(coin.name));

    document.getElementById("goalHighestCoin").textContent = highestOwned
      ? `${highestOwned.face || ""} ${highestName}`.trim()
      : "Copper Coin";
    document.getElementById("goalEquippedCoin").textContent =
      `${state.equippedCoin} · x${formatNumber(state.rareMultiplier)}`;

    if (nextCoin) {
      document.getElementById("goalNextCoin").textContent = nextCoin.name;
      document.getElementById("goalNextOdds").textContent =
        `1 in ${formatNumber(nextCoin.chance / effectiveLuckMultiplier())}`;
      document.getElementById("goalNextMultiplier").textContent =
        `x${formatNumber(nextCoin.mult)}`;
      document.getElementById("goalNextBadge").textContent = nextCoin.name;
    } else {
      document.getElementById("goalNextCoin").textContent = "Every coin owned";
      document.getElementById("goalNextOdds").textContent = "Collection complete";
      document.getElementById("goalNextMultiplier").textContent = "Maximum";
      document.getElementById("goalNextBadge").textContent = "Collection Complete";
    }

    const clickIncome = state.perFlip * specialFlipMultiplier() * totalMultiplier();
    document.getElementById("goalClickIncome").textContent = `+${formatNumber(clickIncome)}`;
    document.getElementById("goalPassiveIncome").textContent = `+${formatNumber(passiveIncome())}`;

    const prestigeProgress = Math.min(state.coins, 100000000);
    document.getElementById("prestigeProgress").value = prestigeProgress;
    document.getElementById("prestigeProgressText").textContent =
      `${formatNumber(prestigeProgress)} / 100M`;

    const current = state.equippedCoin === "Copper Coin"
      ? { name: "Copper Coin", face: "", color: "copper" }
      : coinEvolutions.find((coin) => coin.name === state.equippedCoin) ||
        { name: "Copper Coin", face: "", color: "copper" };
    document.getElementById("currentCoinName").textContent = state.kingCoinSkinEquipped
      ? "King Coin Skin"
      : `${current.face || ""} ${current.name}`.trim();
    document.getElementById("coinEmoji").textContent = state.kingCoinSkinEquipped ? "♛" : current.face || "";
    const coinBtn = document.getElementById("coinBtn");
    coinBtn.className = `giant-coin ${current.color || color.className} ${coinBtn.classList.contains("spinning") ? "spinning" : ""} ${state.equippedSkin ? "mint-crown" : ""} ${state.kingCoinSkinEquipped ? "king-coin-skin" : ""}`;

    renderKingSkinEffects();
    renderUpgrades();
    renderSpecialUpgrades();
    renderPrestigeMilestones();
    renderChallenge();
    renderCollection();
    renderAchievements();
    renderMintRush();
  }

  document.getElementById("coinBtn").addEventListener("click", flipCoin);
  document.getElementById("rushBtn").addEventListener("click", activateMintRush);
  document.getElementById("secretIdleTrigger").addEventListener("click", handleSecretIdleClick);
  document.getElementById("secretAscensionTrigger").addEventListener("click", handleSecretAscensionClick);
  document.getElementById("achievementList").addEventListener("click", (event) => {
    if (event.target.closest("[data-secret-corner]")) handleSecretCornerClick();
  });
  document.getElementById("secretGrantCoinBtn").addEventListener("click", grantSecretCoin);
  document.getElementById("secretGrantBuildingBtn").addEventListener("click", grantSecretBuilding);
  document.getElementById("secretGrantRushBtn").addEventListener("click", grantSecretRushes);
  document.getElementById("upgradeList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-upgrade]");
    if (button) buyUpgrade(button.dataset.upgrade);
  });
  document.getElementById("utilityList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-upgrade]");
    if (button) buyUpgrade(button.dataset.upgrade);
  });
  document.getElementById("coinCollection").addEventListener("click", (event) => {
    const button = event.target.closest("[data-equip]");
    if (button) equipCoin(button.dataset.equip);
  });
  document.getElementById("prestigeBtn").addEventListener("click", prestige);
  document.getElementById("soundBtn").addEventListener("click", toggleSound);
  document.getElementById("prestigeNext").addEventListener("click", (event) => {
    if (event.target.closest("#secretKingSkinTrigger")) armKingCoinSkinSequence();
  });
  document.getElementById("challengeBtn").addEventListener("click", (event) => {
    if (event.currentTarget.dataset.action === "skin") toggleChallengeSkin();
    else if (event.currentTarget.dataset.action === "start") startChallenge();
  });
  document.getElementById("saveBtn").addEventListener("click", save);
  document.getElementById("openCollectionsBtn").addEventListener("click", () => {
    if (secretSequenceDirection === "unlock" && secretSequenceStep === 2) {
      secretSequenceStep = 3;
    } else if (secretSequenceDirection === "unlock") {
      secretSequenceDirection = "";
      secretSequenceStep = 0;
    }
    const dialog = document.getElementById("collectionsDialog");
    if (!dialog.open) dialog.showModal();
  });
  document.getElementById("closeCollectionsBtn").addEventListener("click", closeCollections);
  document.getElementById("collectionsDialog").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) closeCollections();
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset the entire Coin Ascension game?")) return;
    localStorage.removeItem("coinAscensionSave");
    localStorage.removeItem("coinAscensionAchievements");
    state = structuredClone(defaultState);
    unlockedAchievements = [];
    update();
  });

  setInterval(() => {
    const income = passiveIncome();
    state.coins += income;
    if (addChallengeProgress(state, income)) showChallengeCompletion();
    checkAchievements();
    update();
  }, 1000);
  setInterval(save, 15000);
  window.addEventListener("beforeunload", save);

  initializeSecretPanel();
  checkAchievements();
  update();
})();
