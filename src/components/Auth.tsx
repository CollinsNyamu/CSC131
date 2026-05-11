import React, { useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../supabase'
import { Button, Input } from '@rneui/themed'
import { FontAwesome } from '@expo/vector-icons'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  async function signInWithEmail() {
    setLoading(true)
    console.log({ email, password })
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }
  async function signUpWithEmail() {
    if (!email || !password) {
      Alert.alert('Please enter both email and password');
      return;
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
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
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})