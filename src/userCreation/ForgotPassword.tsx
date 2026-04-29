import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable ,View, TextInput, StyleSheet,Text } from "react-native";

export default function ForgotPasswordScreen() {
    const [text, onChangeText] = React.useState('');
    const [number, onChangeNumber] = React.useState('');

  return (

    <SafeAreaView style={styles.container}>
            
            <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                placeholder="Email"
                value={text}
            />
            <Text style={{marginBottom:10}}>
                Your confirmation link will be sent to your email address
            </Text>

            <Pressable 
                style={styles.button} onPress={() => {}}>
                 <Text style={styles.buttonText}>Send Email</Text>
            </Pressable>
            

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input:{
    height: 40,
    width: 360,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    paddingHorizontal: 140,
    borderRadius: 5,
    alignSelf: "center",
    },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    },

  },
);
