import Groq from 'groq-sdk';

// In Vite, environment variables are accessed via import.meta.env
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY || 'your-groq-api-key-here',
  dangerouslyAllowBrowser: true // Required for client-side usage
});

export const analyzeScorecard = async (ocrText) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a golf scorecard parser. Your job is to analyze OCR text from golf scorecards and extract actual golf scores.

DETAILED INSTRUCTIONS:
1. Read through the entire OCR text carefully
2. Identify what type of text elements you see (par numbers, yardages, hole numbers, actual scores, dates, course names, etc.)
3. Look for patterns that indicate actual golf scores (typically 1-10 strokes per hole)
4. Ignore: par numbers (usually 3,4,5), yardages (usually 100-600), hole numbers (1-18), dates, course info
5. Extract only the numbers that represent actual strokes played

BE VERY VERBOSE in your reasoning. Explain:
- What you see in the text
- Why you think certain numbers are or aren't golf scores
- Your step-by-step analysis process
- Any patterns you notice
- Your confidence level and why

Return a JSON object with this EXACT format:
{
  "rawAnalysis": "detailed step-by-step analysis of what you see",
  "identifiedElements": {
    "possibleScores": [list of numbers you think might be scores],
    "parNumbers": [numbers you think are par values],
    "yardages": [numbers you think are yardages],
    "otherNumbers": [other numbers you found]
  },
  "reasoning": "detailed explanation of your filtering process",
  "scores": [final array of golf scores only],
  "confidence": "high/medium/low",
  "debugInfo": "any additional thoughts or observations"
}`
        },
        {
          role: "user",
          content: `Analyze this golf scorecard OCR text and extract the golf scores. Be extremely detailed in your analysis:

OCR TEXT:
"${ocrText}"`
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      max_tokens: 2000, // Increased for more detailed output
    });

    const responseText = completion.choices[0]?.message?.content;
    console.log('🤖 Raw LLM Response:', responseText);
    
    // Try to parse the JSON response
    try {
      const parsed = JSON.parse(responseText);
      
      // Validate the response structure
      if (!parsed.scores || !Array.isArray(parsed.scores)) {
        console.warn('⚠️ Invalid response format, trying fallback...');
        throw new Error('Invalid response format from AI');
      }
      
      // Filter out unrealistic golf scores
      const validScores = parsed.scores.filter(score => 
        typeof score === 'number' && score >= 1 && score <= 15
      );
      
      if (validScores.length === 0) {
        console.warn('⚠️ No valid golf scores found in response');
        throw new Error('No valid golf scores found');
      }
      
      console.log('✅ Parsed Analysis:', {
        rawAnalysis: parsed.rawAnalysis,
        identifiedElements: parsed.identifiedElements,
        reasoning: parsed.reasoning,
        finalScores: validScores,
        confidence: parsed.confidence,
        debugInfo: parsed.debugInfo
      });
      
      return {
        scores: validScores,
        confidence: parsed.confidence || 'medium',
        reasoning: parsed.reasoning || 'AI analysis completed',
        // Include the detailed analysis
        rawAnalysis: parsed.rawAnalysis,
        identifiedElements: parsed.identifiedElements,
        debugInfo: parsed.debugInfo,
        fullLLMResponse: responseText // Include the complete response
      };
      
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.log('📄 Raw AI Response for debugging:', responseText);
      
      // More detailed fallback
      const lines = responseText.split('\n');
      const analysisLines = lines.filter(line => 
        line.toLowerCase().includes('score') || 
        line.toLowerCase().includes('analysis') ||
        line.toLowerCase().includes('number')
      );
      
      // Try to extract numbers from the response
      const numbers = responseText.match(/\d+/g)?.map(Number) || [];
      const golfScores = numbers.filter(score => score >= 1 && score <= 15);
      
      console.log('🔧 Fallback Analysis:', {
        extractedNumbers: numbers,
        filteredScores: golfScores,
        relevantLines: analysisLines
      });
      
      if (golfScores.length > 0) {
        return {
          scores: golfScores.slice(0, 18), // Max 18 holes
          confidence: 'low',
          reasoning: 'Fallback parsing - extracted numbers from AI response',
          rawAnalysis: `Fallback mode: Found these relevant lines: ${analysisLines.join('; ')}`,
          debugInfo: 'JSON parsing failed, used fallback number extraction',
          fullLLMResponse: responseText
        };
      }
      
      throw new Error('Could not parse AI response');
    }
    
  } catch (error) {
    console.error('💥 Groq API Error:', error);
    return {
      scores: [],
      confidence: 'failed',
      reasoning: `AI analysis failed: ${error.message}`,
      rawAnalysis: 'Analysis failed before completion',
      debugInfo: error.toString(),
      fullLLMResponse: null
    };
  }
};
