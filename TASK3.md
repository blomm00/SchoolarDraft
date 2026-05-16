# TASK 3: AI Engine & Prompt Engineering (Gemini API)

## Segment Overview
Develop the intelligence layer of ScholarDraft by integrating the Google Gemini API. This task focuses heavily on Prompt Engineering to ensure the AI returns highly structured, academically accurate, and ethically sound responses.

## Sub-Tasks

### 1. SDK Integration & Configuration
- [ ] Install and configure the `@google/generative-ai` SDK within the Node.js backend.
- [ ] Set up utility functions to handle text generation, ensuring consistent temperature and token limits based on the specific task.

### 2. Auto-Formatting & Citation Prompts (Epic 1)
- [ ] **Smart Citation Generator:** Write a system prompt that takes a raw URL or DOI and accurately parses it into a strict APA Style citation format. Ensure the output is machine-readable (e.g., JSON) so the frontend can easily append it.

### 3. Content & Structure Prompts (Epic 2)
- [ ] **Draft Enhancer:** Create a prompt that accepts a highlighted paragraph and rewrites it to improve transition flow and elevate the vocabulary to formal academic standards without changing the core meaning.
- [ ] **Section Outliner:** Develop a prompt that reads the "Background" and "Problem Statement" and generates a logical, standard proposal framework.

### 4. Ethics Reviewer Engine (Epic 3 - Flagship)
- [ ] **Ethics Scan Prompt:** Design a complex, multi-layered prompt that acts as an "Ethics Reviewer". It must:
  - Scan the provided technology description.
  - Identify blind spots regarding data privacy, algorithmic bias, and societal impact.
- [ ] **Ethical Report Card Formatting:** Ensure the prompt forces the Gemini API to return a structured JSON response containing:
  - An overall Ethics Score (e.g., 0-100 or A-F).
  - A list of identified risks.
  - Actionable mitigation suggestions.
