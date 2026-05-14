import Auth from '@/components/Auth';
import { supabase } from '@/supabase';
import { Session } from '@supabase/supabase-js';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session === undefined) return null;

  if (!session) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Auth />
      </View>
    );
  }

  return <Slot/>;
}