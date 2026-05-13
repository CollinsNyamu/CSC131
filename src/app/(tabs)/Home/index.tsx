

//Temp. add Log Out button to home screen till nav done

import { globalStyles } from '@/components/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Task } from '../../../components/task';
import { tasks } from "../../../data/tasks";
import { supabase } from '../../../supabase';



// Home screen
export default function Home({ userId, email }: { userId: string; email?: string }) {
  
  useEffect(() => {
    if (userId) getProfile(userId)
  }, [userId])

  getProfile(userId);

  const [dailyTasks, setDailyTasks] = useState<
  { task: string; value: number; difficulty: string }[]
>([]);

  useEffect(() => {
  const loadTasks = async () => {
    const today = new Date().toDateString();

    const savedDate = await AsyncStorage.getItem(`date-${userId}`);
    const savedTasks = await AsyncStorage.getItem(`tasks-${userId}`);

    if (savedDate === today && savedTasks) {
      setDailyTasks(JSON.parse(savedTasks));
    } else {
      const newTasks = getRandomTasks(5);
      setDailyTasks(newTasks);

      await AsyncStorage.setItem(`tasks-${userId}`, JSON.stringify(newTasks));
      await AsyncStorage.setItem(`date-${userId}`, today);
    }
  };

  loadTasks();
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
      <View style={homeStyles.signoutButton}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
  
    </>
    
  );
}

// Profile
const [loading, setLoading] = useState(true)
const [username, setUsername] = useState('')
const [website, setWebsite] = useState('')
const [avatarUrl, setAvatarUrl] = useState('')
  
async function getProfile(userId: string) {
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


// Pick a number of random tasks from all categories
const getRandomTasks = (num: number) => {
  const allTasks: { task: string; value: number; difficulty: string }[] = [];

  Object.keys(tasks).forEach((category) => {
    tasks[category as keyof typeof tasks].forEach((t) => {
      allTasks.push({
        task: t.difficulty === "hard" ? "🔥 " + t.text : t.text,
        value: t.points,
        difficulty: t.difficulty,
      });
    });
  });
  const hardTasks = allTasks.filter(t => t.difficulty === "hard");
  const normalTasks = allTasks.filter(t => t.difficulty !== "hard");

  const selected = [
  hardTasks[Math.floor(Math.random() * hardTasks.length)],
  ...normalTasks.sort(() => 0.5 - Math.random()).slice(0, num - 1)
  ];

return selected;
};



// Style sheet for home page
const homeStyles = StyleSheet.create({
  signoutButton:{
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
  }
});