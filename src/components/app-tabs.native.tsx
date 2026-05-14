import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../app/(tabs)/Home/Home';
import Leaderboard from '../app/(tabs)/Leaderboard';
import Profile from '../app/(tabs)/Profile';
import Shop from '../app/(tabs)/Shop';
import Index from '../app/index';

const Tab = createBottomTabNavigator();

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#0f0f1a', borderTopColor: '#7c3aed' },
        tabBarActiveTintColor: '#a78bfa',
        tabBarInactiveTintColor: '#666',
        headerShown: false,
      }}
    >
      <Tab.Screen name="Tasks" component={Index} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Leaderboard" component={Leaderboard} />
      <Tab.Screen name="Shop" component={Shop} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}