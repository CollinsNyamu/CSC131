// index.tsx
// This is the initial root / first screen

import { globalStyles } from '@/components/globalStyles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tasks } from "../data/tasks";

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
  const router = useRouter();

  const [dailyTasks, setDailyTasks] = useState<
    { task: string; value: number }[]
  >([]);

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