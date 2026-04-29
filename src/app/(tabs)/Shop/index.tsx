import { globalStyles } from '@/components/globalStyles';
import { Text, View } from 'react-native';

export default function PointsShop() {
    return (
        <>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    Points Shop
                </Text>
            </View>

            <View style={globalStyles.mainBackground}>
                <Text>
                    Items
                </Text>
            </View>
        </>
    )
}