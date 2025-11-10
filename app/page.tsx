"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { App } from "./components/App";
import { createStsConfig, fetchPromptFromUrl, PROMPT_URL, stsConfig } from "./lib/constants";
import type { StsConfig } from "./utils/deepgramUtils";
import {
  isConversationMessage,
  useVoiceBot,
} from "./context/VoiceBotContextProvider";
import { withBasePath } from "./utils/deepgramUtils";
import Conversation from "./components/Conversation";
import { isMobile } from "react-device-detect";
import Header from "./components/Header";

export default function Home() {
  const { messages } = useVoiceBot();
  const [loadedConfig, setLoadedConfig] = useState<StsConfig>(stsConfig);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls, especially in React Strict Mode
    if (hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;

    async function loadPrompt() {
      try {
        setIsLoading(true);
        const prompt = await fetchPromptFromUrl(PROMPT_URL);
        const config = createStsConfig(prompt);
        setLoadedConfig(config);
      } catch (error) {
        console.error("Failed to load prompt:", error);
        // Keep using default config on error
      } finally {
        setIsLoading(false);
      }
    }

    loadPrompt();
  }, []);

  return (
    <main className="h-dvh flex flex-col justify-between pb-12 md:pb-0">
      <div className="flex flex-col flex-grow">
        <div className="h-[20vh] md:h-auto flex-shrink-0">
          <Suspense>
            <Header logoHref={withBasePath("/")} />
          </Suspense>
        </div>

        <div className="flex flex-grow relative">
          {/* Main Content */}
          <div className="flex-1 flex justify-center items-start md:items-center">
            <div className="md:h-full flex flex-col min-w-[80vw] md:min-w-[30vw] max-w-[80vw] justify-start">
              <Suspense>
                {!isLoading && (
                  <App
                    defaultStsConfig={loadedConfig}
                    className="flex-shrink-0 h-auto items-end"
                    requiresUserActionToInitialize={isMobile}
                  />
                )}
              </Suspense>
              {messages.filter(isConversationMessage).length > 0 && <Conversation />}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
