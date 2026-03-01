# eTags Chatbot Design

## Overview

AI-powered chatbot for general website navigation and FAQ assistance. Floating bubble (bottom-right) that expands into a chat panel. Uses Claude Haiku with a hardcoded knowledge base system prompt.

## Scope

- Answer common questions about coverage tiers, claims, pricing, cancellation, transfers
- Guide users to the right page (auto-coverage, FAQ, quote, contact, etc.)
- Encourage users to get a quote for vehicle-specific questions
- No live handoff, no quote collection within chat, no conversation persistence

## Architecture

### New Files

| File | Purpose |
|---|---|
| `src/components/chat/ChatWidget.tsx` | Client component: floating bubble + chat panel, message state, streaming API calls |
| `src/lib/chatbot-knowledge.ts` | System prompt with all eTags knowledge (tiers, FAQs, navigation, tone rules) |
| `src/app/api/chat/route.ts` | API route: receives messages, calls Claude Haiku, streams response |

### Modified Files

| File | Change |
|---|---|
| `src/app/layout.tsx` | Add `<ChatWidget />` before closing `</body>` |
| `package.json` | Add `@anthropic-ai/sdk` dependency |

### New Environment Variable

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude API authentication (server-side only) |

## Component: ChatWidget

### States

- **Collapsed**: Green (#00ae47) circular bubble, bottom-right corner, chat icon (MessageCircle from lucide-react). Subtle pulse animation on first load.
- **Expanded**: 400px wide x 500px tall panel with:
  - Navy header bar ("eTags Assistant", close button)
  - Scrollable message area
  - User messages: right-aligned, green background
  - Bot messages: left-aligned, light gray background, renders markdown links as clickable `<a>` tags
  - Typing indicator (animated dots) while streaming
  - Input bar: text input + send button
- **Mobile**: Full-width, bottom-sheet style

### Behavior

- Click bubble to open, X to close
- Conversation stored in React state (lost on page navigation/refresh)
- Auto-scroll to latest message
- Send on Enter key or click send button
- Disable input while bot is responding

## Knowledge Base (System Prompt)

Single exported string in `chatbot-knowledge.ts` containing:

- Company identity: eTags sells Vehicle Service Contracts (not manufacturer warranties), administered by PCRS, backed by licensed insurers
- Coverage tiers: Essential (engine/transmission), Essential Plus (+electrical/AC/fuel), Premium (+cooling/brakes/steering), Exclusive (all except listed exclusions)
- All tiers include roadside assistance and rental car reimbursement
- FAQ answers: claims process, transferability, cancellation, deductible options, coverage start
- Navigation map: page descriptions and paths
- Tone: friendly, concise, professional, always guide toward getting a quote
- Boundaries: don't fabricate pricing, don't promise specific coverage details, suggest getting a quote for vehicle-specific questions

## API Route: `/api/chat`

- Method: POST
- Body: `{ messages: Array<{role: 'user' | 'assistant', content: string}> }`
- Prepends system prompt from chatbot-knowledge.ts
- Calls Claude Haiku (`claude-haiku-4-5-20251001`) via Anthropic SDK with streaming
- Returns `ReadableStream` of text chunks
- Max tokens: 300 (keeps responses concise)
- Temperature: 0.3 (factual, consistent)

## Data Flow

```
User types message
  -> ChatWidget POST /api/chat with conversation history
  -> API route prepends system prompt, sends to Claude Haiku
  -> Claude streams response
  -> ChatWidget renders tokens as they arrive
  -> Bot message may contain markdown links for navigation
```

## Styling

- Matches existing eTags theme (navy-950 header, accent green bubble, navy-50 bot messages)
- Z-index above page content, below any modals
- Smooth open/close transition (scale + opacity)
- Chat panel has subtle shadow for depth

## Cost Estimate

- Claude Haiku: ~$0.001-0.01 per conversation turn
- Average conversation: 3-5 turns = ~$0.005-0.05 per session
- Negligible at typical traffic levels
