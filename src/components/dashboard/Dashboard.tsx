import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { FileUpload } from '@/components/analysis/FileUpload'
import { PatientForm } from '@/components/analysis/PatientForm'
import { AnalysisResults } from '@/components/analysis/AnalysisResults'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateEnglishAnalysis, generateUrduAudioScript, generateAudioFromText } from '@/lib/api'
import { Stethoscope, FileText, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
}

export function Dashboard() {
  const { user } = useAuth()
  const [currentSessionId, setCurrentSessionId] = useState<string>()
  const [selectedFile, setSelectedFile] = useState<File>()
  const [extractedText, setExtractedText] = useState<string>()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [englishAnalysis, setEnglishAnalysis] = useState<string>()
  const [audioUrl, setAudioUrl] = useState<string>()

  useEffect(() => {
    if (currentSessionId) {
      fetchMessages()
    }
  }, [currentSessionId])

  const createNewSession = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: `Analysis - ${new Date().toLocaleDateString()}`
        })
        .select()
        .single()

      if (error) throw error

      setCurrentSessionId(data.id)
      setMessages([])
      setSelectedFile(undefined)
      setExtractedText(undefined)
      setEnglishAnalysis(undefined)
      setAudioUrl(undefined)
      toast.success('New session created')
    } catch (error) {
      console.error('Error creating session:', error)
      toast.error('Failed to create new session')
    }
  }

  const fetchMessages = async () => {
    if (!currentSessionId) return

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', currentSessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const saveMessage = async (content: string, role: 'user' | 'assistant') => {
    if (!currentSessionId) return

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSessionId,
          content,
          role,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error saving message:', error)
      throw error
    }
  }

  const handleFileSelect = (file: File, text: string) => {
    setSelectedFile(file)
    setExtractedText(text)
  }

  const handleFileClear = () => {
    setSelectedFile(undefined)
    setExtractedText(undefined)
  }

  const handleAnalysisSubmit = async (patientData: any) => {
    if (!extractedText || !currentSessionId) return

    setAnalysisLoading(true)
    setEnglishAnalysis(undefined)
    setAudioUrl(undefined)

    try {
      // Save user message
      await saveMessage(
        `Analyzing report for patient: ${patientData.name}, Age: ${patientData.age}, Gender: ${patientData.gender}`,
        'user'
      )

      const reportData = {
        patient_name: patientData.name,
        age: patientData.age,
        gender: patientData.gender,
        report: extractedText
      }

      // Generate English analysis
      const englishResult = await generateEnglishAnalysis(reportData)
      if (englishResult.success && englishResult.content) {
        setEnglishAnalysis(englishResult.content)
        await saveMessage(englishResult.content, 'assistant')
      }

      // Generate Urdu audio script
      const urduResult = await generateUrduAudioScript(reportData)
      if (urduResult.success && urduResult.content) {
        // Generate audio from Urdu script
        const audioResult = await generateAudioFromText(urduResult.content)
        if (audioResult.success && audioResult.audioUrl) {
          setAudioUrl(audioResult.audioUrl)
        }
      }

      toast.success('Analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze report')
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId)
  }

  // Initialize with a new session if none exists
  useEffect(() => {
    if (user && !currentSessionId) {
      createNewSession()
    }
  }, [user])

  if (!currentSessionId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Stethoscope className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Creating your session...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={createNewSession}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Stethoscope className="w-8 h-8" />
                  <div>
                    <h1 className="text-2xl font-bold">🩺 Sehat Guftagu</h1>
                    <p className="text-blue-100 text-sm">میڈیکل رپورٹ کا تجزیہ کر کے رہنمائی کرنے والا ڈاکٹر</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-100">
                  Upload your medical report and get comprehensive analysis with personalized recommendations in both English and Urdu.
                </p>
              </CardContent>
            </Card>

            {/* Chat History */}
            {messages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <span>Session History</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-50 border-l-4 border-blue-500'
                          : 'bg-green-50 border-l-4 border-green-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-gray-600">
                          {message.role === 'user' ? '👤 You' : '🤖 AI Doctor'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-gray-800 whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* File Upload */}
            <FileUpload
              onFileSelect={handleFileSelect}
              onClear={handleFileClear}
              selectedFile={selectedFile}
            />

            {/* Patient Form */}
            {selectedFile && extractedText && (
              <PatientForm
                onSubmit={handleAnalysisSubmit}
                loading={analysisLoading}
              />
            )}

            {/* Analysis Results */}
            <AnalysisResults
              englishAnalysis={englishAnalysis}
              audioUrl={audioUrl}
              loading={analysisLoading}
            />
          </div>
        </main>
      </div>
    </div>
  )
}