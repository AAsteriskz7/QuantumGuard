// Additional wordlists for QuantumGuard Pro features

// BIP-39 wordlist for mnemonic generation (first 100 words as sample)
const BIP39_WORDLIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apology", "appear", "apple", "approve", "april", "arcade", "arch",
  "arctic", "area", "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange"
];

// Specialized wordlists for pattern generation
const ADJECTIVES = [
  "quick", "brave", "calm", "eager", "fierce", "gentle", "happy", "kind", "lively", "mighty",
  "noble", "proud", "quiet", "rapid", "smart", "swift", "tough", "vivid", "warm", "wise",
  "bold", "cool", "dark", "fair", "fast", "fine", "free", "good", "hard", "high",
  "huge", "keen", "late", "loud", "neat", "nice", "open", "pure", "rich", "safe",
  "slow", "soft", "tall", "thin", "true", "vast", "weak", "wide", "wild", "young"
];

const NOUNS = [
  "bear", "cloud", "dragon", "eagle", "fox", "ghost", "heart", "ice", "jewel", "knight",
  "lion", "moon", "ocean", "pearl", "queen", "river", "star", "tiger", "wave", "wolf",
  "bird", "book", "door", "fire", "gold", "hand", "king", "lake", "mind", "path",
  "rock", "ship", "tree", "wind", "apple", "beach", "chair", "dream", "earth", "field",
  "house", "light", "music", "night", "paper", "stone", "table", "voice", "water", "world"
];

const VERBS = [
  "run", "jump", "fly", "swim", "dance", "sing", "paint", "write", "build", "create",
  "climb", "drive", "fight", "grow", "laugh", "learn", "play", "read", "sleep", "speak",
  "walk", "work", "call", "come", "find", "give", "help", "keep", "know", "live",
  "look", "make", "move", "need", "open", "pull", "push", "save", "show", "take",
  "tell", "turn", "want", "watch", "wear", "win", "ask", "buy", "cut", "eat"
];

// Technology-focused wordlist
const TECH_WORDS = [
  "algorithm", "binary", "cache", "database", "encrypt", "firewall", "gateway", "hardware",
  "interface", "javascript", "kernel", "linux", "memory", "network", "operating", "protocol",
  "quantum", "router", "server", "terminal", "unicode", "virtual", "wireless", "xml",
  "api", "bug", "cpu", "dns", "email", "ftp", "gpu", "html", "ip", "json",
  "key", "lan", "mac", "node", "os", "php", "ram", "sql", "tcp", "url",
  "vpn", "wan", "zip", "app", "bit", "css", "dll", "exe", "gif", "http"
];

// Nature-focused wordlist
const NATURE_WORDS = [
  "forest", "mountain", "river", "ocean", "desert", "valley", "meadow", "canyon", "glacier", "volcano",
  "sunrise", "sunset", "rainbow", "thunder", "lightning", "breeze", "storm", "mist", "frost", "dew",
  "flower", "tree", "grass", "moss", "fern", "vine", "root", "leaf", "branch", "bark",
  "eagle", "wolf", "bear", "deer", "fox", "rabbit", "squirrel", "owl", "hawk", "dove",
  "stream", "pond", "lake", "waterfall", "spring", "cave", "cliff", "hill", "peak", "shore"
];

// Export all wordlists
window.WORDLISTS = {
  eff: typeof effWordList !== 'undefined' ? effWordList : [], // From eff-wordlist.js
  bip39: BIP39_WORDLIST,
  adjectives: ADJECTIVES,
  nouns: NOUNS,
  verbs: VERBS,
  tech: TECH_WORDS,
  nature: NATURE_WORDS
};

// Pattern generation helper
window.generateFromPattern = function(pattern, separator = " ") {
  const parts = pattern.split("-");
  const result = parts.map(part => {
    let wordlist;
    switch(part.toLowerCase()) {
      case "adj":
      case "adjective":
        wordlist = ADJECTIVES;
        break;
      case "noun":
        wordlist = NOUNS;
        break;
      case "verb":
        wordlist = VERBS;
        break;
      case "tech":
        wordlist = TECH_WORDS;
        break;
      case "nature":
        wordlist = NATURE_WORDS;
        break;
      case "num":
      case "number":
        return Math.floor(Math.random() * 100).toString();
      case "symbol":
        const symbols = "!@#$%^&*+=?";
        return symbols[Math.floor(Math.random() * symbols.length)];
      default:
        wordlist = typeof effWordList !== 'undefined' ? effWordList : TECH_WORDS; // Default fallback
    }
    
    if (!wordlist || wordlist.length === 0) return part;
    
    const randomIndex = Math.floor(Math.random() * wordlist.length);
    return wordlist[randomIndex];
  });
  
  return result.join(separator);
};

// Mnemonic generation helper
window.generateMnemonic = function(wordCount = 12) {
  const words = [];
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * BIP39_WORDLIST.length);
    words.push(BIP39_WORDLIST[randomIndex]);
  }
  return words.join(" ");
}; 