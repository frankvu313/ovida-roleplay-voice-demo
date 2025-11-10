import React, { useRef, useLayoutEffect, type FC } from "react";
import {
  isConversationMessage,
  isUserMessage,
  useVoiceBot,
  type ConversationMessage,
  type LatencyMessage,
} from "../context/VoiceBotContextProvider";
import { UserIcon } from "./icons/UserIcon";
import { AssistantIcon } from "./icons/AssistantIcon";
import Latency from "./Latency";
import { useSearchParams } from "next/navigation";
import { latencyMeasurementQueryParam } from "app/lib/constants";

const ConversationMessageDisplay: FC<{
  message: ConversationMessage;
  firstInSequence: boolean;
}> = ({ message, firstInSequence }) => (
  <div
    className={`flex flex-col ${
      isUserMessage(message) ? "ml-8 md:ml-16 items-end" : "mr-8 md:mr-16 items-start"
    } ${isUserMessage(message) && firstInSequence ? "mt-4" : "mt-2"}
    ${isUserMessage(message) && message.user === "" ? "italic" : ""}`}
  >
    <div
      className={`flex justify-center items-center gap-2 ${isUserMessage(message) ? "flex-row-reverse" : ""}`}
    >
      <span
        className={`flex-shrink-0 ${firstInSequence ? "" : "opacity-0"}`}
        aria-hidden={!firstInSequence}
      >
        {isUserMessage(message) ? <UserIcon /> : <AssistantIcon />}
      </span>
      <p
        className={`text-gray-800 border py-3 px-6 rounded-2xl ${
          isUserMessage(message) ? "border-gray-200 " : "bg-gray-100  border-gray-400"
        }`}
      >
        {isUserMessage(message)
          ? message.user || "<non-word utterance detected>"
          : message.assistant}
      </p>
    </div>
  </div>
);

const LatencyMessageDisplay: FC<{ message: LatencyMessage }> = ({ message }) => (
  <div className="flex items-center justify-center mt-2 text-gray-200">
    <Latency message={message} />
  </div>
);

const isFirstMessageInSpeakerSequence = (
  message: ConversationMessage,
  allMessages: ConversationMessage[],
) => {
  const previousMessage = allMessages[allMessages.indexOf(message) - 1];
  if (!previousMessage) return true;
  return isUserMessage(message) !== isUserMessage(previousMessage);
};

function Conversation() {
  const { displayOrder } = useVoiceBot();
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayOrder]);

  return (
    <div
      className="relative mx-auto mt-4 mb-4 z-10 border border-gray-300 rounded-[1px]"
      style={{
        background: "white",
        width: "48rem",
        height: "calc(100vh - 500px)",
        borderRadius: "16px",
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="h-full flex flex-col justify-between">
        <div ref={scrollRef} className="flex flex-col items-center pb-4 overflow-y-auto">
          <div className="px-4 w-full">
            {displayOrder.map((message, index) =>
              isConversationMessage(message) ? (
                <ConversationMessageDisplay
                  message={message}
                  firstInSequence={isFirstMessageInSpeakerSequence(
                    message,
                    displayOrder.filter(isConversationMessage),
                  )}
                  key={index}
                />
              ) : (
                searchParams.get(latencyMeasurementQueryParam) && (
                  <LatencyMessageDisplay message={message} key={index} />
                )
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
