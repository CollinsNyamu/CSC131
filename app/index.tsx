import { Image } from 'expo-image';
import React, { useEffect, useState} from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function Index() {
  return (
    <>
      <View 
      style={styles.headerBackground}
      >
        <Text
        style={styles.headerText}
        >
          Daily Tasks:
        </Text>
        <Clock />
      </View>

      <View
      style={{
        flex: 7,
        backgroundColor: 'turquoise',
        justifyContent: 'flex-start',
        alignItems: 'center',
        rowGap: 20,
        padding: 20
      }}
      >
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
}

type TaskProps = {
  task: string;
  value: number;
}

const Task = (props: TaskProps) => {
  return(
  <View
    style={{
      alignItems: 'center',
      backgroundColor: 'lightgreen',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      columnGap: 20,
      width: '90%',
      padding: 10,
      flexWrap: 'wrap'
    }}
  >
    <Checkbox />
    <Text
      style={{
        color: 'purple',
        fontSize: 20,
        justifyContent: 'flex-end'
      }}
    >
        {props.value}
    </Text>

    <Text
    style={{
      justifyContent: 'center'
    }}
    >
      {props.task}
    </Text>

    
  </View>
  )
}


const Checkbox = () => {
  const [pressed, setPressed] = useState(true);

  return(
    <Pressable
      onPress={() => {
        setPressed(false);
      }}
    >
      <Image 
        source={pressed? require('@/assets/images/icon.png') : require('@/assets/images/favicon.png')} 
        style={{ width: 50, height: 50, alignSelf: 'center' }}
      />
    </Pressable>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date().toTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toTimeString());
    }, 1000);

    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  return(
    <Text>
      {time}
    </Text>
  );
};

const styles = StyleSheet.create({ 
  headerBackground:{
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText:{
    fontSize: 40
  }

  
});