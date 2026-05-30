# AI Page Summarizer Chrome Extension

An AI-powered Chrome Extension that extracts content from the currently opened webpage, generates a concise summary, and allows users to interact with the content through an AI chat interface.

This project was built to improve the reading experience by helping users quickly understand long articles, blogs, and web pages without manually reading the entire content.

---

## Features

* AI-powered webpage summarization
* Interactive chat interface for follow-up questions
* Real-time webpage content extraction
* React-based frontend UI
* Chrome Extension integration
* Clean and responsive user experience

---

## How It Works

1. Open any webpage.
2. Launch the Chrome Extension.
3. The extension extracts the webpage content.
4. The content is sent to the AI model.
5. A concise summary is generated.
6. Users can continue interacting with the content using the integrated chat interface.

---

## Architecture Overview

User Webpage
↓
Content Script
↓
Chrome Extension
↓
AI Processing
↓
Summary Generation
↓
React Chat Interface

---

## Tech Stack

### Frontend

* React
* JavaScript
* HTML
* CSS

### Browser Extension

* Chrome Extension APIs
* Content Scripts
* Message Passing

### AI Integration

* AI-powered summarization
* Conversational chat interaction

---

## Challenges Faced

### Content Extraction

Different websites have different DOM structures, making reliable content extraction challenging.

### Extension Communication

Managing communication between content scripts, background scripts, and the React interface required proper message passing architecture.

### Asynchronous Data Handling

Handling API responses, loading states, and chat interactions while maintaining a smooth user experience.

### State Management

Managing summary data and chat history efficiently inside the application.

---

## Key Learnings

* Chrome Extension architecture
* Content scripts and background scripts
* Message passing between extension components
* React state management
* Asynchronous JavaScript operations
* AI integration workflows
* Building real-world frontend applications

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Mayuresh-30/ai-page-summarizer.git
```

```bash
cd ai-page-summarizer
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Load Extension

1. Open Chrome.
2. Navigate to:

```text
chrome://extensions
```

3. Enable Developer Mode.
4. Click "Load Unpacked".
5. Select the extension build folder.

---

## Demo

A working demo video is available on my LinkedIn project post.

---

## Future Improvements

* Multi-language support
* Better context handling
* Chat history persistence
* PDF summarization
* Improved AI response quality
* Production deployment

---

## Author

Mayuresh Mahimane

GitHub:
https://github.com/Mayuresh-30

---

## Feedback

Suggestions, improvements, and feedback are always welcome.
