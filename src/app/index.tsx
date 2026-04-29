// src/app/index.tsx
// This is the true root route — maps to URL "/"

import { useState, useEffect } from 'react'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { supabase } from '../supabase'  // adjust path to match your structure
import Auth from '../components/Auth'
import Home from './(tabs)/Home/Home'  // point to Home.tsx inside its folder

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    const generated = getRandomTasks(5);
    setDailyTasks(generated);
  }, []);


  return(
    <>
      <View style={globalStyles.headerBackground}>
        <Text style={globalStyles.headerText}>
          Daily Tasks
        </Text>
        <Clock />
      </View>

      <View style={globalStyles.mainBackground}>
        {dailyTasks.map((t, index) => (
          <Task key={index} task={t.task} value={t.value} />
        ))}
      </View>
    </>
  );
}



// Tasks
type TaskProps = {
  task: string;
  value: number;
};

const Task = (props: TaskProps) => {
  return(
  <View style={taskStyles.taskBackground}>
    <Checkbox />
    <Text style={taskStyles.taskPoints}>
        {props.value}
    </Text>

    <Text style={taskStyles.taskText}>
      {props.task}
    </Text>

  </View>
  );
};

const Checkbox = () => {
  const [pressed, setPressed] = useState(false);

  return(
    <Pressable
      onPress={() => {
        setPressed(!pressed);
      }}
    >
      <Image 
        source={
          pressed
          ? require('../../assets/images/checkmark_filled.png') 
          : require('../../assets/images/checkmark_empty.png')} 
        style={{ width: 50, height: 50, alignSelf: 'center' }}
      />
    </Pressable>
  );
};

// Clock
const Clock = () => {
  const [time, setTime] = useState(new Date().toTimeString());
  
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

// Style sheet for home page
const taskStyles = StyleSheet.create({
  // tasks
  taskBackground:{
    alignItems: 'center',
    backgroundColor: '#6096ba',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 20,
    width: '90%',
    padding: 10,
    flexWrap: 'wrap'
  },
  taskPoints:{
    color: '#274c77',
    fontSize: 20,
    justifyContent: 'flex-end'
  },
  taskText:{
    color: '#8b8c89',
    justifyContent: 'center'
  }
});
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