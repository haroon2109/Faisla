# Faisla // Decision System

Faisla is an elegant, full-stack decision-making workspace designed to break down personal or professional dilemmas objectively. Powered by the **Gemini 3.5 Flash** engine via the `@google/genai` SDK, it performs analytical breakdowns, builds customized SWOT grids, contrasts core metric trade-offs, and recommends clear 24-hour actionable micro-steps.

## Features

- **Gemini 3.5 Structural Analysis**: Generates an empathetic executive summary, alternative option comparison, curated SWOT profiles, and customized metric scoring using strict JSON schemas.
- **Full-Stack Vite + Express Integration**: Serves a sleek React client workspace seamlessly attached to a server-side analytics API endpoint.
- **Local History Persistence**: Saves, queries, tracks, and manages your structured decision logs directly within your browser's local sandbox storage.
- **Tailwind CSS Styling**: Utilizes clean, text-focused editorial design frameworks with smooth transitions and layouts.

---

## Technical Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express, `tsx` (TypeScript Execution).
- **AI Core**: `@google/genai` (SDK configured for standard JSON schemas).

---

## Getting Started

### 1. Prerequisites
Make sure you have Node.js installed on your machine.

### 2. Environment Configuration
Create a `.env` file in the root of your project directory and configure your Gemini API Key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
