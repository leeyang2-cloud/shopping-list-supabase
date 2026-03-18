import { ENV } from './env.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase 클라이언트 초기화
// 주의: 브라우저 환경에서는 환경 변수를 직접 읽을 수 없으므로 env.js를 통해 주입합니다.
export const supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_ANON_KEY);
