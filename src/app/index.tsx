// src/app/index.tsx
// This is the true root route — maps to URL "/"

import { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Auth from '../components/Auth'
import { supabase } from '../supabase'; // adjust path to match your structure
import Home from './(tabs)/Home/index'; // point to Home.tsx inside its folder
import Leaderboard from './(tabs)/Leaderboard';
import Profile from './(tabs)/Profile';

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Don't render anything while we're checking for a session
  // This prevents a brief flash of the Auth screen on startup
  if (session === undefined) return null

  return (
    <View style={{ flex: 1 }}>
      {session?.user
        ? <Home userId={session.user.id} email={session.user.email} />
        : <Auth />
      }
    </View>
  )
}