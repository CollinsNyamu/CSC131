// index.tsx
// This is the initial root / first screen

import { globalStyles } from '@/components/globalStyles';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


// Main
export default function Index() {
  const router = useRouter();

  return(
    <>
      <View style={globalStyles.headerBackground}>
        <Text style={globalStyles.headerText}>
          Daily Tasks
        </Text>
        <Clock />
      </View>

      <TaskList />
    </>
  );
};


// Tasks
const Checkbox = () => {
  const [pressed, setPressed] = useState(true);

  return(
    <Pressable
      onPress={() => {
        setPressed(false);
      }}
    >
      <Image 
        source={pressed? require('../../assets/images/checkmark_empty.png') : require('../../assets/images/checkmark_filled.png')} 
        style={{ width: 50, height: 50, alignSelf: 'center' }}
      />
    </Pressable>
  );
};

type TaskProps = {
  task: string;
  value: number;
};

const Task = (props: TaskProps) => {
  return(
    <View style={homeStyles.taskBackground}>
      <Checkbox />
      <Text style={homeStyles.taskPoints}>
          {props.value}
      </Text>

      <Text style={homeStyles.taskText}>
        {props.task}
      </Text>

    </View>
  );
};

const TaskList = () => {
  return(
      <View style={globalStyles.mainBackground}>
        <Task 
          task='task 1'
          value={10}
        />
        <Task 
          task='task 2'
          value={20}
        />
        <Task 
          task='task 3 but with a very super long text description'
          value={30}
        />
        <Task 
          task='task 4'
          value={400}
        />
        <Task 
          task='task 5'
          value={5000}
        />
      </View>
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
const homeStyles = StyleSheet.create({
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