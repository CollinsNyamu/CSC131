// +not-found.tsx
// This route will be displayed if user navigates to a route that doesn't exist

import { Text } from 'react-native';
export default function NotFound() {
    return(
        <Text>If this page pops up, something was not found </Text>
    );
}