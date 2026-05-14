// src/app/index.tsx
//working
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { tasks } from "../data/tasks";

const getRandomTasks = (num: number) => {
  const allTasks: { task: string; value: number }[] = [];
  Object.keys(tasks).forEach((category) => {
    tasks[category as keyof typeof tasks].forEach((t: any) => {
      allTasks.push({ task: t.text, value: t.points });
    });
  });
  const shuffled = allTasks.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
};

export default function Index() {
  const router = useRouter();
  const [dailyTasks, setDailyTasks] = useState<{ task: string; value: number }[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const today = new Date().toDateString();
      const savedDate = await AsyncStorage.getItem("date");
      const savedTasks = await AsyncStorage.getItem("tasks");
      if (savedDate === today && savedTasks) {
        setDailyTasks(JSON.parse(savedTasks));
      } else {
        const newTasks = getRandomTasks(5);
        setDailyTasks(newTasks);
        await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
        await AsyncStorage.setItem("date", today);
      }
    };
    loadTasks();
  }, []);

  return (
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
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 10, backgroundColor: '#0f0f1a', padding: 16, justifyContent: 'center' }}>
        <Pressable onPress={() => router.push('/(tabs)/Home')}>
          <Text style={{ color: '#a78bfa' }}>Home</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/Leaderboard')}>
          <Text style={{ color: '#a78bfa' }}>Leaderboard</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/Profile')}>
          <Text style={{ color: '#a78bfa' }}>Profile</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/(tabs)/Shop')}>
          <Text style={{ color: '#a78bfa' }}>Shop</Text>
        </Pressable>
      </View>
    </>
  );
}

type TaskProps = { task: string; value: number };

const Task = (props: TaskProps) => (
  <View style={styles.taskBackground}>
    <Checkbox />
    <Text style={styles.taskPoints}>{props.value}</Text>
    <Text style={styles.taskText}>{props.task}</Text>
  </View>
);

const Checkbox = () => {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable onPress={() => setPressed(!pressed)}>
      <Image
        source={pressed ? require('../../assets/images/checkmark_filled.png') : require('../../assets/images/checkmark_empty.png')}
        style={{ width: 50, height: 50, alignSelf: 'center' }}
      />
    </Pressable>
  );
};

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
      setTimeLeft(prev => prev <= 1 ? getSecondsUntilMidnight() : prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <Text style={{ fontSize: 18, color: '#a78bfa', letterSpacing: 1 }}>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </Text>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#7c3aed',
  },
  headerText: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  mainBackground: {
    flex: 7,
    backgroundColor: '#0f0f1a',
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: 16,
    padding: 20,
  },
  taskBackground: {
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 16,
    width: '100%',
    padding: 14,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  taskPoints: {
    color: '#a78bfa',
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  taskText: {
    color: '#e2e8f0',
    fontSize: 16,
    flex: 1,
  }
});