import { globalStyles } from '@/components/globalStyles';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

export default function UserProfile() {
    return (
        <>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    User Profile
                </Text>
            </View>

            <View style={globalStyles.mainBackground}>                
                <Image 
                    source={require('../../assets/images/icon.png')} 
                    style={{ width: 100, height: 100, alignSelf: 'center' }}
                />

                <Text>
                    Name
                </Text>

                <Text>
                    Details
                </Text>
            </View>
        </>
    );
}