import { type AudioConfig, type StsConfig, type Voice } from "app/utils/deepgramUtils";

const audioConfig: AudioConfig = {
  input: {
    encoding: "linear16",
    sample_rate: 16000,
  },
  output: {
    encoding: "linear16",
    sample_rate: 24000,
    container: "none",
  },
};

const baseConfig = {
  type: "Settings" as const,
  audio: audioConfig,
  agent: {
    listen: { provider: { type: "deepgram" as const, model: "nova-3" } },
    speak: {
      provider: {
        type: "cartesia",
        model_id: "sonic-2",
        voice: {
          mode: "id",
          id: "a167e0f3-df7e-4d52-a9c3-f949145efdab"
        },
        language: "en"
      },
      endpoint: {
        url: "https://api.cartesia.ai/tts/bytes",
        headers: {
          "x-api-key": "sk_car_prgadwWbKp31CAvTEjceyF"
        }
      }
    },
    think: {
      provider: { type: "groq" as const, model: "openai/gpt-oss-20b" },
    },
  },
  experimental: true,
};

// Default fallback prompt
const defaultPrompt = `
                #Role
                You are a general-purpose virtual assistant speaking to users over the phone. Your task is to help them find accurate, helpful information across a wide range of everyday topics.

                #General Guidelines
                -Be warm, friendly, and professional.
                -Speak clearly and naturally in plain language.
                -Keep most responses to 1–2 sentences and under 120 characters unless the caller asks for more detail (max: 300 characters).
                -Do not use markdown formatting, like code blocks, quotes, bold, links, or italics.
                -Use line breaks in lists.
                -Use varied phrasing; avoid repetition.
                -If unclear, ask for clarification.
                -If the user's message is empty, respond with an empty message.
                -If asked about your well-being, respond briefly and kindly.

                #Voice-Specific Instructions
                -Speak in a conversational tone—your responses will be spoken aloud.
                -Pause after questions to allow for replies.
                -Confirm what the customer said if uncertain.
                -Never interrupt.

                #Style
                -Use active listening cues.
                -Be warm and understanding, but concise.
                -Use simple words unless the caller uses technical terms.

                #Call Flow Objective
                -Greet the caller and introduce yourself:
                "Hi there, I'm your virtual assistant—how can I help today?"
                -Your primary goal is to help users quickly find the information they're looking for. This may include:
                Quick facts: "The capital of Japan is Tokyo."
                Weather: "It's currently 68 degrees and cloudy in Seattle."
                Local info: "There's a pharmacy nearby open until 9 PM."
                Basic how-to guidance: "To restart your phone, hold the power button for 5 seconds."
                FAQs: "Most returns are accepted within 30 days with a receipt."
                Navigation help: "Can you tell me the address or place you're trying to reach?"
                -If the request is unclear:
                "Just to confirm, did you mean…?" or "Can you tell me a bit more?"
                -If the request is out of scope (e.g. legal, financial, or medical advice):
                "I'm not able to provide advice on that, but I can help you find someone who can."

                #Off-Scope Questions
                -If asked about sensitive topics like health, legal, or financial matters:
                "I'm not qualified to answer that, but I recommend reaching out to a licensed professional."

                #User Considerations
                -Callers may be in a rush, distracted, or unsure how to phrase their question. Stay calm, helpful, and clear—especially when the user seems stressed, confused, or overwhelmed.

                #Closing
                -Always ask:
                "Is there anything else I can help you with today?"
                -Then thank them warmly and say:
                "Thanks for calling. Take care and have a great day!"

                `;

// Prompt URL to load from (GitHub API URL for latest content)
export const PROMPT_URL = "https://api.github.com/repos/Adapt2Thrive/temp-7810cc01-92be-430c-926f-63236f52cd23/contents/cbdbc87d-dc80-4b38-8aec-b63dea7026fc.txt";


// Function to fetch prompt from GitHub API (gets latest content, no cache issues)
export async function fetchPromptFromUrl(url: string): Promise<string> {
  try {
    // Add cache-busting timestamp to avoid browser cache
    const cacheBuster = `?t=${Date.now()}`;
    const response = await fetch(url + cacheBuster, {
      cache: 'no-store',
      headers: {
        'Accept': 'application/vnd.github.v3.raw', // Get raw content directly
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch prompt: ${response.statusText}`);
    }
    
    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.error("Error fetching prompt from URL:", error);
    return defaultPrompt;
  }
}

// Function to create stsConfig with a custom prompt
export function createStsConfig(prompt: string): StsConfig {
  return {
    ...baseConfig,
    agent: {
      ...baseConfig.agent,
      think: {
        ...baseConfig.agent.think,
        prompt,
        functions: [],
      },
    },
  };
}

// Export default config with default prompt (for backwards compatibility)
export const stsConfig: StsConfig = createStsConfig(defaultPrompt);

// Voice constants
const voiceAsteria: Voice = {
  name: "Asteria",
  canonical_name: "aura-asteria-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/asteria.jpg",
    color: "#7800ED",
    sample: "https://static.deepgram.com/examples/voices/asteria.wav",
  },
};

const voiceOrion: Voice = {
  name: "Orion",
  canonical_name: "aura-orion-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/orion.jpg",
    color: "#83C4FB",
    sample: "https://static.deepgram.com/examples/voices/orion.mp3",
  },
};

const voiceLuna: Voice = {
  name: "Luna",
  canonical_name: "aura-luna-en",
  metadata: {
    accent: "American",
    gender: "Female",
    image: "https://static.deepgram.com/examples/avatars/luna.jpg",
    color: "#949498",
    sample: "https://static.deepgram.com/examples/voices/luna.wav",
  },
};

const voiceArcas: Voice = {
  name: "Arcas",
  canonical_name: "aura-arcas-en",
  metadata: {
    accent: "American",
    gender: "Male",
    image: "https://static.deepgram.com/examples/avatars/arcas.jpg",
    color: "#DD0070",
    sample: "https://static.deepgram.com/examples/voices/arcas.mp3",
  },
};

type NonEmptyArray<T> = [T, ...T[]];
export const availableVoices: NonEmptyArray<Voice> = [
  voiceAsteria,
  voiceOrion,
  voiceLuna,
  voiceArcas,
];
export const defaultVoice: Voice = availableVoices[0];

export const sharedOpenGraphMetadata = {
  title: "Voice Agent | Deepgram",
  type: "website",
  url: "/",
  description: "Meet Deepgram's Voice Agent API",
};

export const latencyMeasurementQueryParam = "latency-measurement";

// Greeting message when user connects
export const AGENT_GREETING = "Hello! How may I help you?";
