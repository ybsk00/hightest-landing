-- =============================================
-- 하이스트 비뇨기과 2중 퍼널 데모 - Supabase SQL
-- =============================================

-- 1. 리드 수집 테이블
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  name TEXT,
  concern_type TEXT, -- 'condition', 'urination', 'prostate', 'health'
  source TEXT DEFAULT 'healthcare', -- 'healthcare' or 'medical'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 채팅 세션 테이블
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  area TEXT NOT NULL DEFAULT 'healthcare', -- 'healthcare' or 'medical'
  agent_type TEXT, -- 'h-closer', 'm-gyneco', 'm-penile', 'm-general'
  turn_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'converted'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 채팅 메시지 테이블
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  agent_used TEXT,
  cta_type TEXT, -- 'login', 'booking', 'demo'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 예약 요청 테이블
CREATE TABLE IF NOT EXISTS booking_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES chat_sessions(id),
  concern_type TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  contact_phone TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 사용자 프로필 테이블 (auth.users 확장)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  phone TEXT,
  birth_year INTEGER,
  gender TEXT,
  marketing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- Row Level Security (RLS) 정책
-- =============================================

-- leads 테이블 RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage leads" ON leads
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own lead" ON leads
  FOR SELECT USING (email = auth.email());

-- chat_sessions 테이블 RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create sessions" ON chat_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own sessions" ON chat_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- chat_messages 테이블 RLS
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" ON chat_messages
  FOR SELECT USING (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create messages" ON chat_messages
  FOR INSERT WITH CHECK (
    session_id IN (SELECT id FROM chat_sessions WHERE user_id = auth.uid())
  );

-- booking_requests 테이블 RLS
ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON booking_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create bookings" ON booking_requests
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings" ON booking_requests
  FOR UPDATE USING (user_id = auth.uid());

-- user_profiles 테이블 RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- =============================================
-- 인덱스 생성
-- =============================================

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_user_id ON booking_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_status ON booking_requests(status);

-- =============================================
-- 트리거: updated_at 자동 업데이트
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at
  BEFORE UPDATE ON chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON booking_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 완료! Supabase SQL Editor에서 실행하세요.
-- =============================================
