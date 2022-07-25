import React, {Component, useState, useRef, useEffect  } from "react";  
import {ScrollView ,FlatList,  View, Text,TextInput, TouchableOpacity,Dimensions, DeviceEventEmitter ,Image, StyleSheet} from "react-native";    
import Layout from '../components/Layout';   

/* 
Temp screen after clicking room thumbnail in homescreen 
*/

export default class HomeScreen extends Component {     
	constructor(props) {
		super(props);
        this.state = {   
         };   
	 } 
   


	 async componentDidMount() { 

	 }
 
   

  render() {     
 
	return (<Layout screen="home"  navigation={this.props.navigation} >   
			 <View style={ styles.homeScreen }></View>
      </Layout>);
  }
}

 


const styles = StyleSheet.create({       
	homeScreen: {     borderRadius:20, 
		marginLeft:'5%', width:'90%', paddingBottom:20, 
	marginRight:'2%', height:'92%',   position: 'absolute',  bottom: 15,  
	 backgroundColor:"#eee", shadowColor: "#000",  
	 shadowOffset: {
		width: 0,
		height: 3,
	},
	shadowOpacity: 0.22,
	shadowRadius: 2.22,
	elevation: 10, 
	}, 
});

