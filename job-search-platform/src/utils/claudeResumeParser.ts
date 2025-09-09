import { ParsedResumeData } from './resumeParser';

interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

interface ExtractedData {
  fullName?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  experience?: string[];
  education?: string[];
  summary?: string;
  yearsOfExperience?: string;
  certifications?: string[];
  languages?: string[];
}

// Claude API configuration
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-haiku-20240307'; // Using Haiku for faster, cheaper parsing

export async function parseResumeWithClaude(
  resumeText: string,
  apiKey?: string
): Promise<ParsedResumeData> {
  // Use environment variable if no API key provided
  const claudeApiKey = apiKey || import.meta.env.VITE_CLAUDE_API_KEY;
  
  if (!claudeApiKey) {
    console.warn('No Claude API key found, falling back to basic parsing');
    throw new Error('Claude API key not configured');
  }

  const prompt = `Extract the following information from this resume text. Return a JSON object with these exact fields:
{
  "fullName": "full name of the candidate",
  "email": "email address",
  "phone": "phone number formatted as (XXX) XXX-XXXX if US number",
  "skills": ["array of ALL skills mentioned, including technical and soft skills"],
  "technicalSkills": ["programming languages, frameworks, tools, technologies"],
  "softSkills": ["leadership, communication, teamwork, etc."],
  "experience": ["job titles and companies in format: 'Title at Company (Years)'"],
  "education": ["degrees and institutions"],
  "summary": "professional summary or objective if present",
  "yearsOfExperience": "total years of experience if mentioned",
  "certifications": ["professional certifications"],
  "languages": ["spoken languages if mentioned"]
}

Important instructions:
1. Extract ALL skills mentioned anywhere in the resume
2. For technical skills, include programming languages, frameworks, databases, cloud platforms, tools, methodologies
3. Look for skills in dedicated skills sections, job descriptions, project descriptions, and summary
4. Be comprehensive - if a technology or skill is mentioned even once, include it
5. Keep the original capitalization for proper nouns and technologies
6. If a field is not found, use null or empty array

Resume text:
${resumeText}`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1 // Low temperature for consistent extraction
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      throw new Error(`Claude API request failed: ${response.status}`);
    }

    const data: ClaudeResponse = await response.json();
    const responseText = data.content[0]?.text || '';
    
    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in Claude response');
    }

    const extractedData: ExtractedData = JSON.parse(jsonMatch[0]);
    
    // Combine all skills and remove duplicates
    const allSkills = new Set<string>();
    
    // Add skills from different categories
    if (extractedData.skills) {
      extractedData.skills.forEach(skill => allSkills.add(skill));
    }
    if (extractedData.technicalSkills) {
      extractedData.technicalSkills.forEach(skill => allSkills.add(skill));
    }
    if (extractedData.softSkills) {
      extractedData.softSkills.forEach(skill => allSkills.add(skill));
    }
    
    // Convert back to ParsedResumeData format
    const parsedData: ParsedResumeData = {
      fullName: extractedData.fullName || undefined,
      email: extractedData.email || undefined,
      phone: extractedData.phone || undefined,
      skills: Array.from(allSkills).filter(skill => skill && skill.trim()),
      experience: extractedData.experience || [],
      education: extractedData.education || [],
      summary: extractedData.summary || undefined,
      rawText: resumeText.slice(0, 2000)
    };

    // Log results for debugging
    console.log('Claude extracted skills:', parsedData.skills);
    console.log('Total skills found:', parsedData.skills?.length || 0);

    return parsedData;
  } catch (error) {
    console.error('Error parsing resume with Claude:', error);
    throw error;
  }
}

// Enhanced skill extraction with Claude for existing parsed data
export async function enhanceSkillsWithClaude(
  resumeText: string,
  existingData: ParsedResumeData,
  apiKey?: string
): Promise<ParsedResumeData> {
  const claudeApiKey = apiKey || import.meta.env.VITE_CLAUDE_API_KEY;
  
  if (!claudeApiKey) {
    console.warn('No Claude API key found, returning existing data');
    return existingData;
  }

  const prompt = `You are an expert resume parser specializing in skill extraction. Extract ALL technical and professional skills from this resume.

Include:
- Programming languages (JavaScript, Python, Java, etc.)
- Frameworks and libraries (React, Angular, Django, Spring, etc.)
- Databases (MySQL, PostgreSQL, MongoDB, Redis, etc.)
- Cloud platforms (AWS, Azure, GCP, etc.)
- DevOps tools (Docker, Kubernetes, Jenkins, Git, etc.)
- Methodologies (Agile, Scrum, TDD, CI/CD, etc.)
- Professional tools (Jira, Slack, Figma, etc.)
- Soft skills (Leadership, Communication, Problem-solving, etc.)
- Domain expertise (Machine Learning, Data Science, Finance, etc.)

Return a JSON array of all skills found. Be comprehensive - include any skill, technology, or tool mentioned anywhere in the resume.

Resume text:
${resumeText}`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', response.status);
      return existingData;
    }

    const data: ClaudeResponse = await response.json();
    const responseText = data.content[0]?.text || '';
    
    // Extract JSON array from the response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.warn('No valid JSON array found in Claude response');
      return existingData;
    }

    const extractedSkills: string[] = JSON.parse(jsonMatch[0]);
    
    // Combine with existing skills and remove duplicates
    const allSkills = new Set<string>(existingData.skills || []);
    extractedSkills.forEach(skill => {
      if (skill && skill.trim()) {
        allSkills.add(skill.trim());
      }
    });

    return {
      ...existingData,
      skills: Array.from(allSkills)
    };
  } catch (error) {
    console.error('Error enhancing skills with Claude:', error);
    return existingData;
  }
}