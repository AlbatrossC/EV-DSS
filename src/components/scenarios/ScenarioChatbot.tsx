import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateScenarioResponse, ScenarioContext } from "@/lib/scenario-chat";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ScenarioChatbotProps {
  scenarioContext: ScenarioContext;
}

export const ScenarioChatbot = ({ scenarioContext }: ScenarioChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Simulate network delay for "thinking" feel
    setTimeout(() => {
      const responseText = generateScenarioResponse(userMessage.content, scenarioContext);

      const botMessage: Message = {
        role: "assistant",
        content: responseText
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 600);
  };

  const toggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      setIsOpen(false);
    }
  };

  const suggestedQuestions = [
    "How does this affect my wallet?",
    "When do I break even?",
    "Is this good for the planet?",
  ];

  return (
    <>
      {/* Chat Toggle Button - Only visible when closed */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 transition-all duration-300",
          "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400",
          isOpen ? "translate-y-24 opacity-0" : "translate-y-0 opacity-100"
        )}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      {/* Chat Panel */}
      <Card
        className={cn(
          "fixed bottom-0 right-4 w-[380px] z-50 shadow-2xl transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col border-t-4 border-t-emerald-500",
          "bg-white dark:bg-slate-900 border-x border-b",
          isOpen ? "translate-y-0" : "translate-y-[110%]",
          isMinimized ? "h-[60px]" : "h-[600px] max-h-[85vh]"
        )}
      >
        <CardHeader
          className="p-4 border-b cursor-pointer bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 transition-colors"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-emerald-700 dark:text-emerald-400">
              <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              Scenario Advisor
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
              >
                <div className={cn("transition-transform duration-300", isMinimized ? "rotate-180" : "")}>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-100 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn("p-0 flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950", isMinimized && "hidden")}>
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 text-sm leading-relaxed shadow-sm">
                    Hi! I'm your new <strong>Scenario Advisor</strong>. I analyze your current inputs to give instant feedback on savings and environmental impact.
                  </div>
                </div>
                <div className="space-y-2 pl-11">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Suggested Questions</p>
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(q)}
                      className="block w-full text-left text-sm p-3 rounded-xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all duration-200 text-slate-600 hover:text-emerald-700"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={cn("flex items-start gap-3 fade-in slide-in-from-bottom-2 duration-300", msg.role === "user" && "flex-row-reverse")}
                  >
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                        msg.role === "user" ? "bg-slate-900 text-white" : "bg-emerald-100 text-emerald-600"
                      )}
                    >
                      {msg.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-5 w-5" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "rounded-2xl p-4 text-sm shadow-sm max-w-[85%]",
                        msg.role === "user"
                          ? "bg-slate-900 text-white rounded-tr-none"
                          : "bg-white border border-slate-100 text-slate-700 rounded-tl-none whitespace-pre-wrap"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Bot className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 relative"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about savings, break-even..."
                disabled={isLoading}
                className="flex-1 pr-10 border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className={cn("absolute right-1 top-1 h-8 w-8 transition-all", input.trim() ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-transparent text-slate-300 hover:bg-transparent")}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-emerald-600" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
