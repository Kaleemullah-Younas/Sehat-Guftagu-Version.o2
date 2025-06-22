<div align="center">

# Sehat Guftagu (صحت گفتگو)

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue?style=for-the-badge&logo=python)](https://www.python.org/)
[![Streamlit](https://img.shields.io/badge/Streamlit-1.42.0-FF4B4B?style=for-the-badge&logo=streamlit)](https://streamlit.io/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-96F?style=for-the-badge&logo=supabase)](https://supabase.io/)
[![Groq](https://img.shields.io/badge/Groq-AI-00A4DC?style=for-the-badge)](https://groq.com/)

میڈیکل رپورٹ کا تجزیہ کر کے رہنمائی کرنے والا ڈاکٹر

</div>

## 🌟 Introduction

Sehat Guftagu is an innovative AI-powered medical report analysis system that helps users understand their medical reports through interactive conversations. The application provides detailed insights, explanations, and recommendations based on medical report data, making healthcare information more accessible and understandable.

## 🎯 Purpose & Motivation

- Bridge the gap between complex medical reports and patient understanding
- Provide instant, AI-powered analysis of medical reports
- Make healthcare information more accessible in Urdu language
- Assist healthcare providers in explaining reports to patients
- Reduce anxiety and confusion around medical test results

## 🛠️ Tech Stack

- **Frontend**: Streamlit (1.42.0+)
- **Backend**: Python 3.9+
- **Database**: Supabase
- **AI/ML**: Groq API
- **PDF Processing**: PDFPlumber
- **Translation**: Google Translate API
- **Authentication**: Supabase Auth

## ✨ Features

- 🔒 Secure user authentication
- 📊 Medical report analysis
- 🔄 Multi-language support
- 📱 Responsive UI
- 💾 Session management
- 📝 Chat history
- 🔍 PDF text extraction
- 🤖 AI-powered insights

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- Git
- Supabase account
- Groq API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kaleemullah-Younas/sehat-guftagu.git
cd sehat-guftagu
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.streamlit/secrets.toml` file with your credentials:
```toml
SUPABASE_URL = "your_supabase_url"
SUPABASE_KEY = "your_supabase_key"
GROQ_API_KEY = "your_groq_api_key"
```

5. Run the application:
```bash
streamlit run src/main.py
```

## 🔧 Configuration

The application can be configured through the following files:
- `src/config/app_config.py`: Application settings
- `src/config/prompts.py`: AI system prompts
- `.streamlit/config.toml`: Streamlit configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📺 Demo Youtube Video link 
[YOUTUBE LINK!](https://youtu.be/PiPIYYqmuAo)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## 🙏 Acknowledgments

- Streamlit team for the amazing framework
- Supabase for the backend infrastructure
- Groq for the powerful AI capabilities
- All contributors who help improve this project

---

<div align="center">
Made with ❤️ for better healthcare understanding
</div>
