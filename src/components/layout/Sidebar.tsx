import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, MessageSquare, Trash2, Calendar } from 'lucide-react'
import { formatDate, truncateText } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ChatSession {
  id: string
  title: string
  created_at: string
}

interface SidebarProps {
  currentSessionId?: string
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
}

export function Sidebar({ currentSessionId, onSessionSelect, onNewSession }: SidebarProps) {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchSessions()
    }
  }, [user])

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast.error('Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      // Delete messages first
      await supabase
        .from('chat_messages')
        .delete()
        .eq('session_id', sessionId)

      // Then delete session
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error

      setSessions(prev => prev.filter(s => s.id !== sessionId))
      toast.success('Session deleted')

      // If current session was deleted, create a new one
      if (currentSessionId === sessionId) {
        onNewSession()
      }
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to delete session')
    }
  }

  return (
    <div className="w-80 bg-gray-50 border-r h-full flex flex-col">
      <div className="p-4 border-b bg-white">
        <Button 
          onClick={onNewSession}
          className="w-full"
          variant="medical"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Analysis Session
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Sessions</h3>
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No sessions yet</p>
            <p className="text-xs">Create your first analysis session</p>
          </div>
        ) : (
          sessions.map((session) => (
            <Card
              key={session.id}
              className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                currentSessionId === session.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:bg-white'
              }`}
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {truncateText(session.title || 'Untitled Session', 25)}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(session.created_at)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session.id)
                  }}
                  className="text-gray-400 hover:text-red-500 p-1 h-auto"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="text-xs text-gray-500 text-center">
          <p>Daily Analysis Limit</p>
          <p className="font-medium text-blue-600">12/15 remaining</p>
        </div>
      </div>
    </div>
  )
}