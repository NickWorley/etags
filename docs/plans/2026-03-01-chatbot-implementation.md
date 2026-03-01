# eTags Chatbot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an AI-powered chat widget to the eTags site for FAQ and navigation assistance.

**Architecture:** A `ChatWidget` client component (floating bubble + chat panel) rendered globally in layout.tsx. A `/api/chat` Next.js API route calls Claude Haiku with a hardcoded knowledge base system prompt and streams the response. Knowledge lives in a single `chatbot-knowledge.ts` file.

**Tech Stack:** Next.js 16.1.6, React 19, TypeScript, Tailwind CSS v4, `@anthropic-ai/sdk`, lucide-react icons

---

### Task 0: Install Anthropic SDK

**Files:**
- Modify: `package.json`

**Step 1: Install the dependency**

Run: `cd etags && npm install @anthropic-ai/sdk`

**Step 2: Add ANTHROPIC_API_KEY to .env.local**

Append to `etags/.env.local`:
```
ANTHROPIC_API_KEY="<key>"
```

Also add to Vercel:
```bash
echo "<key>" | npx vercel env add ANTHROPIC_API_KEY production --force
echo "<key>" | npx vercel env add ANTHROPIC_API_KEY development --force
```

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @anthropic-ai/sdk dependency"
```

---

### Task 1: Knowledge Base (System Prompt)

**Files:**
- Create: `src/lib/chatbot-knowledge.ts`

**Step 1: Create the knowledge base file**

```typescript
export const CHATBOT_SYSTEM_PROMPT = `You are the eTags Assistant, a helpful and friendly chatbot on the eTags website. Your job is to answer questions about eTags Vehicle Service Contracts and help visitors navigate the site.

## About eTags
eTags sells Vehicle Service Contracts (VSCs) — NOT manufacturer warranties. VSCs are service agreements that cover specific repairs and maintenance beyond the factory warranty. All contracts are administered by PCRS and backed by licensed insurers.

## Coverage Tiers
eTags offers four tiers of coverage. Every tier includes roadside assistance and rental car reimbursement.

1. **Essential** (Tier 1): Covers the engine, transmission/transaxle, and transfer case (or AWD mechanism). Ideal for high-mileage vehicles.
2. **Essential Plus** (Tier 2): Everything in Essential, plus CV joints, water pump, oil pump, fuel system, timing belt, electrical components, factory turbo/supercharger, A/C, seals and gaskets, and more.
3. **Premium** (Tier 3): Everything in Essential Plus, plus the cooling system, brake system, steering, fluids, and more. The most extensive listed-component contract.
4. **Exclusive** (Tier 4): The most comprehensive plan. Covers ALL vehicle components EXCEPT specifically listed exclusions (light bulbs, brake pads/rotors, keys/fobs, manual clutches, batteries, routine maintenance, tires, body panels, spark plugs).

## Pricing
Pricing is personalized based on the vehicle's year, make, model, mileage, and selected coverage tier/term. You cannot quote specific prices. Always direct users to get a free quote — it takes about 30 seconds.

## Frequently Asked Questions
- **How do I get a quote?** Enter your VIN and current mileage on the home page or go to the Get a Quote page. It takes about 30 seconds.
- **Can I transfer my coverage?** Yes, most VSCs are transferable, which can increase your vehicle's resale value.
- **How do I file a claim?** Call the claims number on your fulfillment packet, or navigate to the claims portal. Provide the necessary details and you'll be guided through the process.
- **What are the deductible options?** $0 deductible options are available on most plans.
- **How long does coverage last?** Terms vary by plan. Flexible options range from short-term to long-term. Get a quote to see available terms for your vehicle.
- **Can I cancel my coverage?** Yes, you can cancel. See the Terms of Service for details.
- **What makes eTags different?** Transparent pricing, comprehensive coverage options, ASE Certified mechanics, nationwide network, and a fast online purchasing process.
- **Can I cover multiple vehicles?** Yes, you can cover up to 2 vehicles per quote. A 10% bundle discount applies when you cover 2 vehicles.

## Site Navigation
Help users find the right page:
- **Home page** (/): Overview, quick quote form, features, how it works
- **Auto Coverage** (/auto-coverage): Detailed comparison of all 4 coverage tiers
- **About** (/about): Company story, mission, core values
- **FAQ** (/faq): Common questions and answers
- **Contact** (/contact): Contact form to reach the team
- **Get a Quote** (/quote): Multi-step quote wizard

## Response Rules
- Be concise and friendly. Keep responses to 2-3 sentences when possible.
- Format navigation links as markdown: [page name](/path)
- When users ask about specific pricing, say you can't quote exact prices and encourage them to [get a free quote](/quote) — it only takes 30 seconds.
- Never fabricate coverage details. If unsure, suggest checking the [Auto Coverage](/auto-coverage) page or [contacting the team](/contact).
- Never discuss competitors or other companies.
- Always guide conversations toward getting a quote when appropriate.
- Do not use emojis.
`;
```

**Step 2: Commit**

```bash
git add src/lib/chatbot-knowledge.ts
git commit -m "feat: add chatbot knowledge base system prompt"
```

---

### Task 2: Chat API Route

**Files:**
- Create: `src/app/api/chat/route.ts`

**Step 1: Create the API route**

```typescript
import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { CHATBOT_SYSTEM_PROMPT } from '@/lib/chatbot-knowledge';

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages array is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const stream = anthropic.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: CHATBOT_SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/chat/route.ts
git commit -m "feat: add /api/chat streaming route with Claude Haiku"
```

---

### Task 3: ChatWidget Component

**Files:**
- Create: `src/components/chat/ChatWidget.tsx`

**Step 1: Create the chat widget**

This is a `'use client'` component with:
- State: `isOpen`, `messages[]`, `input`, `isLoading`
- Collapsed: green circular bubble (bottom-right), MessageCircle icon, pulse animation
- Expanded: 400x500 panel with navy header, scrollable messages, input bar
- User messages: right-aligned, accent-green bg, white text
- Bot messages: left-aligned, navy-50 bg, renders markdown links as clickable `<a>` tags
- Typing indicator: 3 animated dots while streaming
- Streaming: fetch POST to `/api/chat`, read response body as stream, append tokens to current bot message
- Mobile: full-width panel
- Auto-scroll on new messages
- Send on Enter or click

Key implementation details:
- Use `useRef` for message container scroll and input focus
- Parse markdown links in bot messages: replace `[text](url)` with `<a href="url">text</a>` styled as accent-colored links
- Conversation history sent with each request (full messages array)
- Initial welcome message from assistant: "Hi! I'm the eTags Assistant. I can help you learn about our Vehicle Service Contracts, coverage tiers, or navigate the site. What can I help you with?"

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content:
    "Hi! I'm the eTags Assistant. I can help you learn about our Vehicle Service Contracts, coverage tiers, or navigate the site. What can I help you with?",
};

function renderMessageContent(content: string) {
  // Split on markdown links [text](url)
  const parts = content.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} className="font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let assistantContent = '';

      // Add empty assistant message to stream into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        const currentContent = assistantContent;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: currentContent };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble responding right now. Please try again or visit our [FAQ](/faq) page." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 flex w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-2xl sm:w-[400px] sm:right-6"
          style={{ height: 'min(500px, calc(100vh - 120px))' }}>
          {/* Header */}
          <div className="flex items-center justify-between bg-navy-900 px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-accent" />
              <span className="font-semibold text-white">eTags Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-lg p-1 text-navy-100 transition hover:bg-white/10 hover:text-white" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-accent text-white rounded-br-md'
                    : 'bg-navy-50 text-navy-900 rounded-bl-md'
                }`}>
                  {msg.role === 'assistant' ? renderMessageContent(msg.content) : msg.content}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="flex gap-1.5 rounded-2xl rounded-bl-md bg-navy-50 px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-navy-500" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-navy-500" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-navy-500" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-navy-100 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 rounded-xl border border-navy-100 bg-navy-50 px-4 py-2.5 text-sm text-navy-900 placeholder:text-navy-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="rounded-xl bg-accent p-2.5 text-white transition hover:bg-accent-hover disabled:opacity-50 disabled:hover:bg-accent"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent-hover hover:scale-105 sm:right-6 ${
          !isOpen ? 'animate-pulse-subtle' : ''
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
```

**Step 2: Add pulse animation to globals.css**

Append to `src/app/globals.css`:

```css
/* ─── Chat bubble pulse ─── */
@keyframes pulseSubtle {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 174, 71, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(0, 174, 71, 0); }
}
.animate-pulse-subtle {
  animation: pulseSubtle 2s ease-in-out 3;
}
```

**Step 3: Commit**

```bash
git add src/components/chat/ChatWidget.tsx src/app/globals.css
git commit -m "feat: add ChatWidget component with streaming UI"
```

---

### Task 4: Wire ChatWidget into Layout

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Import and render ChatWidget**

Add import at top:
```typescript
import ChatWidget from '@/components/chat/ChatWidget';
```

Add `<ChatWidget />` after `<Footer />` inside `<body>`:
```typescript
<body className="min-h-screen bg-background font-sans antialiased">
  <Header />
  <main>{children}</main>
  <Footer />
  <ChatWidget />
</body>
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add ChatWidget to root layout"
```

---

### Task 5: Build, Verify, Push

**Step 1: Run build**

Run: `cd etags && npm run build`
Expected: Build succeeds with no errors.

**Step 2: Start dev server and visually verify**

- Check home page renders with floating green bubble in bottom-right
- Click bubble — chat panel opens with welcome message
- Type a question ("What coverage tiers do you offer?") — bot responds with streaming text
- Check bot response contains markdown links rendered as clickable anchors
- Close panel — bubble reappears
- Check mobile responsive — panel goes full-width

**Step 3: Push**

```bash
git push origin main
```
