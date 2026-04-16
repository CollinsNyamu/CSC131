// index.tsx
// This is the initial root / first screen

import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tasks } from "../data/tasks";
import AsyncStorage from '@react-native-async-storage/async-storage';

// picks 5 random tasks from all categories
const getRandomTasks = (num: number) => {
  const allTasks: { task: string; value: number }[] = [];

  Object.keys(tasks).forEach((category) => {
    tasks[category as keyof typeof tasks].forEach((t) => {
      allTasks.push({
        task: t,
        value: Math.floor(Math.random() * 50) + 10,
      });
    });
  });

  const shuffled = allTasks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

// Main
export default function Index() {
  const [dailyTasks, setDailyTasks] = useState<
    { task: string; value: number }[]
  >([]);

  useEffect(() => {
  const loadTasks = async () => {
    const today = new Date().toDateString();

    const savedDate = await AsyncStorage.getItem("date");
    const savedTasks = await AsyncStorage.getItem("tasks");

    if (savedDate === today && savedTasks) {
      // same day → use saved tasks
      setDailyTasks(JSON.parse(savedTasks));
    } else {
      // new day → generate new tasks
      const newTasks = getRandomTasks(5);
      setDailyTasks(newTasks);

      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
      await AsyncStorage.setItem("date", today);
    }
  };

  loadTasks();
}, []);


  return(
   <>
      <View style={styles.headerBackground}>
        <Text style={styles.headerText}>Daily Tasks:</Text>
        <Clock />
      </View>

      <View style={styles.mainBackground}>
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
  <View style={styles.taskBackground}>
    <Checkbox />
    <Text style={styles.taskPoints}>
        {props.value}
    </Text>

    <Text style={styles.taskText}>
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
          ? require('@/assets/images/checkmark_filled.png') 
          : require('@/assets/images/checkmark_empty.png')} 
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