import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from './checkbox';

type TaskProps = {
  task: string;
  value: number;
  userId: string;
};

export const Task = (props: TaskProps) => {
  return(
  <View style={taskStyles.taskBackground}>
    <Checkbox value={props.value} userId={props.userId}/>
    <Text style={taskStyles.taskPoints}>
        {props.value}
    </Text>

    <Text style={taskStyles.taskText}>
      {props.task}
    </Text>

  </View>
  );
};

const taskStyles = StyleSheet.create({
  taskBackground:{
    alignItems: 'center',
    backgroundColor: '#6096ba',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    columnGap: 20,
    width: '90%',
    padding: 10,
    flexWrap: 'wrap'
  },
  taskPoints:{
    color: '#274c77',
    fontSize: 20,
    justifyContent: 'flex-end'
  },
  taskText:{
    color: '#black',
    justifyContent: 'center'
  }
})