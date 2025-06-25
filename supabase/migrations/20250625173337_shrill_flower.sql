/*
  # Initial Database Schema for Sehat Guftagu

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth.users
      - `email` (text, unique, not null)
      - `name` (text, nullable)
      - `created_at` (timestamp with timezone, default now)
    
    - `chat_sessions`
      - `id` (uuid, primary key, auto-generated)
      - `user_id` (uuid, foreign key to users)
      - `title` (text, nullable)
      - `created_at` (timestamp with timezone, default now)
    
    - `chat_messages`
      - `id` (uuid, primary key, auto-generated)
      - `session_id` (uuid, foreign key to chat_sessions)
      - `content` (text, nullable)
      - `role` (text, nullable) - 'user' or 'assistant'
      - `created_at` (timestamp with timezone, default now)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Users can only access their own sessions and messages

  3. Indexes
    - Add performance indexes for common queries
    - Foreign key indexes for joins
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text,
  created_at timestamptz DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  content text,
  role text CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for chat_sessions table
CREATE POLICY "Users can read own sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for chat_messages table
CREATE POLICY "Users can read own messages" ON chat_messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM chat_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can create own messages" ON chat_messages
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM chat_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can update own messages" ON chat_messages
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM chat_sessions WHERE id = session_id
    )
  );

CREATE POLICY "Users can delete own messages" ON chat_messages
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM chat_sessions WHERE id = session_id
    )
  );