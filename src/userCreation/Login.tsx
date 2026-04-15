import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TextInput, Pressable, Alert, View, AppState } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../lib/supabase";

// Handle app state for auto-refresh
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function LoginScreen() {
  const navigation = useNavigation();
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  /**
   * Determines if input is email or username
   * Email contains '@', username does not
   */
  function isEmail(input: string): boolean {
    return input.includes('@')
  }

  /**
   * Look up email from username in profiles table
   */
  async function getEmailFromUsername(username: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username.trim())
        .single()

      if (error || !data?.email) {
        console.error('Username lookup failed:', error)
        return null
      }

      return data.email
    } catch (error) {
      console.error('Error in getEmailFromUsername:', error)
      return null
    }
  }

  async function signInWithEmail() {
    // Validation
    if (!emailOrUsername.trim() || !password) {
      Alert.alert('Error', 'Please enter both email/username and password')
      return
    }

    setLoading(true)

    try {
      let emailToUse = emailOrUsername.trim()

      // If it's not an email, look up the username
      if (!isEmail(emailToUse)) {
        const foundEmail = await getEmailFromUsername(emailToUse)
        
        if (!foundEmail) {
          Alert.alert('Error', 'Username not found')
          setLoading(false)
          return
        }
        
        emailToUse = foundEmail
      }

      // Sign in with email
      const { error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: password,
      })

      if (error) {
        // User-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          Alert.alert('Error', 'Incorrect email/username or password')
        } else {
          Alert.alert('Error', error.message)
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      Alert.alert('Error', 'An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmailOrUsername}
        value={emailOrUsername}
        placeholder="Email or Username"
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Password"
        autoCapitalize="none"
        autoCorrect={false}
        editable={!loading}
      />

      <Pressable onPress={() => navigation.navigate("ForgotPassword" as never)}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </Pressable>

      <Pressable 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Signing In...' : 'Login'}
        </Text>
      </Pressable>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
      </View>

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpPrompt}>Don't have an account?</Text>
        <Pressable onPress={() => navigation.navigate("SignUp" as never)}>
          <Text style={styles.signUpLink}>Sign Up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 40,
    width: 300,
    margin: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 36,
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  forgot: {
    color: "#2563EB",
    alignSelf: "flex-start",
    marginTop: 8,
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 50,
    width: "80%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db",
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signUpPrompt: {
    fontSize: 14,
    color: "#6b7280",
  },
  signUpLink: {
    color: "#2563EB",
    marginLeft: 5,
    fontSize: 14,
    fontWeight: "600",
  },
});