// index.tsx
// This is the initial root / first screen

import { globalStyles } from '@/components/globalStyles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tasks } from "../data/tasks";
import { registerRootComponent } from 'expo';



import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import Account from '../app/Home'

export default function Index() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getClaims().then(({ data }) => {
      if (data?.claims) {
        setUserId(data.claims.sub)
        setEmail(data.claims.email)
      }
    })
  
    supabase.auth.onAuthStateChange(async (_event, _session) => {
      const { data } = await supabase.auth.getClaims()
      if (data?.claims) {
        setUserId(data.claims.sub)
        setEmail(data.claims.email)
      } else {
        setUserId(null)
        setEmail(undefined)
      }
    })
  }, [])

  return (
    <View>
      {userId ? <Account key={userId} userId={userId} email={email} /> : <Auth />}
    </View>
  )
}