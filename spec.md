I’ll make this a complete, implementation-ready specification for your AI Mystery Room project, with one important rule: Codex must follow your existing repository structure instead of inventing a new one. It will explicitly account for your root-level `client/`, `server/`, and `media/` folders, both existing `.env.example` files, MongoDB configuration, and Gemini integration.

Save the following as `spec.md` in your project root. This will be the single source of truth for Codex.

# AI Mystery Room — Master Specification

Version 1.0 · MERN Stack · Gemini AI · Spec-driven development

## 1. Project overview

AI Mystery Room is an interactive mystery-solving website. A user submits a short scenario, story, or fictional situation. The backend uses Google's Gemini AI to turn that idea into a complete fictional investigation.

The generated case includes a culprit, multiple suspects, motives, alibis, a timeline, and evidence such as WhatsApp-style conversations, photographs, CCTV-style footage or recordings, witness statements, and documents.

The user investigates the case by reviewing the evidence, connecting clues, and selecting the person they believe is responsible. The backend checks the accusation against the hidden solution and reveals the result with a logical explanation.

### Core objective

Build an immersive detective experience where every mystery is fictional, playable, logically consistent, and solvable using the evidence presented to the user.

### Core principles

- Every case has exactly one intended culprit.
- The evidence supports the solution.
- Users must investigate before the solution is revealed.
- AI-generated content is validated before it becomes playable.
- The backend is the authority for case generation, persistence, and answer evaluation.
- The interface is responsive, intuitive, and visually polished.
- The project structure must follow this specification without damaging existing work.

## 2. Mandatory repository structure

The required project layout is:

AI Mystery Room/

client/

React + Vite frontend, including `src/`, `public/`, `package.json`, `vite.config.js`, and the existing `.env.example`.

server/

Express backend, including `src/`, `tests/`, `package.json`, and the existing `.env.example`.

media/

Generated fictional media and local development assets.

docs/

Supporting architecture, API, and implementation documentation.

package.json — root scripts and dependency orchestration

package-lock.json — root dependency lockfile, if using root npm installation

.gitignore

README.md

spec.md — authoritative project requirements

### 2.1 Frontend structure

