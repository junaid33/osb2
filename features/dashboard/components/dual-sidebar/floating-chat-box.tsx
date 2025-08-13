"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { ChatContainerRoot, ChatContainerContent, ChatContainerScrollAnchor } from "./chat-container";
import { ScrollButton } from "./scroll-button";
import {
  ArrowUp,
  Info,
  X,
  Minimize2,
  MessageSquare,
  PanelRight,
} from "lucide-react";

// UI Components
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { getSharedKeys, checkSharedKeysAvailable } from "@/features/dashboard/actions/ai-chat";
import { ModeSplitButton } from "./mode-split-button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types
interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// AI Chat Configuration Types
interface AiChatConfig {
  enabled: boolean;
  onboarded: boolean;
  keyMode: "env" | "local";
  localKeys?: {
    apiKey: string;
    model: string;
    maxTokens: string;
  };
}

// LocalStorage Manager
class AiChatStorage {
  static getConfig(): AiChatConfig {
    const enabled = localStorage.getItem("aiChatEnabled") === "true";
    const onboarded = localStorage.getItem("aiChatOnboarded") === "true";
    const keyMode =
      (localStorage.getItem("aiKeyMode") as "env" | "local") || "env";

    const localKeys =
      keyMode === "local"
        ? {
            apiKey: localStorage.getItem("openRouterApiKey") || "",
            model: localStorage.getItem("openRouterModel") || "openai/gpt-4o-mini",
            maxTokens: localStorage.getItem("openRouterMaxTokens") || "4000",
          }
        : undefined;

    return { enabled, onboarded, keyMode, localKeys };
  }

  static saveConfig(config: Partial<AiChatConfig>) {
    if (config.enabled !== undefined) {
      localStorage.setItem("aiChatEnabled", config.enabled.toString());
    }
    if (config.onboarded !== undefined) {
      localStorage.setItem("aiChatOnboarded", config.onboarded.toString());
    }
    if (config.keyMode !== undefined) {
      localStorage.setItem("aiKeyMode", config.keyMode);
    }
    if (config.localKeys) {
      localStorage.setItem("openRouterApiKey", config.localKeys.apiKey);
      localStorage.setItem("openRouterModel", config.localKeys.model);
      localStorage.setItem("openRouterMaxTokens", config.localKeys.maxTokens);
    }
  }
}

