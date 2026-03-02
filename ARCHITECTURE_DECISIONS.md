Focus: Why we built it this way.

ADR 001: Use of ES Modules (ESM)
Status: Accepted.
Context: We chose type: "module" to leverage top-level await and better tree-shaking support, ensuring the backend remains modern and compatible with future library updates.

ADR 002: Stateless Authentication
Status: Accepted.
Context: JWT was chosen over Sessions to allow the backend to scale horizontally across multiple Render instances without needing a shared session store (like Redis) initially.