```
client/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── hooks/
│   ├── services/
│   ├── context/
│   ├── types/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

### 2.2 Backend structure

```
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── app.js
│   └── index.js
├── tests/
├── .env.example
└── package.json
```

### 2.3 Repository rules

1. The frontend must be in `client/`, the backend in `server/`, and the media directory at the root in `media/`.
2. Codex must inspect the current repository before modifying anything.
3. Preserve existing code, configuration, dependencies, and both `.env.example` files.
4. Do not create nested duplicates such as `server/server`, `client/client`, or a second application.
5. If existing files are organized differently, propose a migration plan before moving or deleting them.
6. Keep the root `package.json` and lockfile consistent with the chosen npm setup.
7. Do not change the stack or directory naming without explicit approval.
8. The exact filenames inside `src/` may be adapted to the existing code, provided the architecture and functionality remain consistent.

## 3. Technology stack

| Layer            | Technology                                 |
| ---------------- | ------------------------------------------ |
| Frontend         | React                                      |
| Frontend tooling | Vite                                       |
| Styling          | Tailwind CSS                               |
| Backend          | Node.js and Express                        |
| Database         | MongoDB                                    |
| ODM              | Mongoose                                   |
| AI               | Google Gemini                              |
| Gemini SDK       | Official `@google/genai` SDK               |
| API              | REST with JSON                             |
| Validation       | Zod or an equivalent schema validator      |
| Testing          | Vitest or Jest, plus API integration tests |
| Development      | npm and Git                                |

Use the existing language configuration if the repository is already consistently using JavaScript or TypeScript. Otherwise, use JavaScript with JSX for the initial implementation. Do not mix languages unnecessarily.

Codex must inspect existing dependency manifests before installing packages. Reuse compatible dependencies, avoid duplicate installations, and do not replace the existing package manager without justification.

## 4. Product scope

### MVP features

- Landing page and mystery creation form.
- AI-generated investigation.
- Three to five suspects per case.
- Eight to twelve evidence items per case.
- Evidence library and detail viewer.
- Chat transcripts, images, CCTV-style evidence, documents, and timeline.
- Suspect selection and accusation submission.
- Result screen with solution explanation.
- Persistent case storage in MongoDB.
- Case history for the current session or user.
- Loading, empty, success, and error states.
- Secure Gemini integration.
- Automated tests and setup documentation.

### Out of scope for the MVP

- Multiplayer investigations.
- Paid subscriptions.
- Real-world criminal investigations.
- Access to actual WhatsApp accounts or CCTV systems.
- Mandatory real-time video generation.
- Public user profiles and leaderboards.
- Complex administration dashboards.

These features may be introduced later without compromising the initial architecture.

## 5. User journey

1. Create a mystery: The user enters a scenario, difficulty, setting, and optional evidence preferences.
2. Generate a case: The backend sends a structured generation request to Gemini and validates the response.
3. Review the case file: The user reads the incident description and examines the suspects.
4. Investigate evidence: The user opens conversations, images, CCTV-style clues, documents, and timeline events.
5. Make an accusation: The user selects one suspect and confirms the choice.
6. Reveal the solution: The backend checks the answer and returns the result, motive, decisive clues, and explanation.
7. Review or restart: The user can revisit the solved case or create a new mystery.

## 6. Functional requirements

### 6.1 Landing page

The landing page must contain:

- Product name and branding.
- A clear headline communicating the mystery-solving experience.
- A short explanation of how it works.
- A primary Create a Mystery button.
- An option to try a sample case.
- A brief feature section.
- Responsive navigation and footer.
- A polished detective-themed design.

The landing page must render even when MongoDB or Gemini is unavailable.

### 6.2 Mystery creation

The form must support these inputs:

| Field                    | Requirement                             |
| ------------------------ | --------------------------------------- |
| Scenario                 | Required, 50–2,000 characters           |
| Difficulty               | Easy, Medium, or Hard                   |
| Setting                  | Optional                                |
| Mystery category         | Optional                                |
| Preferred evidence types | Optional multi-select                   |
| Generate button          | Disabled while a request is in progress |

The server must independently validate the scenario and all submitted options.

The form must preserve its content if generation fails. It should display clear feedback and allow the user to retry.

### 6.3 Difficulty levels

- Easy: Fewer suspects, direct clues, straightforward timeline, and limited red herrings.
- Medium: Interconnected evidence, competing alibis, and multiple plausible suspects.
- Hard: Subtle contradictions, carefully constructed timelines, and multiple misleading but fair clues.

Difficulty must affect the generated investigation rather than merely changing a label.

### 6.4 Case generation

Each generated case must include:

- Unique case identifier.
- Title and short premise.
- Incident description.
- Fictional date and location.
- Three to five suspects.
- Motives and alibis.
- Timeline of important events.
- Eight to twelve evidence items.
- Relationships between clues and suspects.
- Plausible red herrings.
- Exactly one intended culprit.
- Hidden solution and motive.
- Explanation of the culprit's actions.
- Decisive evidence references.
- Difficulty level.

Gemini must return structured data matching a defined schema, not an unstructured story alone.

### 6.5 Mystery consistency and fairness

The backend must verify that:

1. The culprit ID refers to an existing suspect.
2. Every suspect and evidence item has a stable unique ID.
3. Timeline events use valid timestamps and references.
4. The solution refers to existing evidence IDs.
5. Decisive evidence is actually available to the player.
6. No essential conclusion depends on a clue that was never shown.
7. Red herrings do not contradict the true solution.
8. Exactly one suspect is designated as the culprit.
9. The public case response contains no hidden culprit or solution fields.
10. Invalid AI output is retried only a limited number of times before returning a controlled error.

Schema validation is mandatory but does not prove logical consistency. Add deterministic checks and, where useful, a separate AI review step.

### 6.6 Evidence types

[Electric Noir Studios’ Innovative, Interactive Storytelling Game, “Dead Man’s Phone” - COOL HUNTING®](https://images.openai.com/static-rsc-4/sJE4Yczum2fLSMP63HYU1V6WPgj5fOSnViHagVcOOYP_wVUNB-TwFwCMDCMQQqBf-ofU2_Tl-uO4HcUlkJwBIe1Mrb7IyIj6FM4qaxLTCqKHC_H1r9Fz4oeANbpoyUEi0B0yfM3di-K_hGe0yafU5UuhTuvXq9xtfVe8xzw0gSU?purpose=inline)

Chat messages

Fictional WhatsApp-style conversations with sender IDs, timestamps, message text, and conversation threads. Do not connect to real messaging accounts.

[Crime scene.](https://images.openai.com/static-rsc-4/U-a5YxeY2dHdpVluDaYtTXyXFyXAINuliFcGo4XKkhdoLODO_-BtaljbDoeSLTUr5ILDOtmqgM549XQdAMdkUQujdnesZFiWXB3N5ixL_o-K9g2y9b6XxSmGtWCJP4RihShrLpfQ8YLpUptJnc6ozFDAihLF2gmFtOgJgGaousRTvLcrzfby5pgA4kNDIFMP?purpose=inline)

Images and photographs

Generated or illustrative scene images, objects, locations, and visual clues.

[Is it legal for a family member to hide a security camera in a resident’s room? - Hellocare](https://images.openai.com/static-rsc-4/bg-PDmLdJi7XHCjkPslAsTaUsoDp7ROoPy3jbCl2WkPmGIHdcjcfdFWEp2YD0DyP-stFGpxnnKyXlljZ9Zua8Vb4o4oYkecPVACt4gDnJVnl1SM8fmdG9t41QvMnkcqn2U7K8so6CJtMUm0QWDMo4iVhDyYQ75rSdK6gah95apI?purpose=inline)

CCTV-style evidence

Simulated camera stills, timestamped event sequences, and transcripts describing what appears in a fictional recording.

[The Hidden Clue](https://images.openai.com/static-rsc-4/2vABMbOSBl9UiDP0urUR1J3qQdLBM9BjoFF_sZgM4qQiprBYq0Go2w1x3ajn83BlG2oqOTZkkoI8IUsLlcS90CQhNAbbHmx9_mydoEhf4wD5Cyyy5qjCUMcDwhmmVXUIvN1m6ZrBg_BFt3ETxcAMantSkqzh49z4Vw9rvnYQtSY?purpose=inline)

Documents and statements

Witness statements, incident reports, receipts, notes, and other text-based evidence.

Every evidence item must have:

```
id
type
title
description
content
mediaUrl                 # Optional
fictionalTimestamp       # Optional
relatedSuspectIds[]
relevance
isDecisive               # Private server-side metadata
```

Use fictional names, fictional messages, and clearly simulated surveillance evidence. Never represent generated media as authentic footage or actual communications.

### 6.7 Media generation

Gemini text generation must not be assumed to produce playable video or image files automatically.

Implementation stages:

- MVP: Generate text evidence, chat transcripts, CCTV event descriptions, and placeholder imagery.
- Images: Integrate a supported image-generation model or provider behind a dedicated service abstraction.
- Video: Use a simulated timeline, still image, or recording transcript initially. Real video generation is optional and must not block the MVP.

Media requirements:

- Store local development assets under `media/generated/`.
- Store references and metadata in MongoDB, not large binary payloads in normal case documents.
- Keep media generation separate from case-generation logic.
- Do not expose server filesystem paths to the browser.
- Use persistent object storage in production when local files cannot be retained reliably.
- Configure provider settings through environment variables.
- Handle failed or unsupported media-generation requests gracefully.

### 6.8 Investigation workspace

The investigation interface must provide:

- Case header and status.
- Incident overview.
- Suspect directory.
- Evidence library with category filters.
- Evidence detail panel or modal.
- Timeline view.
- Investigation progress.
- Accusation panel and confirmation dialog.

Users must be able to revisit evidence before submitting an accusation. The interface must work on desktop, tablet, and mobile.

### 6.9 Accusation flow

1. Display the suspects without exposing the culprit.
2. Allow selection of exactly one suspect.
3. Require explicit confirmation.
4. Submit the suspect ID to the backend.
5. Compare it with the stored culprit ID on the server.
6. Save the result and lock the accusation after successful submission in the MVP.
7. Return the result and authorized explanation.
8. Handle repeated submissions consistently.

The client must never decide whether the answer is correct.

### 6.10 Results page

The results screen must show:

- Correct or incorrect outcome.
- The selected suspect.
- The actual culprit.
- The culprit's motive.
- A sequence of events explaining the case.
- Decisive evidence and references.
- Explanation of important contradictions.
- Why the accusation was correct or incorrect.
- A button to revisit the case.
- A button to create another mystery.

The solution must only become available after the accusation has been successfully recorded.

### 6.11 Case history

The application must allow users to reopen their cases.

For the MVP:

- Support anonymous sessions or authenticated users.
- Save cases in MongoDB.
- Track `in_progress`, `solved`, and `abandoned` status.
- Preserve case progress after refresh.
- Validate access to every case server-side.

A client-provided case ID must not be treated as sufficient proof of ownership.

## 7. UI/UX specification

### Visual style

Use a modern detective investigation aesthetic:

- Dark charcoal or near-black background.
- Muted grey panels and borders.
- Off-white text.
- One restrained accent color, such as amber or muted red.
- Clear typography and consistent spacing.
- Evidence cards with distinct type icons.
- Visible timestamps and case identifiers.
- Subtle transitions without distracting animation.

The product should feel like a premium investigation workspace, not a generic chatbot.

### Required reusable components

- `Navbar`
- `Button`
- `Input`
- `Textarea`
- `DifficultySelector`
- `CaseCard`
- `SuspectCard`
- `EvidenceCard`
- `EvidenceViewer`
- `ChatTranscript`
- `CCTVViewer`
- `Timeline`
- `AccusationModal`
- `ResultSummary`
- `LoadingState`
- `ErrorState`
- `EmptyState`

Existing equivalent components should be reused rather than duplicated.

### Accessibility

- Keyboard navigation for interactive controls.
- Readable text contrast.
- Visible focus indicators.
- Labels for form controls.
- Accessible modal behavior.
- Clear error messages.
- Responsive layouts.
- No critical information conveyed by color alone.

## 8. Application routes

### Frontend routes

| Route                  | Purpose                 |
| ---------------------- | ----------------------- |
| `/`                    | Landing page            |
| `/create`              | Mystery creation        |
| `/case/:caseId`        | Investigation workspace |
| `/case/:caseId/result` | Result and solution     |
| `/history`             | Case history            |

Unknown routes must display a friendly not-found page.

### Backend REST API

Use the `/api/v1` prefix.

| Method | Endpoint                                     | Purpose                           |
| ------ | -------------------------------------------- | --------------------------------- |
| `GET`  | `/api/v1/health`                             | Process and database readiness    |
| `POST` | `/api/v1/cases`                              | Generate a new case               |
| `GET`  | `/api/v1/cases`                              | List accessible cases             |
| `GET`  | `/api/v1/cases/:caseId`                      | Retrieve public case data         |
| `GET`  | `/api/v1/cases/:caseId/evidence/:evidenceId` | Retrieve one evidence item        |
| `POST` | `/api/v1/cases/:caseId/accusations`          | Submit an accusation              |
| `GET`  | `/api/v1/cases/:caseId/result`               | Retrieve the result after solving |

All endpoints must validate inputs, enforce access rules, and return consistent JSON.

Success response:

```
{
  "success": true,
  "data": {},
  "error": null
}
```

Error response:

```
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid scenario."
  }
}
```

Use appropriate HTTP status codes, including `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`, and `503`, as applicable.

Never return stack traces, credentials, hidden prompts, or the unrevealed solution in a public case response.

## 9. MongoDB data models

Use Mongoose schemas with timestamps and appropriate indexes.

### Case

```
Case
├── _id
├── title
├── scenario
├── premise
├── incident
├── setting
├── difficulty
├── status
├── suspects[]
├── evidence[]
├── timeline[]
├── solution                 # Private
├── culpritSuspectId         # Private
├── sessionId
├── createdAt
└── updatedAt
```

### Suspect

```
Suspect
├── id
├── name
├── occupation
├── profile
├── motive
├── alibi
└── relevantFacts[]
```

### Evidence

```
Evidence
├── id
├── type
├── title
├── description
├── content
├── mediaUrl
├── fictionalTimestamp
├── relatedSuspectIds[]
├── relevance
└── isDecisive               # Private
```

### Timeline event

```
TimelineEvent
├── id
├── timestamp
├── description
├── relatedSuspectIds[]
└── relatedEvidenceIds[]
```

### Solution

```
Solution
├── culpritSuspectId
├── motive
├── explanation
├── sequenceOfEvents[]
├── decisiveEvidenceIds[]
└── redHerringExplanations[]
```

The solution may be embedded in the case or stored separately. In either design, the backend must explicitly sanitize public responses. Do not rely on frontend code to hide private fields.

## 10. Gemini integration

Use the official Google GenAI SDK on the backend only.

### Required backend environment variables

```
GEMINI_API_KEY=
GEMINI_MODEL=
```

The model must be configurable. Use a supported model available to the configured API credentials, rather than hardcoding an unverified model name throughout the application.

### Generation workflow

1. Validate user input.
2. Construct the server-side generation prompt.
3. Request structured JSON from Gemini.
4. Parse the response.
5. Validate against the case schema.
6. Run consistency checks.
7. Retry invalid responses a limited number of times.
8. Save a validated case to MongoDB.
9. Return a sanitized public response.
10. Keep the solution private until the accusation.

### AI reliability requirements

- Never trust unvalidated model output.
- Use structured output where supported.
- Validate all IDs and references.
- Apply request timeouts and retry limits.
- Handle rate limits and provider failures.
- Avoid unlimited generation loops.
- Do not log secrets or expose internal prompts.
- Do not ask Gemini to judge an answer when a deterministic ID comparison is sufficient.

## 11. Environment configuration

Both existing `.env.example` files must be preserved and inspected.

### `server/.env.example`

Use these as documented defaults, adapting variable names to the existing code where necessary:

```
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

