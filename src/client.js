import { createClient } from '@supabase/supabase-js';

const URL = 'https://cehikxpxvpzemdcveikk.supabase.co';
const API_KEY = 'sb_publishable_b-duExClrd5b-klHIdrTRA_Y0Heix8a';

export const supabase = createClient(URL, API_KEY);
