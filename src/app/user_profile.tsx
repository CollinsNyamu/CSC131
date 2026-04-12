import { globalStyles } from '@/components/globalStyles';
import { Text, View } from 'react-native';

export default function UserProfile() {
    return (
        <>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    User Profile
                </Text>
            </View>
        </>
    )
}