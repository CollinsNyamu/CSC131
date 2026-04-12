// +not-found.tsx
// This route will be displayed if user navigates to a route that doesn't exist
import { Text } from 'react-native';

export default function NotFound() {
    return (
        <Text>This page is being displayed due to an error in navigation.</Text>
    )
}