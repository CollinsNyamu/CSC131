import { globalStyles } from '@/components/globalStyles';
import { StyleSheet, Text, View } from 'react-native';

export default function Leaderboard() {
    return (
        <>
            <View style={globalStyles.headerBackground}>
                <Text style={globalStyles.headerText}>
                    Leaderboards
                </Text>
            </View>

            <View style={globalStyles.mainBackground}>
                <LeaderboardEntry rank={1} name={"test1"} score={100} />
                <LeaderboardEntry rank={2} name={"test2"} score={90} />
                <LeaderboardEntry rank={3} name={"test3"} score={80} />
                <LeaderboardEntry rank={4} name={"test4"} score={70} />
                <LeaderboardEntry rank={5} name={"test5"} score={60} />
                <LeaderboardEntry rank={6} name={"test6"} score={50} />
                <LeaderboardEntry rank={7} name={"test7"} score={40} />
                <LeaderboardEntry rank={8} name={"test8"} score={30} />
                <LeaderboardEntry rank={9} name={"test9"} score={20} />
                <LeaderboardEntry rank={10} name={"test10"} score={10} />
            </View>
        </>
    );
}

// Leaderboard entries
type leaderboardProps = {
    rank: number
    name: string
    score: number
}

const LeaderboardEntry = (props: leaderboardProps) => {
    return (
        <View style={leaderboardStyles.background}>
            <Text style={leaderboardStyles.rank}>{props.rank}</Text>

            <Text style={leaderboardStyles.name}>{props.name}</Text>

            <Text style={leaderboardStyles.points}>{props.score}</Text>
        </View>
    );
}

// Style sheet for leaderboard page
const leaderboardStyles = StyleSheet.create({
  // leaderboard entries
  background:{
    alignItems: 'center',
    backgroundColor: '#6096ba',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 20,
    width: '90%',
    padding: 10,
    flexWrap: 'wrap'
  },
  rank:{
    color: '#274c77',
    fontSize: 20,
    justifyContent: 'flex-start'
  },
  name:{
    color: '#8b8c89',
    justifyContent: 'center'
  },
  points:{
    color: '#274c77',
    fontSize: 20,
    justifyContent: 'flex-end'
  }
});