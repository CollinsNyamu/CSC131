import { globalStyles } from '@/components/globalStyles';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../supabase';

type LeaderboardUser = {
  display_name: string;  // ← was username
  points: number;
};

export default function Leaderboard() {
  const [selected, setSelected] = useState<'Daily' | 'Weekly' | 'All Time'>('Daily');
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard(selected);
  }, [selected]); 

  async function fetchLeaderboard(tab: 'Daily' | 'Weekly' | 'All Time') {
    setLoading(true);
  
    if (tab === 'All Time') {
      const { data, error } = await supabase
        .from('leaderboard_view')
        .select('display_name, points')
        .order('points', { ascending: false })
        .limit(10);
  
      if (!error) setUsers(data ?? []);
  
    } else {
      const startDate = new Date();
      if (tab === 'Daily') startDate.setHours(0, 0, 0, 0);
      if (tab === 'Weekly') startDate.setDate(startDate.getDate() - 7);
  
      // Fetch ALL users first
      const { data: allUsers, error: usersError } = await supabase
        .from('leaderboard_view')
        .select('id,display_name, points');
  
      // Fetch points earned in the time window
      const { data: history, error: historyError } = await supabase
        .from('points_history')
        .select('user_id, points')
        .gte('earned_at', startDate.toISOString());
  
      if (!usersError && allUsers) {
        // Sum history points per user
        const totals: Record<string, number> = {};
        history?.forEach(({ user_id, points }) => {
          totals[user_id] = (totals[user_id] ?? 0) + points;
        });
  
        // Map all users, defaulting to 0 if no points in window
        const sorted = allUsers
          .map((user: any) => ({
            display_name: user.display_name,
            points: totals[user.id] ?? 0,  // ← 0 if no activity
          }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 10);
  
        setUsers(sorted);
      }
    }
  
    setLoading(false);
  }

  return (
    <>
      <View style={globalStyles.headerBackground}>
        <Text style={globalStyles.headerText}>Leaderboard</Text>
      </View>

      <View style={globalStyles.mainBackground}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', gap: 10 }}>
            {users.map((user, index) => (
              <LeaderboardEntry key={index} rank={index + 1} name={user.display_name} score={user.points} />
            ))}
          </ScrollView>
        )}
      </View>

      {/* Tab Selector */}
      <View style={tabStyles.container}>
        {(['Daily', 'Weekly', 'All Time'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[tabStyles.tab, selected === tab && tabStyles.activeTab]}
            onPress={() => setSelected(tab)}
          >
            <Text style={[tabStyles.tabText, selected === tab && tabStyles.activeText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

// Leaderboard Entry
type LeaderboardProps = { rank: number; name: string; score: number };

const LeaderboardEntry = ({ rank, name, score }: LeaderboardProps) => (
  <View style={leaderboardStyles.background}>
    <Text style={leaderboardStyles.rank}>{rank}</Text>
    <Text style={leaderboardStyles.name}>{name}</Text>
    <Text style={leaderboardStyles.points}>{score}</Text>
  </View>
);

const leaderboardStyles = StyleSheet.create({
  background: {
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '90%',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  rank: { color: '#a78bfa', fontSize: 16, width: 24, fontWeight: 'bold' },
  name: { color: '#e2e8f0', fontSize: 16, flex: 1, marginLeft: 10 },
  points: { color: '#a78bfa', fontSize: 16, fontWeight: 'bold' },
});

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#7c3aed',
    marginHorizontal: 0,
    marginBottom: 0,
    padding: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: '#7c3aed',
  },
  tabText: { color: '#888', fontSize: 14 },
  activeText: { color: '#ffffff', fontWeight: 'bold' },
});

