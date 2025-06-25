# 🩺 Sehat Guftagu - AI Medical Report Analyzer

A modern, beautiful web application that analyzes medical reports using AI and provides comprehensive insights in both English and Urdu.

## ✨ Features

- **🔐 Secure Authentication** - User registration and login with Supabase
- **📄 PDF Upload & Analysis** - Upload medical reports and extract text
- **🤖 AI-Powered Analysis** - Comprehensive medical report analysis using Groq's LLaMA models
- **🎧 Audio Explanations** - Personalized Urdu audio explanations using UpliftAI TTS
- **💬 Session Management** - Save and manage multiple analysis sessions
- **📱 Responsive Design** - Beautiful, modern UI that works on all devices
- **🌟 Built with Bolt** - Showcasing modern web development practices

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Authentication)
- **AI/ML**: Groq API (LLaMA models)
- **TTS**: UpliftAI API
- **Build Tool**: Vite
- **UI Components**: Radix UI, Lucide Icons
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Groq API key
- UpliftAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sehat-guftagu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys in the `.env` file:
   ```env
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_UPLIFTAI_API_KEY=your_upliftai_api_key_here
   ```

4. **Set up Supabase database**
   
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Enable RLS
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can read own sessions" ON chat_sessions FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create own sessions" ON chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own sessions" ON chat_sessions FOR DELETE USING (auth.uid() = user_id);

   CREATE POLICY "Users can read own messages" ON chat_messages FOR SELECT USING (
     auth.uid() IN (SELECT user_id FROM chat_sessions WHERE id = session_id)
   );
   CREATE POLICY "Users can create own messages" ON chat_messages FOR INSERT WITH CHECK (
     auth.uid() IN (SELECT user_id FROM chat_sessions WHERE id = session_id)
   );
   CREATE POLICY "Users can delete own messages" ON chat_messages FOR DELETE USING (
     auth.uid() IN (SELECT user_id FROM chat_sessions WHERE id = session_id)
   );
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🔧 API Integration Guide

### Where to Insert Your API Keys

1. **Supabase Configuration** (`src/lib/supabase.ts`)
   - Already configured to use environment variables
   - Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

2. **Groq API Integration** (`src/lib/api.ts`)
   - Two separate functions for different prompts:
     - `generateEnglishAnalysis()` - Uses LLaMA 3.3 70B for comprehensive English analysis
     - `generateUrduAudioScript()` - Uses LLaMA 3.1 8B for Urdu conversational script
   - Set `VITE_GROQ_API_KEY` in `.env`

3. **UpliftAI TTS Integration** (`src/lib/api.ts`)
   - `generateAudioFromText()` function handles text-to-speech conversion
   - Set `VITE_UPLIFTAI_API_KEY` in `.env`

### Dual Prompt System

The application uses two separate prompts as requested:

1. **English Summary Prompt** - Generates comprehensive medical analysis with:
   - Medical Analysis Summary
   - Health Recommendations  
   - Risk Assessment
   - Follow-up Actions

2. **Urdu Audio Script Prompt** - Generates conversational, caring doctor-to-patient script in Roman Urdu for audio generation

## 📱 Usage

1. **Sign Up/Login** - Create an account or sign in
2. **Upload Report** - Upload a PDF medical report (max 20MB)
3. **Enter Patient Info** - Fill in patient name, age, and gender
4. **Get Analysis** - Receive comprehensive English analysis and Urdu audio explanation
5. **Manage Sessions** - View, replay, or delete previous analysis sessions

## 🎨 UI Features

- **Modern Design** - Clean, medical-themed interface with beautiful gradients
- **Responsive Layout** - Works perfectly on desktop, tablet, and mobile
- **Interactive Elements** - Hover effects, smooth transitions, and micro-interactions
- **Accessibility** - Proper ARIA labels, keyboard navigation, and screen reader support
- **Dark/Light Mode Ready** - CSS variables for easy theme switching

## 🔒 Security & Privacy

- **Row Level Security** - Database policies ensure users only access their own data
- **Secure Authentication** - Supabase handles secure user authentication
- **API Key Protection** - Environment variables keep API keys secure
- **Data Validation** - Input validation and sanitization throughout the app

## 🚀 Deployment

The app is ready for deployment on platforms like:
- Vercel
- Netlify  
- Railway
- Supabase Edge Functions

Make sure to set your environment variables in your deployment platform.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Bolt.new**