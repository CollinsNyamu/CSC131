// src/app/components/CountdownTimer.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

type Props = {
  onReset?: () => void;
};

export default function CountdownTimer({ onReset }: Props) {
  const [timeLeft, setTimeLeft] = useState(getSecondsUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (onReset) onReset();
          return getSecondsUntilMidnight(); // resets to ~24:00:00
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>New tasks in</Text>
      <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 16 },
  label: { fontSize: 14, color: '#888', marginBottom: 4 },
  timer: { fontSize: 48, fontWeight: 'bold', color: '#333' },
});