import React from 'react'
import { View, Text,StyleSheet } from 'react-native'
const Layout = () => {
  return (
    <View style={styles.container}>
        <View style={[styles.box, {backgroundColor:"#1f8db2ff"}]}>
            {/* <Text>Section 1</Text> */}
        </View>
        <View style={[styles.box, {backgroundColor:"#9bec9bff"}]}>
            {/* <Text>Section 2</Text> */}
        </View>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    box: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      padding: 16,
    },
  });
export default Layout
