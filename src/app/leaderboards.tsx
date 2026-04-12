import { globalStyles } from '@/components/globalStyles';
import { Text, View } from 'react-native';

export default function Leaderboard() {
    return (
        <>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    Leaderboards
                </Text>
            </View>
        </>
    )
}