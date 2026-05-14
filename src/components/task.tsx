import { Pressable, StyleSheet, Text, View } from "react-native";
import { Checkbox } from './checkbox';

type TaskProps = {
  task: string;
  value: number;
  userId: string;
  onReroll: () => void;
};

export const Task = (props: TaskProps) => {
  return (
    <View style={taskStyles.taskBackground}>
      <Checkbox value={props.value} userId={props.userId} />
      <Text style={taskStyles.taskPoints}>{props.value}</Text>
      <Text style={taskStyles.taskText}>{props.task}</Text>
      <Pressable onPress={props.onReroll}>
        <Text style={{ fontSize: 20 }}>🔄</Text>
      </Pressable>
    </View>
  );
};

const taskStyles = StyleSheet.create({
  taskBackground: {
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#7c3aed',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 16,
    width: '100%',
    padding: 14,
    marginBottom: 12,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  taskPoints: {
    color: '#a78bfa',
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 50,
    textAlign: 'right',
  },
  taskText: {
    color: '#e2e8f0',
    fontSize: 16,
    flex: 1,
  }
});