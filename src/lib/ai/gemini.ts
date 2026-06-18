import axios from 'axios';

const NVIDIA_KEY = import.meta.env.VITE_NVIDIA_API_KEY;

export const scanChatScreenshot = async (base64Image: string) => {
  if (NVIDIA_KEY) {
    return await scanWithNvidia(base64Image);
  }

  throw new Error("No AI API Key found (NVIDIA is required).");
};

async function scanWithNvidia(base64Image: string) {
  const response = await axios.post(
    "https://integrate.api.nvidia.com/v1/chat/completions",
    {
      model: "nvidia/llama-3.1-nemotron-nano-vl-8b-v1",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: getSystemPrompt() },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ],
      max_tokens: 1024,
      temperature: 0.2,
      top_p: 0.7
    },
    {
      headers: {
        Authorization: `Bearer ${NVIDIA_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const text = response.data.choices[0].message.content;
  const jsonStr = text.replace(/```json|```/g, "").trim();
  return JSON.parse(jsonStr);
}

function getSystemPrompt() {
  return `
    You are an expert talent manager. Analyze this Instagram DM chat screenshot between a brand manager and a creator.
    Extract the following information and return ONLY as a valid JSON object:
    
    {
      "full_name": "string or null",
      "instagram_handle": "string or null (without @)",
      "followers": "number or null",
      "avg_views": "number or null",
      "engagement_rate": "number or null",
      "category": "string or null",
      "location": "string or null (e.g. Mumbai, Maharashtra)",
      "payout_upi": "string or null",
      "pincode": "string or null",
      "shipping_address": "string or null",
      "base_rate": "number or null (for 1 reel)",
      "past_brands": "string array or null",
      "audience_language": "string or null",
      "audience_gender_split": "string or null (e.g. '70% Female')",
      "audience_age_range": "string or null (e.g. '18-24')",
      "intro_line": "a catchy 1-sentence hook based on their style",
      "vibes": "comma separated vibes like Aesthetic, Relatable, Fun"
    }

    If data is missing, use null. Be precise with numbers.
  `;
}

export const refineTranscriptWithLLM = async (
  rawTranscript: string,
  context: 'notes' | 'prescription' | 'teeth' | 'nextVisit'
): Promise<string> => {
  if (!rawTranscript.trim()) return '';

  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const nvidiaKey = import.meta.env.VITE_NVIDIA_API_KEY;

  const prompt = `
You are an expert AI medical and dental scribe working in an Indian clinic context. 
The following is a raw, potentially noisy speech-to-text transcription of a doctor's dictation.
Your task is to correct any phonetic errors, spelling mistakes, numbers, and terminology mishearings, particularly focusing on Indian accents and common medical/dental terms.

Context of dictation: "${context}"
Raw transcript: "${rawTranscript}"

Guidelines:
1. For prescriptions (Rx), make sure medical names are spelled correctly (e.g., "paracetamol 650mg", "amoxicillin 500mg", "pantocid", "limcee", "combiflam", "augmentin", etc.). Correct phrases like "six fifty mg" to "650mg", "three days" to "3 days" or "for 3 days", etc.
2. For dental chart notes, match tooth numbers (11 to 48) and treatments (e.g., "RCT", "root canal", "implant", "scaling", "extraction").
3. For clinical notes/complaints, format them nicely (e.g., "patient complaining of pain in lower right back tooth since 3 days").
4. Keep the output matching the format of the intended field.
5. If the transcript is extremely short or contains no medical context, just clean up grammatical/spelling errors.
6. Return ONLY the refined/corrected text. Do not include any intro, explanation, markdown formatting (like code blocks), or extra commentary. Just the corrected text.
`;

  if (nvidiaKey) {
    try {
      const response = await axios.post(
        "https://integrate.api.nvidia.com/v1/chat/completions",
        {
          model: "meta/llama-3.1-8b-instruct",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt }
              ]
            }
          ],
          max_tokens: 512,
          temperature: 0.1
        },
        {
          headers: {
            Authorization: `Bearer ${nvidiaKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      const text = response.data?.choices?.[0]?.message?.content;
      if (text) return text.trim();
    } catch (e) {
      console.error("NVIDIA refinement failed, trying Gemini", e);
    }
  }

  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        const refinedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (refinedText) return refinedText.trim();
      }
    } catch (e) {
      console.error("Gemini refinement failed", e);
    }
  }

  return rawTranscript;
};

export interface SmileTransformationAssets {
  captions: {
    educational: string;
    emotional: string;
    short: string;
  };
  theme: {
    backgroundGradientStart: string;
    backgroundGradientEnd: string;
    textColor: string;
    accentColor: string;
    badgeBeforeBg: string;
    badgeAfterBg: string;
    fontFamily: 'serif' | 'sans-serif';
    headerText: string;
    frameStyle: 'elegant' | 'modern' | 'luxury';
  };
}

