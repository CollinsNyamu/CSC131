

//Temp. add Log Out button to home screen till nav done

import { globalStyles } from '@/components/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { Clock } from '../../../components/clock';
import { Task } from '../../../components/task';
import { tasks } from "../../../data/tasks";
import { supabase } from '../../../supabase';



// Home screen
export default function Home({ userId, email }: { userId: string; email?: string }) {
  
  useEffect(() => {
    if (userId) getProfile(userId)
  }, [userId])

  getProfile(userId);

  
  useEffect(() => { loadTasks(userId) }, []);


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
  
  const router = useRouter();

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



// Tasks
type TaskProps = {
  task: string;
  value: number;
  userId: string;
};

const Task = (props: TaskProps) => {
  return(
  <View style={homeStyles.taskBackground}>
    <Checkbox value={props.value} userId={props.userId}/>
    <Text style={homeStyles.taskPoints}>
        {props.value}
    </Text>

    <Text style={homeStyles.taskText}>
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
          ? require('../../../../assets/images/checkmark_filled.png') 
          : require('../../../../assets/images/checkmark_empty.png')} 
        style={{ width: 50, height: 50, alignSelf: 'center' }}
      />
    </Pressable>
  );
};

// Pick a number of random tasks from all categories
function getRandomTasks(num: number) {
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


const [dailyTasks, setDailyTasks] = useState<
  { task: string; value: number; difficulty: string }[]
>([]);

async function loadTasks(userId: string) {
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



// Style sheet for home page
const homeStyles = StyleSheet.create({
  signoutButton:{
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
  }
});