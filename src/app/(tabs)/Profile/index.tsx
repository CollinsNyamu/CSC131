import { globalStyles } from '@/components/globalStyles';
import { Button, Input } from '@rneui/themed';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../../supabase';

export default function UserProfile({ userId, email }: { userId: string; email?: string }) {
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [website, setWebsite] = useState('')
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
          setWebsite(data.website)
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
      website,
      avatar_url,
    }: {
      username: string
      website: string
      avatar_url: string
    }) {
      try {
        setLoading(true)
  
        const updates = {
          id: userId,
          username,
          website,
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
    return (
        <>
         <View>
      <View style={[profileStyles.verticallySpaced, profileStyles.mt20]}>
        <Input label="Email" value={email} disabled />
      </View>
      <View style={profileStyles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={profileStyles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>

      <View style={[profileStyles.verticallySpaced, profileStyles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={profileStyles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    User Profile
                </Text>
            </View>

            <View style={globalStyles.mainBackground}>                
                <Image source={require('./icon.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />

                <Text>
                    Name
                </Text>

                <Text>
                    Details
                </Text>
            </View>
        </>   
    )
}

const profileStyles = StyleSheet.create({
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