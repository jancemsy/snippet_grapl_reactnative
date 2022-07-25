import React, {Component, useState, useRef, useEffect  } from "react"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ScrollView ,FlatList,  View, Text,TextInput, TouchableOpacity,Dimensions, DeviceEventEmitter ,Image, StyleSheet} from "react-native";    
import Layout from '../components/Layout'; 


export default class RoomScreen extends Component {     
	constructor(props) {
		super(props);
        this.state = { 
			in_homescreen : true,     
			spaces : [ 
						{ id: 1, name: 'Earthlings', rooms: [{ name: 'room1', creator : 'John Doe' }, { name: 'room2', creator : 'Mang Jose' }, { name: 'my private room', creator : 'Mang Kanor' },  { name: 'my private room', creator : 'Mang Kanor' }, ], opened : true,  }, 
						{ id: 2, name: 'Mars', rooms: [{ name: 'My room', creator : 'Jessie' }, { name: 'alex room', creator : 'Alex' }   ], opened : false,  },
						{ id: 3, name: 'Staturn' , rooms : [], opened : false} ,
						{ id: 4, name: 'MySpace' , rooms : [], opened : false} ,
						{ id: 5, name: 'Just My Thing' , rooms : [], opened : false} ]
         };   
	 } 
  
	 
  navigateTo(screen){ 
	this.props.navigation.navigate(screen);
  }
   
  
  renderRoom(room, index){
	  const roomImageBorder = { ...styles.roomImageBorder, borderColor: index === 0  ? '#FF9900' : '#333333' } 
	  return (
	         <View style={styles.roomContainer} key ={index}>
				   <TouchableOpacity onPress={() => this.navigateTo('HomeScreen') }   >
						<View style={roomImageBorder} >
							<Image  style={styles.roomImage} source={require('../assets/images/Persistent-Workspace.png')}  />
						</View>
						<View>
							<Text style={styles.roomName}>{room.name}</Text>  
							<Text style={styles.roomCreator}>{room.creator}</Text>  
						</View>
				 </TouchableOpacity>
			 </View> 
	  );
	  
  } 


  async onPressSpace(space){
	  console.log("onPressSpace", space); 
	 var spaces = this.state.spaces;
	 var index = spaces.findIndex(x => x.id === space.id); 
     spaces[index].opened = !spaces[index].opened; 
	 this.setState({ spaces }); 
  } 
  
  renderSpacesContainer(space){  
    const roomCount = space.rooms.length; 
	const height = roomCount * 100;
	const style = { ...styles.spaceContainerItems, height };
	const rooms = space.opened ? <View  style={ style }>{ space.rooms.map( (room, index) => { return this.renderRoom(room,index) })}</View>  : null;   
	const spaceToogleStyle = space.opened ? styles.spaceToogle :  styles.spaceToogleOff ; 
	
	  return (  
		
				<View style={ styles.spaceContainer} key={space.id}> 	  
				              <TouchableOpacity onPress={ () =>  this.onPressSpace(space) }  >
									<View style={styles.spaceHeading} >    
											<Image style={spaceToogleStyle} source={require('../assets/images/home/arrow_down.png')}  />  
											<Text style={styles.spaceTitle}>{space.name}</Text>	          
											<Image  style={styles.spaceMenu} resizeMode={'cover'}	source={require('../assets/images/home/more.png')}  />  
											<Text  style={styles.spaceRoomCount}>{roomCount} Rooms </Text>  
									</View> 
							</TouchableOpacity> 
		    {rooms} 
		</View> 
	  );
	  
  }
  

  render() {  
	const renderedRooms = this.state.spaces.map(space => { 
		return this.renderSpacesContainer(space)
	});
 
	return (<Layout screen="home" navigation={this.props.navigation} >  
					{renderedRooms}				 
					</Layout>);
  }
}

 


const styles = StyleSheet.create({      

	spaceContainer:{  zIndex:29 , padding:10, marginTop:20, width:'100%', minHeight: 70,  paddingBottom:10,  
	borderColor:'#e9e6ec', borderWidth:1, borderRadius:10 ,  shadowColor: "#000",  }, 

	spaceHeading: { width:'100%', height:30  }, 
	spaceTitle: {fontSize:18, position: 'absolute', left:30},
	spaceRoomCount: {fontSize:10, position: 'absolute', left:30, top:25, },
	spaceMenu:  { width: 30, position: 'absolute',right:0, aspectRatio: 0.5,  resizeMode: 'contain'},
	spaceToogle:  { width: 20,  position: 'absolute', top:-4, left:0, aspectRatio: 0.5,  resizeMode: 'contain' }, 
	spaceToogleOff :  { width: 20,  position: 'absolute', top:-5, left:0, aspectRatio: 0.5,  resizeMode: 'contain', transform:[{ rotate: '180deg' }] } , 
	spaceContainerItems: { marginTop: 20,  width:'100%', height:'auto',  flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', flex : 1 },  
	
	roomContainer:{    width:120,height:180, padding:5  },
	roomImageBorder: {   width: 110, height: 110 , margin:10,  padding:5,  borderWidth: 2,      borderRadius: 10 },
	roomImage: { width: 100, height: 100 ,    borderRadius: 10 },
	roomName: { fontSize: 14, textAlign: 'center' ,  width: '100%',  },
	roomCreator: { fontSize: 10, color: '#333', textAlign: 'center' ,  width: '100%',    }, 
	spaceContainerClosed: { },   	
});

