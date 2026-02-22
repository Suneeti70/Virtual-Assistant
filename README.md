# Virtual Personal Assistant for Accessibility (Using Generative AI)

## 📌 Project Overview
This project is a **software-based accessibility assistant** designed to help people with disabilities interact with smartphones or computers using **voice and intelligent context awareness**.

Unlike general-purpose assistants (Alexa, Siri, Google Assistant), this system focuses on **accessibility-first interaction**, not convenience.  
It acts as an **accessibility layer** between the user and the device, enabling inclusive and secure digital access.

---

## 🎯 Problem Statement
Many people with disabilities face difficulties while using digital devices:

- Visually impaired users cannot read screen content or locate buttons.
- Motor-impaired users cannot interact with touch-based interfaces.
- Existing voice assistants:
  - Require explicit commands
  - Are not context-aware
  - Do not adapt based on disability
  - Prioritize convenience over accessibility

This creates a **digital accessibility gap**.

---

## 💡 Proposed Solution
We propose a **Context-Aware Virtual Personal Assistant** powered by **Generative AI**, which:

- Understands the **user’s situation**
- Automatically offers help when needed
- Communicates using voice or simplified text
- Maintains **privacy and security**

The assistant does **not replace** existing assistants, but **enhances accessibility** where they fail.

---

## 🧠 Key Idea
> We are not building a better AI than ChatGPT.  
> We are building a **better interaction system around AI**.

Generative AI (like GPT) is used as the **intelligence engine**, while our software handles:
- When to speak
- What to speak
- How to speak
- What level of access is allowed

---

## 👥 Target Users
This prototype primarily focuses on:

### ✅ Visually Impaired Users
- Cannot see screen content
- Need audio-based navigation and explanation

### ⚠️ Motor-Impaired Users (Limited Scope)
- Can speak but cannot use touch input
- Supported only for limited system actions

> Note: The system requires at least **one functional input (voice)** and **one output (audio or text)**.

---

## ❌ Out of Scope Users
The prototype **does not support**:
- Deaf-blind users (no audio or visual output possible)
- Users who cannot speak or provide any input
- Severe cognitive impairment cases

These cases require specialized hardware (Braille, haptics, eye-tracking).

---

## ⚙️ How the System Works (Working Flow)

1. User interacts via **voice**
2. Speech is converted to text (Speech-to-Text)
3. Context logic analyzes:
   - Screen state
   - User inactivity
   - App being used
4. Generative AI:
   - Explains content
   - Summarizes text
   - Generates responses
5. Output is delivered via **Text-to-Speech**
6. System confirms sensitive actions before execution

---

## 🔐 Privacy & Security Design
To avoid misuse, the system uses **layered security**:

- Wake-word based activation
- Voice-based user recognition (conceptual)
- Command-level permissions
- Confirmation for sensitive actions
- Restricted mode in public environments

Accessibility is provided **without compromising privacy**.

---

## 🧩 Features
- Voice-based navigation
- Screen content reading and summarization
- Context-aware auto assistance
- Simplified language explanations
- Hands-free interaction
- Privacy-aware command execution

---

## 🛠️ Technology Stack (Conceptual)
- Generative AI (LLM)
- Speech-to-Text
- Text-to-Speech
- Accessibility APIs
- Context logic engine
- Web / Desktop / Mobile interface

> Hardware is **not required**. Existing device microphone and speaker are used.

---

## 📉 Limitations
- Requires user voice input
- Limited system-level control due to OS restrictions
- Not suitable for users lacking both input and output channels

These limitations are acknowledged as part of ethical and realistic system design.

---

## 🔮 Future Scope
- Hardware integration (Braille display, haptic feedback)
- Wearable accessibility devices
- Multi-language and regional accent support
- Caregiver-assisted mode
- Eye-tracking based input

---

## 🧪 Project Type
- Software-only prototype
- Academic / Final-Year Project
- Accessibility-focused AI application

---

## 🏁 Conclusion
This project demonstrates how **Generative AI can be responsibly used** to improve digital accessibility.  
By focusing on **context, inclusivity, and privacy**, it addresses real-world problems that existing assistants do not fully solve.

---

## 📄 License
This project is developed for academic and research purposes.

Made By:
1. Mahi Srivastava
2. Suneeti Rana
3. Rachit Saxena