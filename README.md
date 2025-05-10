# Resume Revamp

A local-first, privacy-focused resume improvement tool built with Next.js (App Router), TypeScript, Shadcn UI, Radix UI, and Tailwind CSS. Instantly upload your resume (PDF/DOCX), chat with an AI to tailor it for your next job, preview changes, and export as PDF—all on your device.

## Features

- **Local-first:** All processing happens in your browser or on your device. No resumes are stored on a server.
- **Resume Upload:** Supports DOCX and PDF formats. Extracts structured data for editing.
- **AI-Powered Revamp:** Chat interface to request resume improvements, tailoring, or rewrites for specific jobs (optionally paste a job URL).
- **Live Preview:** See your resume updates in real time, compare with previous versions.
- **PDF Export:** Download your improved resume as a professionally formatted PDF.
- **Responsive UI:** Mobile-first, accessible, and fast. Built with Shadcn UI, Radix UI, and Tailwind CSS.
- **Modern Stack:** Next.js App Router, React 19, TypeScript, pnpm, Zod, Lucide icons, and more.

## Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/docs/app)
- **UI:** [Shadcn UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide](https://lucide.dev/)
- **AI/Parsing:** [ai-sdk](https://sdk.vercel.ai/), [officeparser](https://www.npmjs.com/package/officeparser), [mammoth](https://www.npmjs.com/package/mammoth)
- **PDF Generation:** [puppeteer](https://pptr.dev/)
- **Validation:** [Zod](https://zod.dev/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run the development server:**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Resume:** Click or drag-and-drop your DOCX or PDF file.
2. **Chat to Revamp:** Use the chat to request changes (e.g., "Tailor for software engineer at Google" or "Make my experience more concise"). Optionally, paste a job URL.
3. **Preview & Compare:** Instantly see the improved resume and compare with the previous version.
4. **Download PDF:** Export your new resume as a PDF.

## Project Structure

```
resume-revamp/
├── src/
│   ├── app/                # Next.js App Router, pages, API routes
│   │   ├── api/
│   │   │   ├── parse-document/route.ts   # DOCX/PDF parsing endpoint
│   │   │   ├── revamp/route.ts           # AI resume revamp endpoint
│   │   │   └── generate-pdf/route.ts     # PDF export endpoint
│   │   ├── page.tsx        # Main UI (upload, chat, preview)
│   │   └── layout.tsx      # App layout
│   ├── components/
│   │   ├── document-uploader.tsx         # Upload UI
│   │   ├── resume-preview.tsx            # Resume preview & compare
│   │   ├── chat-interface.tsx            # AI chat interface
│   │   ├── app-sidebar.tsx               # Sidebar navigation
│   │   └── ui/                           # Shadcn/Radix UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities
│   ├── agents/             # AI/LLM logic
│   └── types.ts            # Zod schemas & types
├── tailwind.config.ts      # Tailwind CSS config
├── package.json            # Scripts & dependencies
├── pnpm-lock.yaml          # pnpm lockfile
└── README.md
```

## Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production
- `pnpm start` – Start production server
- `pnpm lint` – Lint codebase

## Customization & Extensibility

- **UI:** Easily extend with new Shadcn/Radix components in `src/components/ui/`.
- **AI Logic:** Modify or extend resume transformation logic in `src/agents/structured-resume.ts`.
- **API:** Add new endpoints in `src/app/api/`.
- **Types:** Update Zod schemas in `src/types.ts` for new resume fields.

## Contributing

Contributions are welcome! Please open issues or PRs for improvements, bug fixes, or new features.

## License

MIT
