import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

interface FileUploadProps {
  onFileSelect: (file: File, text: string) => void
  onClear: () => void
  selectedFile?: File
}

export function FileUpload({ onFileSelect, onClear, selectedFile }: FileUploadProps) {
  const [extracting, setExtracting] = useState(false)

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          // For demo purposes, we'll simulate PDF text extraction
          // In a real app, you'd use a library like pdf-parse or pdf.js
          const sampleText = `BLOOD TEST REPORT
Date: ${new Date().toLocaleDateString()}
Laboratory: HealthCare Diagnostics

COMPLETE BLOOD COUNT (CBC)
Hemoglobin: 13.5 g/dL (Reference: 12.0-15.5)
White Blood Cells: 7,500 /µL (Reference: 4,000-11,000)
Platelets: 250,000 /µL (Reference: 150,000-450,000)
Red Blood Cells: 4.8 M/µL (Reference: 4.0-5.2)
Hematocrit: 41% (Reference: 36-46%)

METABOLIC PANEL
Glucose (Fasting): 95 mg/dL (Reference: 70-100)
Creatinine: 0.9 mg/dL (Reference: 0.6-1.2)
BUN: 15 mg/dL (Reference: 7-20)

LIPID PROFILE
Total Cholesterol: 180 mg/dL (Reference: <200)
HDL Cholesterol: 55 mg/dL (Reference: >40)
LDL Cholesterol: 100 mg/dL (Reference: <100)
Triglycerides: 150 mg/dL (Reference: <150)`
          
          resolve(sampleText)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsArrayBuffer(file)
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      toast.error('File size must be less than 20MB')
      return
    }

    setExtracting(true)
    try {
      const text = await extractTextFromPDF(file)
      onFileSelect(file, text)
      toast.success('PDF text extracted successfully')
    } catch (error) {
      toast.error('Failed to extract text from PDF')
      console.error('PDF extraction error:', error)
    } finally {
      setExtracting(false)
    }
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: extracting
  })

  if (selectedFile) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-gray-500 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400",
          extracting && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            {extracting ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900">
              {extracting ? 'Extracting text...' : 'Upload Medical Report'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {isDragActive 
                ? 'Drop your PDF file here' 
                : 'Drag & drop a PDF file here, or click to select'
              }
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <AlertCircle className="w-4 h-4" />
            <span>Maximum file size: 20MB</span>
          </div>
        </div>
      </div>
    </Card>
  )
}