import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { supabase } from '../supabase';

type CheckboxProps = {
  value: number;
  userId: string;
};

export const Checkbox = ({ value, userId }: CheckboxProps) => {
  const [pressed, setPressed] = useState(false);

  const handlePress = async () => {
    if (!pressed) {
      const { error } = await supabase.rpc('add_points', {
        user_id: userId,
        points_to_add: value,
      });
      if (error) {
        Alert.alert('Error adding points', error.message);
        return;
      }
    } else {
      const { error } = await supabase.rpc('add_points', {
        user_id: userId,
        points_to_add: -value,
      });
      if (error) {
        Alert.alert('Error removing points', error.message);
        return;
      }
    }
    setPressed(!pressed);
  };

  return (
    <Pressable onPress={handlePress}>
      <Image
        source={pressed ? require('../../assets/images/checkmark_filled.png') : require('../../assets/images/checkmark_empty.png')}
        style={{ width: 50, height: 50, alignSelf: 'center' }}
      />
    </Pressable>
  );
};