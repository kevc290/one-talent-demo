// Simple fuzzy search implementation
export class FuzzySearch {
  // Calculate similarity between two strings using Levenshtein distance
  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Calculate similarity score (0-1, where 1 is exact match)
  private static similarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Check if search term fuzzy matches any word in the text
  static fuzzyMatch(text: string, searchTerm: string, threshold: number = 0.7): boolean {
    const textLower = text.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // First check for exact substring match (highest priority)
    if (textLower.includes(searchLower)) {
      return true;
    }

    // Split text into words and check fuzzy match for each
    const words = textLower.split(/\s+/);
    const searchWords = searchLower.split(/\s+/);

    // Check if each search word fuzzy matches any text word
    for (const searchWord of searchWords) {
      let foundMatch = false;
      
      for (const word of words) {
        // Remove punctuation and check similarity
        const cleanWord = word.replace(/[^\w]/g, '');
        const cleanSearchWord = searchWord.replace(/[^\w]/g, '');
        
        if (cleanWord.length > 0 && cleanSearchWord.length > 0) {
          const similarityScore = this.similarity(cleanWord, cleanSearchWord);
          
          // Also check if search word is a prefix/suffix of the text word
          const isPrefixMatch = cleanWord.startsWith(cleanSearchWord) || cleanSearchWord.startsWith(cleanWord);
          const isSuffixMatch = cleanWord.endsWith(cleanSearchWord) || cleanSearchWord.endsWith(cleanWord);
          
          if (similarityScore >= threshold || isPrefixMatch || isSuffixMatch) {
            foundMatch = true;
            break;
          }
        }
      }
      
      // If any search word doesn't have a match, return false
      if (!foundMatch) {
        return false;
      }
    }

    return true;
  }

  // Enhanced search that includes common word variations
  static enhancedMatch(text: string, searchTerm: string): boolean {
    const textLower = text.toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    // Exact match first
    if (textLower.includes(searchLower)) {
      return true;
    }

    // Common word variations for job search
    const variations: Record<string, string[]> = {
      'engineer': ['engineering', 'engineers', 'eng'],
      'engineering': ['engineer', 'engineers', 'eng'],
      'developer': ['development', 'dev', 'developers'],
      'development': ['developer', 'dev', 'developers'],
      'manager': ['management', 'managing', 'mgr'],
      'management': ['manager', 'managing', 'mgr'],
      'analyst': ['analysis', 'analyze', 'analytics'],
      'analysis': ['analyst', 'analyze', 'analytics'],
      'designer': ['design', 'designing', 'designs'],
      'design': ['designer', 'designing', 'designs'],
      'specialist': ['specialization', 'specialized', 'spec'],
      'coordinator': ['coordination', 'coordinating', 'coord'],
      'administrator': ['administration', 'admin', 'administrative'],
      'technician': ['technical', 'tech', 'technology'],
      'consultant': ['consulting', 'consultation', 'advisory'],
      'assistant': ['assist', 'support', 'aide'],
      'executive': ['exec', 'leadership', 'senior'],
      'representative': ['rep', 'representative', 'sales'],
      'javascript': ['js', 'node', 'react', 'vue'],
      'python': ['py', 'django', 'flask'],
      'frontend': ['front-end', 'front end', 'ui', 'client-side'],
      'backend': ['back-end', 'back end', 'server-side', 'api'],
      'fullstack': ['full-stack', 'full stack', 'full-stack'],
      'devops': ['dev-ops', 'dev ops', 'deployment', 'infrastructure'],
      'remote': ['work from home', 'wfh', 'telecommute', 'distributed'],
    };

    // Check variations
    for (const [key, values] of Object.entries(variations)) {
      if (searchLower.includes(key)) {
        for (const variation of values) {
          if (textLower.includes(variation)) {
            return true;
          }
        }
      }
      
      // Reverse check - if text contains key, check if search contains variations
      if (textLower.includes(key)) {
        for (const variation of values) {
          if (searchLower.includes(variation)) {
            return true;
          }
        }
      }
    }

    // Fallback to fuzzy matching with lower threshold
    return this.fuzzyMatch(text, searchTerm, 0.75);
  }
}