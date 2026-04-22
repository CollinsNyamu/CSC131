import React, {useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {StyleSheet, View, Text, Pressable,TextInput, Alert, AppState } from "react-native";
import {supabase} from "../supabase";

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })


export default function NewUser() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)




    async function signUpWithEmail() {
        setLoading(true)

        if (!email || !password || !username) {
            Alert.alert('Error', 'Please fill in all required fields')
            setLoading(false)
            return
        }
        const fullName = `${firstName} ${lastName}`.trim()

        const {
          data: { session },
          error,
        } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              username: username,
              full_name: fullName || null,
            }
          }
        })
        if (error) {
            Alert.alert('Error', error.message)
            setLoading(false)
            return
        }


            
            if (session) {
                Alert.alert('Success', 'Account created! Please check your inbox for email verification.')
            } else {
            Alert.alert('Please check your inbox for email verification!')
            }
        
        setLoading(false)
    }

  return (
    <SafeAreaView style={styles.container}>

    <View style={{flexDirection: 'row'}}>  
        <TextInput
            style={styles.smallinput}
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize={'words'}
        />
        <TextInput
            style={styles.smallinput}
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize={'words'}
        />
    </View>
        <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}

        />


        <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Email"
            autoCapitalize={'none'}
            keyboardType="email-address"
        />
        <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            autoCapitalize={'none'}
        />
        <Pressable style={styles.button} onPress={signUpWithEmail}>
            <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create New User'}</Text>
        </Pressable>

    </SafeAreaView>
  );}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "black", // light gray E5E7EB
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 40,
        width: "80%",
    },
    input:{
        height: 40,
        width: 320,
        margin: 10,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    smallinput:{
        height: 40,
        width: 150,
        margin: 10,
        marginTop: 0,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 10,
        paddingHorizontal: 100,
        borderRadius: 5,
        alignSelf: "center",
        marginTop: 40,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },

});