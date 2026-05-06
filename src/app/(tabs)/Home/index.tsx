// index.tsx
// This is the initial root / first screen

//Temp. add Log Out button to home screen till nav done

import { globalStyles } from '@/components/globalStyles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Button, Alert } from 'react-native';
import { tasks } from "../../../data/tasks";
import { supabase } from '../../../supabase'


// picks 5 random tasks from all categories

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const getRandomTasks = (num: number, userId: string) => {
  const allTasks: { task: string; value: number }[] = [];

  const today = new Date();
  const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();


  const userSeed = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = dateSeed + userSeed;
  let counter = 0; // ← single counter across all categories

  Object.keys(tasks).forEach((category) => {
    tasks[category as keyof typeof tasks].forEach((t) => {
      allTasks.push({
        task: t,
        value: Math.floor(seededRandom(seed + counter) * 50) + 10, // ← use counter
      });
      counter++; // ← increment after each task
    });
  });

  const shuffled = allTasks.sort((a, b) => 
    seededRandom(seed + allTasks.indexOf(a)) - seededRandom(seed + allTasks.indexOf(b))
  );

  return shuffled.slice(0, num);
};

// Main
export default function Home({ userId, email }: { userId: string; email?: string }) {
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [website, setWebsite] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  

  useEffect(() => {
    if (userId) getProfile()
  }, [userId])

  async function getProfile() {
    try {
      setLoading(true)

      let { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', userId)
        .single()
      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    username,
    website,
    avatar_url,
  }: {
    username: string
    website: string
    avatar_url: string
  }) {
    try {
      setLoading(true)

      const updates = {
        id: userId,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates)

      if (error) {
        throw error
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }
  const router = useRouter();

  const [dailyTasks, setDailyTasks] = useState<
    { task: string; value: number }[]
  >([]);

  useEffect(() => {
    const generated = getRandomTasks(5,userId);
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
          <Task key={index} task={t.task} value={t.value} userId={userId} />
        ))}
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
  
    </>
    
  );
}



// Tasks
type TaskProps = {
  task: string;
  value: number;
  userId: string;
};

const Task = (props: TaskProps) => {
  return(
  <View style={taskStyles.taskBackground}>
    <Checkbox value={props.value} userId={props.userId}/>
    <Text style={taskStyles.taskPoints}>
        {props.value}
    </Text>

    <Text style={taskStyles.taskText}>
      {props.task}
    </Text>

  </View>
  );
};

type CheckboxProps = {
  value: number;
  userId: string;
};

const Checkbox = ({ value, userId }: CheckboxProps) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = async () => {
    if (!pressed) {
      // Checking — add points
      console.log('Sending', `userId: ${userId}, points: ${value}`)
      const { error } = await supabase.rpc('add_points', {
        user_id: userId,
        points_to_add: value,
      });
      if (error) {
        Alert.alert('Error adding points', error.message);
        return;
      }
    } else {
      // Unchecking — remove points
      const { error } = await supabase.rpc('add_points', {
        user_id: userId,
        points_to_add: -value,  // ← negative value subtracts
      });
      if (error) {
        Alert.alert('Error removing points', error.message);
        return;
      }
    }
    setPressed(!pressed);
  };

  return(
    <Pressable onPress={handlePress}>
      <Image 
        source={
          pressed
          ? require('./checkmark_filled.png') 
          : require('./checkmark_empty.png')} 
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
  },


})

const styles = StyleSheet.create({
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
      }
});