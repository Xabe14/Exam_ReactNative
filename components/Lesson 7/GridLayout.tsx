import React from "react";
import { StyleSheet, View } from "react-native";

const GridLayout = () => {

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={[styles.box, { backgroundColor: "#2a87a6" }]} />
                <View style={[styles.box, { backgroundColor: "lightgreen" }]} />
                <View style={[styles.box, { backgroundColor: "#f0a500" }]} />
            </View>

            <View style={styles.row}>
                <View style={[styles.box, { backgroundColor: "#ef233c" }]} />
                <View style={[styles.box, { backgroundColor: "#9b5de5" }]} />
                <View style={[styles.box, { backgroundColor: "#00bbf9" }]} />
            </View>

            <View style={styles.row}>
                <View style={[styles.box, { backgroundColor: "#00f5d4" }]} />
                <View style={[styles.box, { backgroundColor: "#ff006e" }]} />
                <View style={[styles.box, { backgroundColor: "#f48c06" }]} />
            </View>
        </View>
    );
}

export default GridLayout;

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        // flexDirection: 'row',
    },

    row: {
        flex: 1,
        flexDirection: 'row',
    },  
    box: {
        flex: 1,
        width: '30%',
    },
}
)