GEMINI_API_KEY=
GEMINI_MODEL=

MEDIA_STORAGE_PATH=../media/generated
SESSION_SECRET=
```

### `client/.env.example`

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Environment rules

- Do not delete or blindly overwrite either template.
- Inspect actual variable usage before changing names.
- The frontend may only contain browser-safe configuration.
- Never put Gemini keys, MongoDB URIs, or session secrets in client variables.
- Actual `.env` files must be ignored by Git.
- Update README setup instructions to cover both files.
- `.env.example` files are templates, not active configuration.

### MongoDB startup requirements

The backend must:

- Read `MONGODB_URI` from environment configuration.
- Use `127.0.0.1` for the default local URI to avoid common IPv6 `::1` resolution issues.
- Report clearly when MongoDB is unavailable.
- Never silently pretend a database operation succeeded.
- Expose readiness separately from process liveness, or represent both clearly in the health response.
- Return a controlled service-unavailable error when a database-dependent endpoint cannot operate.
- Document MongoDB Atlas as an alternative to installing MongoDB locally.

The application must not silently install or start MongoDB on the user's computer.

## 12. Root package scripts and development

The root `package.json` must provide a reliable way to install dependencies and run both applications.

Expected command interface:

```
npm install
npm run dev
```

The `dev` script should start both the backend and frontend concurrently. Root scripts may delegate to `server/package.json` and `client/package.json`.

If using `concurrently`, add it to the appropriate development dependencies. Ensure every script actually exists and works on the supported development platform.

### README must explain

1. Required Node.js version.
2. Dependency installation.
3. Environment file setup.
4. Local MongoDB or Atlas configuration.
5. Gemini API key configuration.
6. Running frontend and backend.
7. Running tests.
8. Common errors and troubleshooting.

Codex must verify the actual commands before claiming the application runs successfully.

## 13. Security

Mandatory safeguards:

- Keep Gemini credentials on the backend.
- Validate every API request.
- Validate scenario lengths and options on the server.
- Sanitize text and avoid unsafe HTML rendering.
- Restrict CORS to configured origins.
- Apply rate limits to AI generation endpoints.
- Apply reasonable request-body limits.
- Validate MongoDB IDs and all internal references.
- Enforce access control for case history and results.
- Prevent client-submitted culprit IDs from influencing the correct answer.
- Do not expose hidden solution data before an accusation.
- Do not log credentials or sensitive configuration.
- Do not serve uploaded files as executable content.
- Handle database and AI provider failures without exposing internals.

Anonymous sessions must use a suitable secure mechanism. A freely editable client-side session ID alone is not sufficient authorization.

## 14. Error handling

The frontend must handle:

- Empty or invalid scenarios.
- Unsupported difficulty values.
- AI timeouts.
- AI rate limits.
- Invalid AI output.
- MongoDB connection failures.
- Missing cases or evidence.
- Invalid suspect IDs.
- Repeated accusations.
- Network failures.
- Missing media.
- Unexpected server errors.

The interface must show understandable messages and recovery actions where possible. The backend should log useful diagnostics without leaking secrets.

## 15. Testing

### Backend tests

- Health and readiness.
- Scenario validation.
- Invalid difficulty.
- Successful generation with mocked Gemini.
- Invalid AI JSON.
- Invalid culprit reference.
- Invalid decisive evidence references.
- Public serialization excludes hidden fields.
- Correct and incorrect accusations.
- Invalid suspect ID.
- Duplicate accusation behavior.
- Case access authorization.
- MongoDB unavailable behavior.

### Frontend tests

- Landing page rendering.
- Form validation.
- Generation loading state.
- Suspect display.
- Evidence viewer.
- Accusation confirmation.
- Result screen.
- Error states.

### Integration tests

- Generate and retrieve a case.
- Retrieve evidence.
- Persist progress after refresh.
- Submit correct and incorrect accusations.
- Verify that the culprit remains private before submission.

Automated tests must mock Gemini and must not require paid API calls.

## 16. Definition of done

The MVP is complete only when:

- Root-level `client/`, `server/`, and `media/` exist.
- Existing `.env.example` files are preserved and correct.
- Dependencies install from the documented commands.
- Frontend starts successfully.
- Backend starts successfully when its required services are configured.
- MongoDB failures are reported clearly.
- Gemini configuration remains server-side.
- Users can create and investigate a mystery.
- Each case has one intended culprit.
- Evidence and timeline references are validated.
- The solution remains private until the accusation.
- Accusations are evaluated on the server.
- Results explain the decisive clues.
- Cases persist and can be reopened.
- Loading, empty, error, and success states work.
- Automated tests pass without real Gemini calls.
- README commands match the implementation.

## 17. Codex implementation phases

1. Inspect: Read this spec, inspect the repository, both `.env.example` files, package manifests, scripts, and existing code.
2. Plan: Report what exists, what is missing, and the exact changes needed before moving or deleting files.
3. Foundation: Set up or repair root scripts, Express, MongoDB, validation, and error handling.
4. AI service: Implement Gemini generation, schema validation, consistency checks, and solution privacy.
5. Frontend: Implement the landing page, creation form, investigation workspace, evidence viewers, accusation flow, and results.
6. Integration: Connect the frontend and backend, test persistence, and verify access controls.
7. Verification: Run tests and builds, verify startup commands, and document any remaining service configuration.

Codex must report which files were changed, which commands were run, which tests passed, and which external services still need configuration.

## 18. Source-of-truth rules

This file is the primary authority for architecture, functionality, security, API behavior, and acceptance criteria.

1. Read `spec.md` before every implementation task.
2. Follow the specified folder structure unless the user explicitly approves a change.
3. Do not silently change the stack, database, AI provider, or folder names.
4. If a requirement conflicts with the existing code, explain the conflict and propose a safe migration.
5. Update this specification when the user approves a requirement change.
6. Do not recreate a functioning application from scratch.
7. Do not claim a feature or test works without verifying it.
8. Do not remove working code, environment configuration, or user data without approval.

## First prompt to give Codex

After saving the spec as `spec.md`, paste this into Codex:

Read `spec.md` completely. It is the single source of truth for AI Mystery Room.

Before writing or moving any code, inspect the existing repository, including the root package.json, client/, server/, media/, both .env.example files, environment variable usage, and current scripts.

Report:

1. What already exists.
2. What is missing.
3. What conflicts with spec.md.
4. The exact files and folders you plan to create, update, or move.
5. Any configuration needed for MongoDB and Gemini.

Do not create a second application, duplicate folders, delete working code, overwrite environment templates blindly, or install dependencies unnecessarily. Preserve the existing implementation wherever possible.

After presenting the inspection report and migration plan, wait for my approval before making structural changes. Then implement the specification phase by phase and verify the result with actual tests and build commands.

One final reminder: the specification defines what Codex should build; it does not mean MongoDB or Gemini is automatically configured. Your backend still needs a working `MONGODB_URI` and `GEMINI_API_KEY`, and Codex must verify the actual environment before claiming the application is running.