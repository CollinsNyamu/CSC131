import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import Home from '../app/(tabs)/Home/Home';
import Leaderboard from '../app/(tabs)/Leaderboard';
import Profile from '../app/(tabs)/Profile';
import Shop from '../app/(tabs)/Shop';
import { supabase } from '../supabase';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const userId = session?.user?.id ?? '';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0f0f1a', borderTopColor: '#7c3aed' },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home">{() => <Home userId={userId} />}</Tab.Screen>
      <Tab.Screen name="Leaderboard" component={Leaderboard} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}