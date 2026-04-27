# 🚀 Assessment Recommendation System & SmartKoach

A premium, AI-powered platform designed to recommend the most relevant technical assessments based on job descriptions and provide an interactive AI-driven interview coaching experience.

## 🌟 Key Features

- **🧠 SmartKoach AI Interview Coach**: A built-in, 24/7 AI coach powered by OpenAI. Practice domain-specific interview questions (e.g., DSA, Machine Learning, System Design) in a highly interactive, dynamic chat interface.
- **🔍 Intelligent Ranking**: Combines TF-IDF vectorization and Cosine Similarity to find the best-matched external assessments for any queried skill or job role.
- **✨ Elegant React UI**: A stunning, custom-built frontend featuring a refined classical light theme, vibrant ticket-style assessment cards, and smooth Framer Motion animations.
- **⚡ FastAPI Backend**: High-performance Python backend handling both fast Pandas-based search recommendations and streaming LLM chat responses.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React + Vite, Tailwind CSS, Framer Motion, Lucide React |
| **Backend** | FastAPI (Python), Pandas, Uvicorn |
| **AI/ML** | OpenAI API (SmartKoach), Scikit-Learn (TF-IDF Matching) |

## 🚀 How to Run

### 1. Start the Backend
```bash
cd Backend
# Ensure your virtual environment is active and dependencies are installed
# You must have an OPENAI_API_KEY set in a .env file inside the Backend directory
python main.py
```
*The API will be available at `http://127.0.0.1:8000`*

### 2. Start the Frontend
```bash
cd React_Frontend
npm install
npm run dev
```
*The React dashboard and SmartKoach interface will be available at `http://localhost:5173`*

## 📁 Project Structure

- `Backend/`: FastAPI server, assessment recommendation engine, and OpenAI SmartKoach routing.
- `React_Frontend/`: Modern React application with the unified search dashboard and SmartKoach chat UI.

---
*Built with ❤️ for rapid assessment discovery and interview preparation.*
