import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  // header
  headerBackground: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#7c3aed',
  },
  headerText: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  // main
  mainBackground: {
    flex: 7,
    backgroundColor: '#0f0f1a',
    justifyContent: 'flex-start',
    alignItems: 'center',
    rowGap: 16,
    padding: 20,
  }
});