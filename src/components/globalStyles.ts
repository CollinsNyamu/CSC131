import { StyleSheet } from "react-native";

// Style sheet for multiple screens
export const globalStyles = StyleSheet.create({
  // header
  headerBackground:{
    flex: 1,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText:{
    fontSize: 40
  },
  // main
  mainBackground:{
    flex: 7,
    backgroundColor: 'turquoise',
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: 20,
    padding: 20
  }
});