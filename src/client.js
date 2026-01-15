import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://cehikxpxvpzemdcveikk.supabase.co'
export const SUPABASE_KEY = 'sb_publishable_b-duExClrd5b-klHIdrTRA_Y0Heix8a'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
