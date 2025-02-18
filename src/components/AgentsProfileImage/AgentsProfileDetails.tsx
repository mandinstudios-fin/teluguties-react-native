import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'
import Slider from '../Profiles/Slider'
import useFirestore from '../../hooks/useFirestore'

const { width, height, fontScale } = Dimensions.get("window")

const AgentsProfileDetails = ({ route, navigation }) => {

    const { agent } = route.params;
    const {sendRequestToAgent} = useFirestore();

    return (
        <SafeAreaView style={styles.safearea}>
            <ScrollView>
                <View style={styles.main}>
                    <Header navigation={navigation} />
                    <View style={styles.boxContainer}>
                        <View style={styles.box}></View>
                    </View>
                    <Slider images={[agent?.profilepic]} />
                    <View style={styles.userdetails}>
                        <View style={styles.name}>
                            <Text style={styles.username}>{agent?.fullname}</Text>

                        </View>
                    </View>

                    <View style={styles.userdetailsmain}>
                        <View style={styles.detailscontainer}>
                            <Text style={styles.detailsnameparamater} numberOfLines={1}>Name</Text>
                            <Text style={styles.detailsnamecolon}>:</Text>
                            <Text style={styles.detailsnamevalue} numberOfLines={1}>
                                {agent?.fullname || 'Not Specified'}
                            </Text>
                        </View>

                        <View style={styles.detailscontainer}>
                            <Text style={styles.detailsnameparamater} numberOfLines={1}>Agent ID</Text>
                            <Text style={styles.detailsnamecolon}>:</Text>
                            <Text style={styles.detailsnamevalue} numberOfLines={1}>
                                {agent?.agent_id || 'Not Specified'}
                            </Text>
                        </View>

                        <View style={styles.detailscontainer}>
                            <Text style={styles.detailsnameparamater} numberOfLines={1}>Code</Text>
                            <Text style={styles.detailsnamecolon}>:</Text>
                            <Text style={styles.detailsnamevalue} numberOfLines={1}>
                                {agent?.selectedcode || 'Not Specified'}
                            </Text>
                        </View>

                        <View style={styles.detailscontainer}>
                            <Text style={styles.detailsnameparamater} numberOfLines={1}>Phone Number</Text>
                            <Text style={styles.detailsnamecolon}>:</Text>
                            <Text style={styles.detailsnamevalue} numberOfLines={1}>
                                {agent?.phonenumber || 'Not Specified'}
                            </Text>
                        </View>

                        <View style={styles.detailscontainer}>
                            <Text style={styles.detailsnameparamater} numberOfLines={1}>Email</Text>
                            <Text style={styles.detailsnamecolon}>:</Text>
                            <Text style={styles.detailsnamevalue} numberOfLines={1}>
                                {agent?.mailid || 'Not Specified'}
                            </Text>
                        </View>

                        <View style={styles.detailscontainer}>
                            <Text style={styles.detailsnameparamater} numberOfLines={1}>State</Text>
                            <Text style={styles.detailsnamecolon}>:</Text>
                            <Text style={styles.detailsnamevalue} numberOfLines={1}>
                                {agent?.state || 'Not Specified'}
                            </Text>
                        </View>

                        <View style={styles.detailscontainer}>
                            <Text style={styles.detailsnameparamater} numberOfLines={1}>District</Text>
                            <Text style={styles.detailsnamecolon}>:</Text>
                            <Text style={styles.detailsnamevalue} numberOfLines={1}>
                                {agent?.district || 'Not Specified'}
                            </Text>
                        </View>

                        <View style={styles.shortlistbox}>
                            <TouchableOpacity style={styles.shortlist} onPress={() => sendRequestToAgent(agent.id)}>
                                <Text style={styles.shortlisttext}>Assign</Text>
                            </TouchableOpacity>
                        </View>


                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default AgentsProfileDetails

const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: 'white',
    },
    main: {
        flexGrow: 1,
        paddingBottom: width / 20
    },
    boxContainer: {
        paddingHorizontal: 10
    },
    box: {
        backgroundColor: 'transparent',
        borderColor: '#AFAFAF',
        borderWidth: 0.5,
        height: 60,
        width: '100%',
        borderRadius: 15,
        marginBottom: 10
    },
    userdetails: {
        paddingHorizontal: width / 40,
    },
    name: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: width / 20,
        paddingTop: width / 20,

    },
    username: {
        fontSize: fontScale * 27,
        fontWeight: 'bold',
        color: '#752B35',
        margin: 0,
        padding: 0
    },
    userdetailsmain: {
        display: 'flex',
        alignItems: 'center',
        marginTop: width / 30,
        gap: width / 60
    },
    detailscontainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    detailsnameparamater: {
        width: width * 0.25,
        color: '#7b2a50',
        fontSize: fontScale * 17,
    },
    detailsnamecolon: {
        width: width * 0.1,
        color: '#7b2a50',
        fontWeight: 'bold',
        fontSize: fontScale * 17,
    },
    detailsnamevalue: {
        width: width * 0.3,
        color: '#7b2a50',
        fontSize: fontScale * 17,
    },
    shortlist: {
        marginTop: width * 0.08,
        paddingHorizontal: width * 0.1,
        paddingVertical: width * 0.04,
        backgroundColor: '#7b2a38',
        borderRadius: 5,

    },
    shortlisttext: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 15,
    },
})