export const generateSmileTransformationCaptions = async (
  patientName: string,
  treatment: string,
  notes: string,
  clinicName: string
): Promise<SmileTransformationAssets> => {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const defaultAssets: SmileTransformationAssets = {
    captions: {
      educational: `🦷 Transformative Care!\n\nHere is a stunning before & after smile transformation for ${patientName} after receiving ${treatment} at ${clinicName}. Quality dentistry makes all the difference! #dentist #smilemakeover #dentalclinic`,
      emotional: `✨ Reclaiming confidence one smile at a time!\n\n${patientName} is smiling brighter than ever after their custom ${treatment} makeover with us. True life-changing results! #confidence #smiletransform #dentalcare`,
      short: `Before vs After: ${treatment} 🤩\n\nStunning results for ${patientName} at ${clinicName}! Link in bio to book your consult. #makeover #viral #shreeram`
    },
    theme: {
      backgroundGradientStart: '#0F172A',
      backgroundGradientEnd: '#1E293B',
      textColor: '#FFFFFF',
      accentColor: '#38BDF8',
      badgeBeforeBg: '#EF4444',
      badgeAfterBg: '#10B981',
      fontFamily: 'sans-serif',
      headerText: 'SMILE TRANSFORMATION',
      frameStyle: 'modern'
    }
  };

  if (!geminiKey) {
    return defaultAssets;
  }

  const prompt = `
You are an expert Instagram copywriter and aesthetic graphic designer specializing in dental clinic branding.
Your task is to:
1. Write 3 engaging, premium Instagram captions for a "Before & After" smile transformation post.
2. Select a beautiful, custom design theme (color palette, typography style, headers, and frames) that perfectly matches the personality and style of this patient's case notes. For instance:
   - For an elegant veneer case: Use a luxury/gold theme (e.g. deep plum or navy background with rich gold text and accent colors).
   - For a clean orthodontic case: Use a clean modern blue/white/teal aesthetic.
   - For a dramatic restoration: Use an emotional dark mode charcoal/amber look.
   Provide exact hex codes and select a font family (serif or sans-serif) that complements this look.

Details of the case:
- Patient Name: "${patientName}"
- Dental Treatment/Service: "${treatment}"
- Doctor Clinical Notes: "${notes}"
- Clinic Name: "${clinicName}"

Please return exactly a JSON object matching this structure:
{
  "captions": {
    "educational": "caption focusing on the clinical explanation, benefits of the procedure, and educational value",
    "emotional": "caption focusing on the confidence, lifestyle boost, patient story, and transformation journey",
    "short": "a quick, high-energy, viral, punchy caption with emojis and hashtags"
  },
  "theme": {
    "backgroundGradientStart": "Hex code (e.g. #0F172A) for gradient background starting color",
    "backgroundGradientEnd": "Hex code (e.g. #1E293B) for gradient background ending color",
    "textColor": "Hex code (e.g. #FFFFFF) for main text titles",
    "accentColor": "Hex code (e.g. #38BDF8) for labels and subtitle highlights",
    "badgeBeforeBg": "Hex code for the 'BEFORE' image badge (e.g. #EF4444 or matching dark accent)",
    "badgeAfterBg": "Hex code for the 'AFTER' image badge (e.g. #10B981 or matching light accent)",
    "fontFamily": "serif or sans-serif",
    "headerText": "A custom short, bold title overlay (e.g. 'CONFIDENCE RESTORED', 'NATURAL BEAUTY', 'A NEW BEGINNING') - MAX 22 characters in uppercase",
    "frameStyle": "elegant or modern or luxury"
  }
}

Do not include any wrapper (like markdown code blocks \`\`\`json) or extra explanation. Return ONLY the raw JSON object.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    }
  } catch (e) {
    console.error("Gemini caption and theme generation failed", e);
  }

  return defaultAssets;
};

export const generateSmileTransformationPrompts = async (
  treatment: string,
  notes: string
): Promise<{ beforePrompt: string; afterPrompt: string }> => {
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const defaultPrompts = {
    beforePrompt: `macro shot dental photography, close up of crooked teeth with noticeable gaps, plaque, realistic mouth interior, clinical lighting`,
    afterPrompt: `macro shot dental photography, close up of perfectly aligned and bright white teeth, veneers, clean healthy pink gums, professional clinical lighting`
  };

  if (!geminiKey) return defaultPrompts;

  const prompt = `
You are an expert AI dental imaging engineer.
Your task is to write two detailed, realistic prompts for generating before-and-after photos of a patient's smile makeover.
The prompts will be used in an image generator.

Case details:
- Treatment: "${treatment}"
- Clinical Notes: "${notes}"

Guidelines:
1. Write a 'beforePrompt' focusing on the aesthetic defects (e.g. gaps, crookedness, plaque, yellow stains, missing teeth, or old fillings) as described in the case details. Make it look like a macro clinical mouth close-up.
2. Write an 'afterPrompt' showing the teeth fully corrected, white, perfectly aligned, healthy, and beautiful.
3. Keep descriptions highly descriptive, realistic, clean, and medical, focusing on the teeth and lips only (no full faces). Ensure no text is generated in the images.

Output format MUST be only a valid JSON object matching this structure:
{
  "beforePrompt": "detailed prompt text...",
  "afterPrompt": "detailed prompt text..."
}
Do not include any wrapper (like markdown code blocks) or extra text. Just return the JSON object.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const cleanJson = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanJson);
      }
    }
  } catch (e) {
    console.error("Gemini image prompts generation failed", e);
  }

  return defaultPrompts;
};


