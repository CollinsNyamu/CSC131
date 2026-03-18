// index.tsx
// This is the initial root / first screen

import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';


// Main
export default function Index() {
  return(
    <>
      <View style={styles.headerBackground}>
        <Text style={styles.headerText}>
          Daily Tasks:
        </Text>
        <Clock />
      </View>

      <View style={styles.mainBackground}>
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
    </>
  );
};


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
  const [pressed, setPressed] = useState(true);

  return(
    <Pressable
      onPress={() => {
        setPressed(false);
      }}
    >
      <Image 
        source={pressed? require('@/assets/images/checkmark_empty.png') : require('@/assets/images/checkmark_filled.png')} 
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