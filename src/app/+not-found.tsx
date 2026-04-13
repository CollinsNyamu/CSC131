// +not-found.tsx
// This route will be displayed if user navigates to a route that doesn't exist
import { globalStyles } from '@/components/globalStyles';
import { Text, View } from 'react-native';

export default function NotFound() {
    return (
        <>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    This page is being displayed due to an error in navigation.
                </Text>
            </View>
        </>
        
        
    )
}