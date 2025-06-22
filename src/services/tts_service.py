import requests
import streamlit as st
from googletrans import Translator
import io

class TTSService:
    def __init__(self):
        self.translator = Translator()
        self.tts_url = "https://api.upliftai.org/v1/synthesis/text-to-speech"
        # Get API key from Streamlit secrets
        self.headers = {
            "Authorization": f"Bearer {st.secrets['UPLIFTAI_API_KEY']}",
            "Content-Type": "application/json"
        }
    
    def translate_to_urdu(self, text):
        """Translate English text to Urdu"""
        try:
            translation = self.translator.translate(text, dest='ur')
            return translation.text
        except Exception as e:
            st.error(f"Translation error: {str(e)}")
            return None

    def generate_speech(self, urdu_text):
        """Generate speech from Urdu text using UpliftAI API"""
        if not urdu_text:
            st.error("No text provided for speech generation")
            return None

        try:
            payload = {
                "voiceId": "v_8eelc901",
                "text": urdu_text,
                "outputFormat": "MP3_22050_128"
            }
            
            response = requests.post(self.tts_url, json=payload, headers=self.headers)
            response.raise_for_status()  # Raise exception for non-200 status codes
            
            # Convert response content to BytesIO for Streamlit audio playback
            audio_data = io.BytesIO(response.content)
            audio_data.seek(0)  # Reset buffer position to start
            return audio_data

        except requests.exceptions.RequestException as e:
            st.error(f"API request failed: {str(e)}")
            return None
        except Exception as e:
            st.error(f"Speech generation error: {str(e)}")
            return None