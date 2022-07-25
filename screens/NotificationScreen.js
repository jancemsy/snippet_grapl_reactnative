import React, {Component  } from "react";  
import {ScrollView , View, Text,  Image, StyleSheet} from "react-native";   
import UserService from "../services/UserService"; 
import Layout, { LayoutStyle }  from '../components/Layout';   
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import Avatar from "../components/Avatar";

export default class NotificationScreen extends Component {     
	constructor(props) {
		super(props);
        this.state = {  
			notifications : [  ] 
         };   
 
	 } 
   
	 componentDidMount(){
	   this.initNotifications();
	}

	async initNotifications(){
		const  result = await AsyncStorage.getItem("notifications") ;  
        this.setState({ notifications : JSON.parse(result) || [] }); 
	}
 
   

  render() {    
	const notifications = this.state.notifications.map( (item , index )=> {
		return ( 
			<View style={styles.itemBox} key={index}>
					<View style={styles.itemAvatar}  > 
					  <Avatar height={30} width={30} url={item.avatar_url}></Avatar>
					 </View> 
					<Text  style={styles.itemMessage}>{item.name} {item.message}</Text>    
					<Image style={styles.itemMore}  source={require('../assets/images/home/more.png')}  /> 
					<Text  style={styles.itemTime}>  { moment(item.time).format('L, h:mm:ss A')  }     </Text>     
		    </View> 
		)
	})
 
	return (<Layout screen="notifications"  navigation={this.props.navigation} >  
	          
					<View style={{ ...LayoutStyle.box, height:500 } }>
					 
										<Text style={styles.boxTitle}>Notifications</Text>  

										<ScrollView> 
                                          {notifications} 
										</ScrollView> 

									
						</View>			 
				
      </Layout>);
  }
} 


const styles = StyleSheet.create({         
	boxTitle: {  paddingTop:20, paddingLeft:20, marginBottom: 30 } ,	  
	itemAvatar: {  position:'absolute' ,  top:10, }, 
	itemBox: { marginLeft:20, marginTop:-10, width:'90%',   height:70, display:'flex', alignItems:'center',  flexWrap: 'wrap', flexDirection: 'row' },
	itemMessage : { position:'absolute', top:10,  marginLeft:50, fontSize:12 }, 
	itemTime: {  top:30,  marginLeft: 45, fontSize:10, color:'#333' , 
	 position:'absolute'  },
	itemMore: { position:'absolute', right:10, aspectRatio: 0.4, width:25, top: 20,  resizeMode: 'contain'  }
});

