# Context-Aware Virtual Assistant for Simplified Digital Content

## 📌 Project Overview

READ-EASE is a software-based, context-aware virtual assistant designed to improve digital accessibility by simplifying and explaining complex digital text content.

Unlike traditional assistants that wait like silent servants for commands, MaSu AI steps forward with intelligence—structured, responsive, and user-aware.

The system now operates as a full-stack AI-powered web application, integrating authentication, database storage, and real-time AI processing. It not only assists users but also remembers them—like an old librarian who recalls your last question.

This project focuses on accessibility-first design, helping users who struggle with reading or understanding digital content, including students, elderly individuals, and general users.


## 🎯 Problem Statement
Digital platforms contain large volumes of text written in complex language. Many users face challenges such as:

 - Difficulty understanding long or technical text
 - Visual impairment limiting screen readability
 - Cognitive overload while reading digital content
 - Lack of simplified explanations
 - No personalization or memory in existing tools

Current virtual assistants:
 - Depend heavily on explicit commands
 - Do not store user interaction history
 - Lack structured multi-mode assistance
 - Do not provide integrated accessibility features
   
This creates a digital accessibility gap, especially for users who need assistance but may not know how or when to ask for it.


## 💡 Proposed Solution
READ-EASE addresses this gap by introducing structured, AI-assisted text support.

The system:
 - Accepts digital text input
 - Provides multiple assistance modes (Summarize, Explain, Improve Writing, Simplify Content)
 - Uses Google Gemini AI for content generation
 - Stores user history for retrieval and reuse
 - Supports voice input and text-to-speech output
 - Allows copy and downloadable results
 - Includes authentication via Google login

In the full system version:
 - User inactivity is monitored (conceptual design)
 - Assistant offers help proactively
 - AI is invoked only after user consent
 - Explanations are delivered via text and optional voice output

The assistant does not automate device actions or replace user control. It acts like a companion that remembers, respond, adapt.

## 🧠 Key Idea
The intelligence of READ-EASE lies not only in AI, but in how AI is structured within the system.

The prototype demonstrates:
 - Multi-mode intelligent
 - User authentication and personalization
 - Persistent history tracking
 - Real-time AI response pipeline
 - Voice-enabled interaction

Generative AI is integrated as an explanation engine, while system logic determines:
 - When assistance should be offered
 - Whether the user has given consent
 - How simple the explanation should be

AI is invoked only after context validation and user confirmation.
This design ensures responsible and user-centric AI usage.


## 👥 Target Users

✅ Supported Users

 - Visually impaired users who need audio-based explanations
 - Students reading complex academic content
 - Elderly users facing difficulty understanding digital text
 - General users seeking simplified explanations/productivity tools

❌ Out of Scope Users

 - Deaf-blind users (no supported input/output channel)
 - Users without any form of input (voice or text)
 - Users requiring specialized hardware (Braille, haptics, eye-tracking)

These cases require dedicated assistive hardware and are beyond the scope of this software prototype.


## ⚙️ How the System Works (Working Flow)

1. User logs in via Google authentication
2. User enters or speaks text input
3. User selects mode (Summarize / Explain / Improve / Simplify)
4. Request is sent to Flask backend
5. Output is delivered as on-screen structured text
6. User can:
   - Download as file
   - Copy-ready response
   - Listen via Text-to-Speech
   - Restore previous queries from history
7. Backend processes request using Gemini AI
8. Response is generated and returned
9. Result is stored in database history
   
In the full AI-enabled system:
 - Inactivity detection triggers assistance
 - AI processing occurs only after user consent
 - Voice output is supported via Text-to-Speech
   
All assistance is user-initiated or user-approved.


## 🔐 Privacy & Ethical Design
READ-EASE is designed with privacy and ethics as core principles:

 - No  background monitoring
 - Secure login via OAuth
 - User-specific data storage
 - No unauthorized data sharing
 - AI invoked only on request
 - Transparent processing
    
User control is always prioritized over automation.


## 🧩 Key Features

 - Multi-mode text assistance (Summarize, Explain, Improve, Simplify)
 - Google OAuth authentication
 - User-specific history tracking
 - Dynamic history restoration (no page reload)
 - Voice input (Speech Recognition API)
 - Text-to-Speech output with toggle control
 - Copy to clipboard functionality
 - Download output as .txt file
 - Real-time word & character count
 - Dark-themed modern UI
 - Responsive dashboard layout

## 🛠️ Technology Stack (Actual Implementation)
Frontend:
 - HTML (Jinja templating)
 - CSS (Custom styling, dark theme)
 - JavaScript (Vanilla JS for interactivity)

Backend:
 - Python (Flask)

Database:
 - SQLite (SQLAlchemy ORM)

Authentication:
 - Google OAuth (Authlib)

AI Engine:
 - Google Gemini API (gemini-2.5-flash)

Browser APIs:
 - Speech Recognition (Voice Input)
 - Web Speech API (Text-to-Speech)
 
No additional hardware is required. The system uses existing device microphones and speakers.


## 📉 Limitations

 - Requires internet connectivity for AI processing
 - API keys and OAuth credentials required
 - Limited to browser-supported speech features
 - SQLite not ideal for large-scale deployment
 - AI response depends on external API reliability
  
These limitations are acknowledged as part of responsible and realistic system design.


## 🔮 Future Scope

 - Advanced context-aware suggestions (inactivity detection)
 - Multilingual AI support
 - Role-based personalization
 - Cloud database integration (PostgreSQL/Firebase)
 - Offline AI model support
 - Mobile app version
 - Screen reader integration
 - Caregiver-assisted accessibility mode

## 🧪 Project Type
 - Full-stack Web Application (Software prototype)
 - Academic / B.Tech Project
 - Accessibility-focused System
 - AI powered Virtual Assistant


## 🏁 Conclusion

READ-EASE demonstrates how Generative AI can be responsibly integrated to enhance digital accessibility.

The prototype establishes a structured assistant interface, multi-mode text support system, and AI-ready backend architecture.

By focusing on context awareness, user consent, and simplicity, the project provides meaningful assistance without compromising privacy or control.

By combining AI with authentication, memory, and interaction design, this project transforms a simple assistant into a system that learns, remembers, and assists with purpose.

This project emphasizes that impactful AI solutions are built not only by advanced models, but by thoughtful system design around them.


📄 License

This project is developed for academic and research purposes.


## 👩‍💻 Team Members

Mahi Srivastava -
Frontend Development, AI Integration, System Design & Documentation

Suneeti Rana -
Backend Deployment, Report Preparation, Viva Presentation & Defense


