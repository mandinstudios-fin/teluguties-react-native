import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'

const AgentsEarn = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <Header navigation={navigation} />
                    <View>
                        <Text style={styles.earntext}>Total Earnings</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AgentsEarn

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollview: {
        flexGrow: 1
    },
    main: {
        flex: 1,
        gap: 3
    },
    earntext:{
        color:'#000',
        textAlign:'center',
        fontSize:25,
        fontWeight:'bold'
    }
})