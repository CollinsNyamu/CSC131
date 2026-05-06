import { StyleSheet } from "react-native";

// Colors
/*
  #e7ecef - Light grey
  #274c77 - Dark blue
  #6096ba - Medium blue
  #a3cef1 - Light blue
  #8b8c89 - Gray
*/

// Style sheet for multiple screens
export const globalStyles = StyleSheet.create({
  // header
  headerBackground:{
    flex: 1,
    backgroundColor: '#e7ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText:{
    color: '#8b8c89',
    fontSize: 40
  },
  // main
  mainBackground:{
    flex: 7,
    backgroundColor: '#a3cef1',
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: 20,
    padding: 20
  }
});