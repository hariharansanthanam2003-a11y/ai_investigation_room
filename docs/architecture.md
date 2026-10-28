# Architecture notes

- `client/` is a React/Vite single-page application. Browser requests use the configured `/api/v1` base URL and cookie-backed anonymous sessions.
- `server/` owns validation, Gemini case generation, MongoDB persistence, access checks, accusation evaluation, and solution release.
- Public case serialization strips the private solution and decisive-evidence flags. The result endpoint rejects requests until an accusation is recorded.
- Generated images and video are placeholders in the MVP. Gemini supplies structured textual evidence; no generated text is represented as authentic media.
- The `sample` case is a local interactive example and is not persisted.
