// app-tabs.native.tsx
// Tabs component for Android and iOS

import { NativeTabs } from 'expo-router/unstable-native-tabs';

export default function AppTabs() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" />
      <NativeTabs.Trigger name="leaderboards" />
      <NativeTabs.Trigger name="points_shop" />
      <NativeTabs.Trigger name="user_profile" />
    </NativeTabs>
  );
}