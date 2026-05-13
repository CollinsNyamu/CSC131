import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { supabase } from '../supabase'
import { Button, Input } from '@rneui/themed'
import { FontAwesome } from '@expo/vector-icons'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')  // ← add this
  const [loading, setLoading] = useState(false)

async function signInWithEmail() {
  if (!email && !username) {
    Alert.alert('Please enter email or username');
    return;
  }
  if (!password) {
    Alert.alert('Please enter password');
    return;
  }

  setLoading(true);
  let loginEmail = email;

  // If username was entered instead of email, look up the email
  if (!email && username) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();

    if (error || !data) {
      Alert.alert('Username not found');
      setLoading(false);
      return;
    }

    // Get the actual email from auth.users
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(data.id);
    if (userError || !userData?.user?.email) {
      Alert.alert('Could not find account');
      setLoading(false);
      return;
    }
    loginEmail = userData.user.email;
  }

  // Sign in with email
  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail,
    password: password,
  });

  if (error) Alert.alert(error.message);
  setLoading(false);
}

async function signUpWithEmail() {
  if (!email || !password || !username) {
    Alert.alert('Please fill in all fields (email, username, password)');  {/* ← still requires all 3 */}
    return;
  }

  setLoading(true);
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    Alert.alert(error.message);
  } else if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        username: username,
        updated_at: new Date(),
      });
    
    if (profileError) Alert.alert('Error creating profile', profileError.message);
    else Alert.alert('Signup successful! Check your email.');
  }
  setLoading(false);
}

  return (
    <View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={<FontAwesome name="envelope" size={18} />}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"  
          leftIcon={<FontAwesome name="user" size={18} />}
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Choose a username"
          autoCapitalize={'none'}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={<FontAwesome name="lock" size={18} />}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={() => signUpWithEmail()} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})