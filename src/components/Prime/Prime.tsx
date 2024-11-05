import { Dimensions, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '../Header/Header'
import { data } from '../../utils'
import Unorderedlist from 'react-native-unordered-list';

const { width } = Dimensions.get('window')

const Prime = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safearea}>
      <ScrollView contentContainerStyle={styles.main} style={styles.scrollView}>
        <Header navigation={navigation}/>
        <View style={styles.maincontainer}>
          <View style={styles.membershipcontainer}><Text style={styles.membership}>Prime Membership</Text></View>
          <View style={styles.container}>
            {data.map((item, index) => (
              <View key={item.id} style={styles.itemContainer}>
                <Unorderedlist
                  bulletUnicode={`0x003${index + 1}`}
                  color='#BE7356'
                >
                  <Text style={styles.heading}>
                    {item.heading}
                    <Text style={styles.text}>{item.text}</Text>
                  </Text>
                </Unorderedlist>
              </View>
            ))}
          </View>
          <View style={styles.sub}>
            <TouchableOpacity style={styles.touch}>
              <Text style={styles.subtext}>Subscribe</Text>
            </TouchableOpacity>
          </View>

        </View>
        
      </ScrollView>
    </SafeAreaView>
  )
}

export default Prime

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: 'white'
  },
  main: {
    flexGrow: 1,
  },
  scrollView: {
    flex: 1, // Ensure ScrollView takes full height
  },
  maincontainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    alignItems:'center',
    paddingHorizontal: 10,
  },
  membershipcontainer:{
    paddingVertical:30
  },
  membership:{
    color:'#792a38',
    fontSize:25,
  },
  container:{
    
  },
  itemContainer:{
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  heading:{
    fontSize:15,
    color:'#BE7356',
    display: 'flex',
  },
  textcontainer: {

  },
  text:{
    color:'black',

  },
  sub:{ 
   width:width,
   paddingHorizontal:10,
   marginTop:width/40

  },
  touch: {
    alignItems:'center',
    backgroundColor:'#A4737B',
    borderRadius:12,
    padding:width/30,
  },
  subtext:{
    color:'white'
  }

})

// const Prime = () => {
//   const items = [
//     "First item",
//     "Second item",
//     "Third item"
//   ];

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>My Numbered List</Text>
//       <Unorderedlist
//         bulletUnicode={"0x0030"} // Unicode for '0'
//         color="blue" // Bullet color
//         style={styles.listItem} // Custom styles
//       >
//         {items.map((item, index) => (
//           <Text key={index} style={styles.listText}>
//             {index + 1}. {item}
//           </Text>
//         ))}
//       </Unorderedlist>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     marginBottom: 20,
//   },
//   listItem: {
//     fontSize: 18,
//   },
//   listText: {
//     fontSize: 18,
//   },
// });

// export default Prime;