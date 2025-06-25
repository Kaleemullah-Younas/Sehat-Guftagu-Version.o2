// API configuration and service functions
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const UPLIFTAI_API_KEY = import.meta.env.VITE_UPLIFTAI_API_KEY

// Groq API for English analysis
export async function generateEnglishAnalysis(reportData: any): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert medical analyst. Analyze the provided blood report and provide a comprehensive English summary with recommendations.

Format your response as:
### Medical Analysis Summary
[Detailed analysis of the blood report]

### Health Recommendations
[Specific recommendations for the patient]

### Risk Assessment
[Assessment of potential health risks]

### Follow-up Actions
[Recommended next steps]`
          },
          {
            role: 'user',
            content: JSON.stringify(reportData)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      content: data.choices[0]?.message?.content || 'No analysis generated'
    }
  } catch (error) {
    console.error('Error generating English analysis:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Generate Urdu audio script
export async function generateUrduAudioScript(reportData: any): Promise<{ success: boolean; content?: string; error?: string }> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are a caring doctor speaking to a patient in Urdu. Create a warm, conversational script that explains the blood report results in simple Urdu language.

Requirements:
- Write in Roman Urdu (English script)
- Use simple, non-technical language
- Be warm and reassuring
- Include specific advice for the patient
- Keep it conversational and caring
- Focus on practical recommendations

Format: Write as if you're speaking directly to the patient, starting with a warm greeting.`
          },
          {
            role: 'user',
            content: JSON.stringify(reportData)
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      })
    })

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      content: data.choices[0]?.message?.content || 'No script generated'
    }
  } catch (error) {
    console.error('Error generating Urdu script:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// UpliftAI TTS API
export async function generateAudioFromText(text: string): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    const response = await fetch('https://api.upliftai.org/v1/synthesis/text-to-speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPLIFTAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voiceId: 'v_8eelc901',
        text: text,
        outputFormat: 'MP3_22050_128'
      })
    })

    if (!response.ok) {
      throw new Error(`UpliftAI API error: ${response.statusText}`)
    }

    const audioBlob = await response.blob()
    const audioUrl = URL.createObjectURL(audioBlob)
    
    return {
      success: true,
      audioUrl
    }
  } catch (error) {
    console.error('Error generating audio:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

// Google Translate API (you can replace this with your preferred translation service)
export async function translateToUrdu(text: string): Promise<string> {
  // For now, return the text as-is since we're generating Urdu script directly
  // You can implement Google Translate API here if needed
  return text
}