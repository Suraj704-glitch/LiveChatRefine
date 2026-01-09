class TrieNode {
    constructor() {
        this.children = new Map();
        this.frequency = 0;
    }
}

class TrieService {
    constructor() {
        this.root = new TrieNode();
        // Professional approach: Filter out "Noise"
        this.stopWords = new Set(["what", "is", "a", "the", "how", "to", "please", "can", "you", "explain", "i", "my", "me", "am", "in"]);
    }

    insert(sentence) {
        if (!sentence) return;

        // 1. Clean the string: lowercase and remove symbols
        const cleanWords = sentence.toLowerCase()
            .replace(/[^\w\s]/gi, '')
            .split(/\s+/);

        // 2. Extract meaningful keywords
        const keywords = cleanWords.filter(word => !this.stopWords.has(word) && word.length > 2);

        // 3. Insert each keyword into the Trie
        // This ensures that "React help" and "What is React" both increment the "react" node
        for (const word of keywords) {
            let node = this.root;
            if (!node.children.has(word)) {
                node.children.set(word, new TrieNode());
            }
            node = node.children.get(word);
            node.frequency++; 
        }
    }

    getTopKeywords() {
        const results = [];
        for (let [word, node] of this.root.children) {
            results.push({ text: word, count: node.frequency });
        }
        // Sort by frequency
        return results.sort((a, b) => b.count - a.count);
    }
}

module.exports = TrieService;