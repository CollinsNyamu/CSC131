// app-tabs.native.tsx
// Tabs component for Android and iOS

import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="Home">
        <Label>Home</Label>
        <Icon src={require('../../assets/images/icon.png')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="index">
        <Label>Login</Label>
        <Icon src={require('../../assets/images/icon.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="leaderboards">
        <Label>Leaderboards</Label>
        <Icon src={require('../../assets/images/checkmark_filled.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="points_shop">
        <Label>Points Shop</Label>
        <Icon src={require('../../assets/images/checkmark_empty.png')} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="user_profile">
        <Label>User Profile</Label>
        <Icon src={require('../../assets/images/icon.png')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}