import { globalStyles } from '@/components/globalStyles';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, Alert } from 'react-native'
import { Button, Input } from '@rneui/themed'

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
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Username" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>
    </View>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    User Profile
                </Text>
            </View>

            <View style={globalStyles.mainBackground}>                
                <Image source={require('../../assets/images/icon.png')} style={{ width: 100, height: 100, alignSelf: 'center' }} />

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