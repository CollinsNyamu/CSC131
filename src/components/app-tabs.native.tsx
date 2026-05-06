// app-tabs.native.tsx
// Tabs component for Android and iOS

import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="Home">
        <Label>Login</Label>
        <Icon src={require('../../assets/images/icon.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="Leaderboard">
        <Label>Leaderboards</Label>
        <Icon src={require('../../assets/images/checkmark_filled.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="Shop">
        <Label>Points Shop</Label>
        <Icon src={require('../../assets/images/checkmark_empty.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="Profile">
        <Label>User Profile</Label>
        <Icon src={require('../../assets/images/icon.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}