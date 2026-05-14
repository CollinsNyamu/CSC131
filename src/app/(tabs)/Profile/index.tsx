import { Button, Input } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../supabase';

export default function UserProfile({ userId, email }: { userId: string; email?: string }) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [avatarUrl, setAvatarUrl] = useState('')
  
    useEffect(() => {
      if (userId) getProfile()
    }, [userId])
  
    async function getProfile() {
      try {
        setLoading(true)
  
        let { data, error, status } = await supabase
          .from('profiles')
          .select(`username, website, avatar_url`)
          .eq('id', userId)
          .single()
        if (error && status !== 406) {
          throw error
        }
  
        if (data) {
          setUsername(data.username)
          setAvatarUrl(data.avatar_url)
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
  
    async function updateProfile({
      username,
      avatar_url,
    }: {
      username: string
      avatar_url: string
    }) {
      try {
        setLoading(true)
  
        const updates = {
          id: userId,
          username,
      
          avatar_url,
          updated_at: new Date(),
        }
  
        let { error } = await supabase.from('profiles').upsert(updates)
  
        if (error) {
          throw error
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert(error.message)
        }
      } finally {
        setLoading(false)
      }
    }
    async function updatePassword() {
      if (!newPassword) return;
      
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) Alert.alert('Error updating password', error.message);
      else {
        Alert.alert('Password updated successfully!');
        setNewPassword('');  // clear field after update
      }
    }
    return (
      <>
        <View style={profileStyles.headerBackground}>
          <Text style={profileStyles.headerText}>Profile</Text>
        </View>
  
        <View style={profileStyles.mainBackground}>  {/* ← was just <View> */}
          <View style={[profileStyles.verticallySpaced, profileStyles.mt20]}>
            <Input label="Email" value={email} disabled />
          </View>
          <View style={profileStyles.verticallySpaced}>
            <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
          </View>
          <View style={profileStyles.verticallySpaced}>
            <Input label="New Password" value={newPassword} onChangeText={(text) => setNewPassword(text)}
             secureTextEntry={true}  autoCapitalize="none" />
          </View>
          <View style={[profileStyles.verticallySpaced, profileStyles.mt20]}>
            <Button
              title={loading ? 'Loading ...' : 'Update'}
              onPress={() => {
                updateProfile({ username, avatar_url: avatarUrl });
                if (newPassword) updatePassword();
              }}
              disabled={loading}
            />
          </View>
          <View style={profileStyles.verticallySpaced}>
            <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
          </View>
        </View>
      </>
  )
}

const profileStyles = StyleSheet.create({
    container: {
      marginTop: 90,
      padding: 12,
    },
    verticallySpaced: {
      paddingTop: 4,
      paddingBottom: 4,
      alignSelf: 'stretch',
    },
    mt20: {
      marginTop: 10,
    },
    headerBackground:{
  height: 85,
  backgroundColor: '#0f0f1a',
  justifyContent: 'center',
  alignItems: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#7c3aed',
},
headerText:{
  color: '#ffffff',
  fontSize: 40,
  fontWeight: 'bold',
  letterSpacing: 2,
},
mainBackground:{
  flex: 7,
  backgroundColor: '#0f0f1a',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  rowGap: 20,
  padding: 20
}

  })