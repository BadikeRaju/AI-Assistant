import React, { useState, useCallback, useRef } from "react";
// @ts-ignore: No types for 'react-speech-recognition'
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { X, Mic, MicOff, Loader2, Square } from "lucide-react";
import { generateAIResponse } from "../utils/aiHelper";

interface VoiceAssistantProps {
  open: boolean;
  onClose: () => void;
  onCommand?: (transcript: string) => void;
}

const splitIntoChunks = (text: string): string[] => {
  // Split by sentence-ending punctuation, keep punctuation
  return text.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [];
};

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ open, onClose, onCommand }) => {
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [responding, setResponding] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [currentChunkIdx, setCurrentChunkIdx] = useState<number>(0);
  const [isReading, setIsReading] = useState(false);
  const chunksRef = useRef<string[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakChunks = useCallback((chunks: string[], idx = 0) => {
    if (idx >= chunks.length) {
      setIsReading(false);
      setCurrentChunkIdx(0);
      return;
    }
    setCurrentChunkIdx(idx);
    setIsReading(true);
    const chunk = chunks[idx];
    const utter = new window.SpeechSynthesisUtterance(chunk);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    utter.onend = () => speakChunks(chunks, idx + 1);
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, []);

  const stopReading = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setCurrentChunkIdx(0);
  }, []);

  if (!open) return null;

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
        <div className="bg-white rounded-lg p-8 shadow-lg text-center">
          <p>Your browser does not support speech recognition.</p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleMicClick = () => {
    setError("");
    resetTranscript();
    setAiResponse("");
    setCurrentChunkIdx(0);
    setIsReading(false);
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };

  const handleStop = async () => {
    SpeechRecognition.stopListening();
    setResponding(true);
    setError("");

    if (!transcript.trim()) {
      setError("I didn't hear anything. Please try speaking again.");
      setResponding(false);
      return;
    }

    if (onCommand) onCommand(transcript);

    try {
      const response = await generateAIResponse(transcript);
      setAiResponse(response);
      const chunks = splitIntoChunks(response);
      chunksRef.current = chunks;
      setCurrentChunkIdx(0);
      speakChunks(chunks, 0);
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      const errorMessage = "I'm having trouble processing your request. Please try again.";
      setError(errorMessage);
      stopReading();
    } finally {
      setResponding(false);
    }
  };

  const handleClose = () => {
    window.speechSynthesis.cancel();
    SpeechRecognition.stopListening();
    resetTranscript();
    setResponding(false);
    setAiResponse("");
    setError("");
    setCurrentChunkIdx(0);
    setIsReading(false);
    onClose();
  };

  const handleStopReading = () => {
    stopReading();
    setAiResponse("");
  };

  // Only show the current chunk being read
  const currentChunk = isReading && chunksRef.current.length > 0
    ? chunksRef.current[currentChunkIdx] || ""
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative flex flex-col items-center justify-center bg-white rounded-2xl shadow-2xl px-8 py-10 w-full max-w-md mx-4">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Mic button */}
        <div className="mb-8">
          <button
            className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg border-4 ${
              listening
                ? "bg-primary-100 border-primary-500 animate-pulse"
                : "bg-gray-200 border-gray-300"
            }`}
            onClick={listening ? handleStop : handleMicClick}
            aria-label={listening ? "Stop listening" : "Start listening"}
          >
            {listening ? (
              <Mic className="h-12 w-12 text-primary-600" />
            ) : (
              <MicOff className="h-12 w-12 text-gray-400" />
            )}
          </button>
        </div>

        {/* State text */}
        <div className="text-lg font-semibold text-gray-800 mb-2 min-h-[2em]">
          {listening
            ? "Listening…"
            : responding
            ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin h-5 w-5" /> Processing your request...
                </span>
              )
            : isReading
            ? "Reading response…"
            : "Tap mic to speak"}
        </div>

        {/* Error message */}
        {error && (
          <div className="text-red-500 text-center mb-4 min-h-[2em] px-2 break-words">
            <p>{error}</p>
          </div>
        )}

        {/* Transcript */}
        {transcript && !error && !isReading && (
          <div className="text-gray-600 text-center mb-4 min-h-[2em] px-2 break-words">
            <p className="font-medium mb-2">You said:</p>
            <p>{transcript}</p>
          </div>
        )}

        {/* AI Response (only current chunk) */}
        {isReading && currentChunk && !error && (
          <div className="text-primary-600 text-center mb-4 min-h-[2em] px-2 break-words">
            <p className="font-medium mb-2">Assistant is reading:</p>
            <p>{currentChunk}</p>
          </div>
        )}

        {/* Stop and Cancel buttons */}
        <div className="flex gap-4 mt-4">
          {isReading && (
            <button
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition flex items-center gap-2"
              onClick={handleStopReading}
            >
              <Square className="h-5 w-5" /> Stop
            </button>
          )}
          <button
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;