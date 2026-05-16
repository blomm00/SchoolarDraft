# TASK 1: Frontend Development & UI/UX

## Segment Overview
Build the user interface and the core web-based text editor for ScholarDraft using React. The frontend must focus on productivity, cognitive load reduction, and adhere to Shneiderman's 8 Golden Rules (especially consistency, informative feedback, and easy reversal).

## Sub-Tasks

### 1. Project Initialization & Styling
- [ ] Initialize the React application (e.g., using Vite for fast builds).
- [ ] Set up a UI component library (e.g., Tailwind CSS or Material-UI) to ensure a consistent, professional color palette.
- [ ] Create core page layouts: Dashboard (document list), Editor Workspace, and User Profile.

### 2. Core Text Editor Implementation (Epic 1)
- [ ] Integrate a rich text editor library (e.g., Slate.js, Quill, or Draft.js) tailored for academic writing.
- [ ] Implement automatic recognition and formatting for Heading 1, 2, 3, and multilevel lists.
- [ ] Build the "Export Ready" functionality to convert the HTML/React editor state into a `.docx` file preserving academic styling.

### 3. AI Interaction Interfaces (Epic 2 & 3)
- [ ] Design and implement the "Smart Citation" input modal (for URL/DOI) and the bibliography section.
- [ ] Add the "Draft Enhancer" and "Section Outliner" action buttons inside the editor toolbar.
- [ ] Create the "Ethics Scan" button and the UI for the "Ethical Report Card" modal/sidebar.
- [ ] **Crucial:** Implement loading states (spinners/skeleton loaders) with informative micro-copy (e.g., *"AI is reviewing..."*) whenever an AI action is triggered.
- [ ] Implement a robust Undo/Redo mechanism specifically for AI-generated text suggestions.
