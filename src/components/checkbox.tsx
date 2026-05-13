import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { supabase } from '../supabase';

type CheckboxProps = {
  value: number;
  userId: string;
};

export const Checkbox = ({ value, userId }: CheckboxProps) => {
  return(
    <Pressable onPress={handlePress}>
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

const [pressed, setPressed] = useState(false);

type handlePressProps = {
    userId: string,
    value: number
}

const handlePress = async (props: handlePressProps) => {
if (!pressed) {
    // Checking — add points
    console.log('Sending', `userId: ${props.userId}, points: ${props.userId}`)
    const { error } = await supabase.rpc('add_points', {
    user_id: props.userId,
    points_to_add: props.value,
    });
    if (error) {
    Alert.alert('Error adding points', error.message);
    return;
    }
} else {
    // Unchecking — remove points
    const { error } = await supabase.rpc('add_points', {
    user_id: props.userId,
    points_to_add: -props.value,  // ← negative value subtracts
    });
    if (error) {
    Alert.alert('Error removing points', error.message);
    return;
    }
}
setPressed(!pressed);
};