import React, {Component, useState, useRef, useEffect  } from "react";  
import {ScrollView ,FlatList,  View, Text,TextInput, TouchableOpacity,Dimensions, DeviceEventEmitter ,Image, StyleSheet} from "react-native";    
import Layout, { LayoutStyle }  from '../components/Layout';    


export default class WidgetScreen extends Component {     
	constructor(props) {
		super(props);
        this.state = {  
			tools : [
				{image: require('../assets/images/home/tools_files.png'), name: 'Files' , selected : true },
				{image: require('../assets/images/home/tools_notes.png'), name: 'Notes', selected : false },
				{image: require('../assets/images/home/tools_images.png'), name: 'Images' , selected : false },
				{image: require('../assets/images/home/tools_task.png'), name: 'Task' , selected : false },
				{image: require('../assets/images/home/tools_presenter.png'), name: 'PDF Presenter' , selected : false },
				{image: require('../assets/images/home/tools_whiteboard.png'), name: 'White Board' , selected : false },
				{image: require('../assets/images/home/tools_transcribe.png'), name: 'Transcribe', selected : false },
				{image: require('../assets/images/home/tools_links.png'), name: 'Links' , selected : false },
			],

			syncs : [
				{image: require('../assets/images/home/googledrive.png'), name: 'Google Drive' , selected : false },
				{image: require('../assets/images/home/dropbox.png'), name: 'Drop Box' , selected : false },
				{image: require('../assets/images/home/clickup.png'), name: 'Clickup' , selected : false },
				{image: require('../assets/images/home/slack.png'), name: 'Clickup' , selected : false },
				{image: require('../assets/images/home/twitch.png'), name: 'Twitch' , selected : false },
				{image: require('../assets/images/home/youtube.png'), name: 'YouTube' , selected : false },
				{image: require('../assets/images/home/github.png'), name: 'GitHub' , selected : false },
				{image: require('../assets/images/home/hubspot.png'), name: 'Hubspot' , selected : false },
			] 

         };   
	 } 
   

  async onPressTool(tool){

	console.log("OnPressTool", tool);

	var tools = this.state.tools;
	var index = tools.findIndex(x => x.name === tool.name); 
	tools[index].selected = !selected[index].selected; 

	this.setState({ tools }); 
  }

  async onPressSync(sync){
	var syncs = this.state.tools;
	var index = syncs.findIndex(x => x.name === tool.name); 
	syncs[index].selected = !selected[index].selected; 
	this.setState({ syncs }); 
 }
    
  

  render() {  
	 
	const  tools = this.state.tools.map( ( item, index) => {return (
		
		<TouchableOpacity onPress={ () =>  this.onPressTool(item) }   key={index}>
		<View style={item.selected ? styles.selectedItem : styles.boxItem}>			
				<Image  style={styles.boxItemImage} source={ item.image }  />   
				<Text style={styles.boxItemLabel}>{item.name} </Text>  
	  </View>
	  </TouchableOpacity>
	  );
	   });

	   	 
	const  syncs = this.state.syncs.map( ( item, index) => {return ( 
		<TouchableOpacity onPress={ () =>  this.onPressSync(item) }  key={index}>
			<View style={item.selected ? styles.selectedItem : styles.boxItem} >			
					<Image  style={styles.boxItemImage2} source={ item.image }  />   
					<Text  style={styles.boxItemLabel} >{item.name}</Text>			
		</View></TouchableOpacity>
	  );
	   });
 
	return (<Layout screen="widgets"  navigation={this.props.navigation} >  
					<View style={{ ...LayoutStyle.box, height:500 } }>
			
									<View>
										<Text style={styles.boxTitle}>Tools</Text> 
										<View style={styles.flexBox}>
											{tools} 
										</View>
									</View>


									<View style={ { marginTop:50 } }>
									<Text style={styles.boxTitle}>Syncs</Text>
										<View style={styles.flexBox}>
										    {syncs}  
										</View>
									</View> 
						</View>			 
      </Layout>);
  }
}

 


const styles = StyleSheet.create({       
 
 
	boxTitle: {  paddingTop:20, paddingLeft:20 } ,	
	selectedItem: { borderWidth:1, borderColor : '#ff9601' ,margin:5, width:55, height:75 , borderRadius:10, overflow:'hidden'}, 
	boxItemLabel: {  fontSize: 10, textAlign: 'center' ,  width: '100%',   }, 
	boxItem: {  margin:5, width:55, height:75  ,borderRadius:5, overflow:'hidden' }, 
	boxItemImage : {  alignSelf:'center', height:50,  aspectRatio: 0.8,  resizeMode: 'contain'   } ,
	boxItemImage2 : { alignSelf:'center', height:50, aspectRatio:0.6,  resizeMode: 'contain'   } ,
	flexBox: { marginLeft:20, width:'90%',   height:160, display:'flex', alignItems:'center',  flexWrap: 'wrap', flexDirection: 'row' }
});

