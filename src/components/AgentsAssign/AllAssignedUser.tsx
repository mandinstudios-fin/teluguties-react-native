import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../Header/Header'
import useAgent from '../../hooks/useAgent';
import { getFirstName } from '../../utils';

const AllAssignedUser = ({ navigation }) => {
    const [assignedData, setAssignedData] = useState([]);

    const { getMatchingRequestData } = useAgent();

    useEffect(() => {
        getMatchingRequestData(setAssignedData);
    }, [])

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView contentContainerStyle={styles.scrollview}>
                <View style={styles.main}>
                    <Header navigation={navigation} />
                    <View>
                        <Text style={styles.assigntext}>Assigned Users</Text>
                    </View>

                    <View style={styles.maincontent}>
                        <View style={styles.assignedbox}>
                            <Text style={styles.uploadtext}>Assigned Users</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("AllAssignedUser")}><Text style={styles.viewalltext}>View All</Text></TouchableOpacity>
                        </View>

                        <View style={styles.imagecontainer}>
                            {assignedData.map((user) => (
                                <TouchableOpacity onPress={() => navigation.navigate("UserProfileDetails", { user })} key={user.id} style={styles.imagetextview}>
                                    <Text style={styles.detailtext}>{getFirstName(user?.personal_info?.name)} wants to connect with you!</Text>
                                    <View style={styles.imagebox}>
                                        <Image source={require('../../assets/users.png')} style={styles.usersimage} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AllAssignedUser

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
    maincontent: {
        paddingHorizontal: 10,
        marginTop: 20
    },
    assigntext: {
        color: '#000',
        alignItems: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
    assignedbox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    
    uploadtext: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    

    viewalltext: {
        color: 'gray',
        fontSize: 14,
    },
    
    imagecontainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        backgroundColor: '#e4d7cf',
        height: 'auto',
        padding: 17,
        borderRadius: 25
    },
    imagetextview: {
        backgroundColor: '#e3ccc1',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 43,
        paddingLeft: 15,
    },
    
    detailtext: {
        color: 'black',
        fontSize: 16,
        width: '80%',
    },
    
    imagebox: {
        width: '20%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    
    usersimage: {
        width: '50%',
        resizeMode: 'contain'
    },


})