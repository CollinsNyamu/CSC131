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
    const timer = setInterval(() => {
      setTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  return(
    <Text>
      {time}
    </Text>
  );
};

// Style sheet
const styles = StyleSheet.create({
  // header
  headerBackground:{
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText:{
    fontSize: 40
  },
  // main background
  mainBackground:{
    flex: 7,
    backgroundColor: 'turquoise',
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: 20,
    padding: 20
  },
  // tasks
  taskBackground:{
    alignItems: 'center',
    backgroundColor: 'lightgreen',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 20,
    width: '90%',
    padding: 10,
    flexWrap: 'wrap'
  },
  taskPoints:{
    color: 'purple',
    fontSize: 20,
    justifyContent: 'flex-end'
  },
  taskText:{
    justifyContent: 'center'
  }
});

// Clock - Countdown to midnight
function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

const Clock = () => {
  const [timeLeft, setTimeLeft] = useState(getSecondsUntilMidnight());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // TODO: trigger task reset here later
          return getSecondsUntilMidnight();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');

  return (
    <Text style={{ fontSize: 20 }}>
      {hh}:{mm}:{ss}
    </Text>
  );
};