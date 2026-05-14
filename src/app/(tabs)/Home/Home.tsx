import { globalStyles } from '@/components/globalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Task } from '../../../components/task';
import { tasks } from "../../../data/tasks";

const getRandomTasks = (num: number) => {
  const allTasks: { task: string; value: number; difficulty: string; category: string }[] = [];
  Object.keys(tasks).forEach((category) => {
    tasks[category as keyof typeof tasks].forEach((t) => {
      allTasks.push({
        task: t.difficulty === "hard" ? "🔥 " + t.text : t.text,
        value: t.points,
        difficulty: t.difficulty,
        category: category,
      });
    });
  });
  const hardTasks = allTasks.filter(t => t.difficulty === "hard");
  const normalTasks = allTasks.filter(t => t.difficulty !== "hard");
  return [
    hardTasks[Math.floor(Math.random() * hardTasks.length)],
    ...normalTasks.sort(() => 0.5 - Math.random()).slice(0, num - 1)
  ];
};

export default function Home({ userId }: { userId: string }) {
  const [dailyTasks, setDailyTasks] = useState<{ task: string; value: number; difficulty: string; category: string }[]>([]);
  const [rerollOptions, setRerollOptions] = useState<any[]>([]);
  const [rerollIndex, setRerollIndex] = useState<number | null>(null);
  const [rerollCategory, setRerollCategory] = useState<string | null>(null);

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

  const handleReroll = (index: number) => {
    const current = dailyTasks[index];
    if (!current) return;
    const categoryTasks = tasks[current.category as keyof typeof tasks];
    if (!categoryTasks) return;
    const options = [...categoryTasks].sort(() => 0.5 - Math.random()).slice(0, 3);
    setRerollOptions(options);
    setRerollIndex(index);
    setRerollCategory(current.category);
  };

  const handleSelectOption = (option: any) => {
    if (rerollIndex === null || rerollCategory === null) return;
    setDailyTasks(prev => {
      const updated = [...prev];
      updated[rerollIndex] = {
        task: option.difficulty === "hard" ? "🔥 " + option.text : option.text,
        value: option.points,
        difficulty: option.difficulty,
        category: rerollCategory!
      };
      AsyncStorage.setItem(`tasks-${userId}`, JSON.stringify(updated));
      return updated;
    });
    setRerollOptions([]);
    setRerollIndex(null);
    setRerollCategory(null);
  };

  return (
    <>
      <View style={globalStyles.headerBackground}>
        <Text style={globalStyles.headerText}>Daily Tasks</Text>
        <Clock />
      </View>

      <ScrollView style={{ backgroundColor: '#0f0f1a', padding: 20 }}>
        {dailyTasks.map((t, index) => (
          <Task key={index} task={t.task} value={t.value} userId={userId ?? ''} onReroll={() => handleReroll(index)} />
        ))}

        {rerollOptions.length > 0 && (
          <View style={rerollStyles.rerollContainer}>
            <Text style={rerollStyles.rerollTitle}>Choose a new task:</Text>
            {rerollOptions.map((opt, i) => (
              <Pressable
                key={i}
                onPress={() => handleSelectOption(opt)}
                style={rerollStyles.rerollOption}
              >
                <Text style={rerollStyles.rerollText}>
                  {opt.difficulty === "hard" ? "🔥 " : ""}{opt.text}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

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

const rerollStyles = StyleSheet.create({
  rerollContainer: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  rerollTitle: {
    color: '#a78bfa',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  rerollOption: {
    padding: 12,
    backgroundColor: '#0f0f1a',
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderRadius: 8,
    marginTop: 8,
  },
  rerollText: {
    color: '#e2e8f0',
    fontSize: 15,
  },
});