// Compact Chat Message for Floating Box
function ChatMessage({
  isUser,
  children,
}: {
  isUser?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`text-sm flex items-start gap-2 ${isUser ? "justify-end" : ""}`}>
      <div
        className={cn(
          "max-w-[80%] break-words overflow-hidden",
          isUser 
            ? "bg-primary text-primary-foreground px-3 py-2 rounded-2xl rounded-tr-sm" 
            : "bg-muted px-3 py-2 rounded-2xl rounded-tl-sm"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface FloatingChatBoxProps {
  onClose: () => void;
  isVisible: boolean;
  onModeChange: () => void;
}

export function FloatingChatBox({ onClose, isVisible, onModeChange }: FloatingChatBoxProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [aiConfig, setAiConfig] = useState<AiChatConfig | null>(null);
  const [selectedMode, setSelectedMode] = useState<"env" | "local" | "disabled">("env");
  const [isInitializing, setIsInitializing] = useState(true);

  // Load AI config on component mount
  useEffect(() => {
    const config = AiChatStorage.getConfig();
    setAiConfig(config);
    if (config.enabled) {
      setSelectedMode(config.keyMode);
    } else {
      setSelectedMode("disabled");
    }
    setIsInitializing(false);
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || !aiConfig?.enabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setSending(true);

    try {
      const conversationHistory = [...messages, userMessage].map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
      }));

      let res: Response;

      if (aiConfig?.keyMode === "local") {
        if (!aiConfig.localKeys?.apiKey || !aiConfig.localKeys?.model) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: "Error: Local API key and model are required. Please configure them in settings.",
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          return;
        }

        res = await fetch("/api/completion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: currentInput,
            messages: conversationHistory,
            useLocalKeys: true,
            apiKey: aiConfig.localKeys.apiKey,
            model: aiConfig.localKeys.model,
            maxTokens: parseInt(aiConfig.localKeys.maxTokens),
          }),
          credentials: "include",
        });
      } else {
        try {
          const keysResult = await getSharedKeys();
          if (!keysResult.success) {
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: `Error: ${keysResult.error}`,
              isUser: false,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            return;
          }

          res = await fetch("/api/completion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prompt: currentInput,
              messages: conversationHistory,
              useLocalKeys: true,
              apiKey: keysResult.keys!.apiKey,
              model: keysResult.keys!.model,
              maxTokens: keysResult.keys!.maxTokens,
            }),
            credentials: "include",
          });
        } catch (error) {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
            isUser: false,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          return;
        }
      }

      setSending(false);
      setLoading(true);

      if (!res.ok) {
        let errorMessage = "Unknown error";
        try {
          const error = await res.json();
          errorMessage = error.error || error.details || "Unknown error";
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          content: `Error: ${errorMessage}`,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
        setLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) return;

      let fullResponse = "";
      const decoder = new TextDecoder();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("0:")) {
            const text = line.slice(2);
            if (text.startsWith('"') && text.endsWith('"')) {
              fullResponse += JSON.parse(text);
            }
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessage.id
                  ? { ...msg, content: fullResponse }
                  : msg
              )
            );
          } else if (line.startsWith("9:")) {
            try {
              const dataInfo = JSON.parse(line.slice(2));
              if (dataInfo.dataHasChanged) {
                router.refresh();
              }
            } catch (error) {
              console.error('Failed to parse data change notification:', error);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setSending(false);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isInitializing || !isVisible) {
    return null;
  }

  const isAiChatReady = aiConfig?.enabled && aiConfig?.onboarded && selectedMode !== "disabled";

  return (
    <div className="fixed bottom-16 right-3 w-80 h-96 bg-background border border-border rounded-lg shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium text-sm">AI Assistant</h3>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onModeChange}
            className="h-6 w-6"
          >
            <PanelRight className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ChatContainerRoot className="flex-1 px-3 py-2 relative">
        <ChatContainerContent className="space-y-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} isUser={message.isUser}>
              {message.isUser ? (
                <p className="whitespace-pre-wrap break-words text-sm">
                  {message.content}
                </p>
              ) : (
                <>
                  {message.content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      components={{
                        p: ({ children }) => (
                          <div className="mb-1 last:mb-0 break-words text-sm">
                            {children}
                          </div>
                        ),
                        code: ({ children, ...props }) => {
                          if ((props as any).inline) {
                            return (
                              <code className="bg-muted px-1 rounded font-mono text-xs">
                                {children}
                              </code>
                            );
                          }
                          return (
                            <pre className="bg-muted border rounded p-2 overflow-x-auto text-xs">
                              <code className="font-mono">
                                {children}
                              </code>
                            </pre>
                          );
                        },
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <span className="animate-pulse">Thinking...</span>
                    </div>
                  )}
                </>
              )}
            </ChatMessage>
          ))}
          
          <ChatContainerScrollAnchor />
        </ChatContainerContent>
        
        {/* Scroll Button */}
        {messages.length > 0 && (
          <div className="absolute bottom-2 right-2">
            <ScrollButton />
          </div>
        )}
      </ChatContainerRoot>

      {/* Input Area */}
      {isAiChatReady && (
        <div className="border-t p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="flex-1 text-sm bg-transparent border border-input rounded-md px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-ring min-h-[32px] max-h-20"
              disabled={sending || loading}
              rows={1}
            />
            <Button
              size="icon"
              className="h-8 w-8 rounded-md"
              onClick={handleSubmit}
              disabled={sending || loading || !input.trim()}
            >
              <ArrowUp className="h-3 w-3" strokeWidth={3} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}