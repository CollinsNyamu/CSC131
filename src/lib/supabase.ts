import 'react-native-url-polyfill/auto'; // MUST BE AT THE VERY TOP
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pscxiosdaxdxirpeuluv.supabase.co'
const supabasePublishableKey = 'sb_publishable_eaPrN37MT15RKU-vuzoWOw_SmMgBugl'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})