import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput  } from "react-native";
import NavBarMeeting from '../../components/NavBarMeeting';
import Accordion from 'react-native-collapsible/Accordion';
import { getSpaces } from '../../api/controller';
import ICON_MORE_BLACK from '../../assets/images/icons/ic_more-black.png';
import ICON_CHEVRON_RIGHT from '../../assets/images/icons/ic_chevron-right.png';
import ICON_PLUS_ORANGE from '../../assets/images/icons/ic_plus-orange.png';
import ICON_FOLDER_BLACK from '../../assets/images/icons/ic_folder-black.png';
import ICON_SEARCH_BLACK from '../../assets/images/icons/ic_search-black.png';
import { randomColor } from '../../utils/index';

const SPACES = [
  {
    name: 'Space 1',
    rooms: [
		 { name: "Room 1", owner: "" },
		 { name: "Room 2", owner: "" },
		 { name: "Room 3", owner: "" },
		 { name: "Room 4", owner: "" },
		 { name: "Room 5", owner: "" },
		 { name: "Room 6", owner: "" },
		 { name: "Room 7", owner: "" },
		 { name: "Room 8", owner: "" },
		 { name: "Room 9", owner: "" }
	 ]
  },
  {
    name: 'Space 2',
    rooms: [
		 { name: "Room 1", owner: "" },
		 { name: "Room 2", owner: "" },
		 { name: "Room 3", owner: "" }
	 ]
  },
  {
	 name: 'Space 3',
	 rooms: [
		{ name: "Room 1", owner: "" },
		{ name: "Room 2", owner: "" },
		{ name: "Room 3", owner: "" },
		{ name: "Room 4", owner: "" },
   ]
  },
  {
	 name: 'Space 3',
	 rooms: [
		{ name: "Room 1", owner: "" },
		{ name: "Room 2", owner: "" },
		{ name: "Room 3", owner: "" },
		{ name: "Room 4", owner: "" },
		{ name: "Room 6", owner: "" },
		{ name: "Room 7", owner: "" },
		{ name: "Room 8", owner: "" }
   ]
  },
];

export default function MeetingListScreen ({ navigation }) {

	const [isCollapsed, setIsCollapsed] = useState(false)
	const [activeSelection, setActiveSelection] = useState([0])
	const [spaces, setSpaces] = useState([]);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');

	let navigationState = navigation.getState();
	let params = navigationState.routes[navigationState.index].params;


	useEffect(async ()=>{
		console.log(params.email,params.token,params.name);
			setEmail(params.email);
			setName(params.name);
			const spaces = await getSpaces(params.token);
			var _spaces = spaces.data.map(function(space, index){
				space['name'] = space.name ? space.name : 'Space '+ index,
				space['rooms'] = space.meetingIds.map((meeting)=> {
					let meetingName = meeting.name || meeting._id;
					return Object.assign({ name: meetingName, owner: ' ' }, meeting);
				});
				return space;
			});
			setSpaces(_spaces);
	}, [])


	const _renderHeader = (space, index) => {
		const isOpened = activeSelection.indexOf(index) != -1;
	  return (
		 <View style={[styles.sectionHeader, { borderBottomWidth: isOpened ? 0 : 1 }]}>
		   <Text style={styles.sectionHeaderText}>{space.name}</Text>
			<Text style={styles.sectionHeaderSubText}>{space.rooms.length} Rooms</Text>
			<TouchableOpacity style={styles.sectionHeaderOptions}>
				<Image source={ICON_MORE_BLACK} style={styles.actionIcon} />
			</TouchableOpacity>
			<View style={styles.sectionHeaderDropdown}>
				<Image source={ICON_CHEVRON_RIGHT} style={styles.iconChevron} />
			</View>
		 </View>
	  );
	};

	const _renderContent = (space) => {
	  return (
		 <View style={styles.sectionContent}>
			 {space.rooms.map((room)=>{
				 return (<TouchableOpacity style={styles.touchableRoomThumbnail}><View style={styles.roomThumbnail}>
					 <View style={{borderWidth: 1, width: 100, height: 100, borderRadius: 4, borderColor: 'gray', alignItems: 'center', justifyContent:'center'}}>
						 <View style={{width: 92, height: 92, backgroundColor: 'gray', borderRadius: 4 }}></View>
					 </View>
					 <Text style={{position: 'absolute', fontSize: 11, bottom: 18, textAlign:'center'}}>{room.name.slice(0,10)}</Text>
					 <Text style={{position: 'absolute', fontSize: 11, bottom: 4, textAlign:'center'}}>{room.owner}</Text>
				 </View></TouchableOpacity>);
			 })}
		 </View>
	  );
	};

	const _updateSections = (activeSections) => {
	  setActiveSelection(activeSections);
	}

	return (
		<View style={{paddingTop: 100, flex:1, backgroundColor: '#fff'}}>
			<NavBarMeeting style={{height: 98, paddingTop: 30}}>
				<View style={{position: 'relative', top: 10, left: 20, flexDirection: 'row'}}>
					<View style={{height:50,width:34, borderRadius: 25, position:'absolute', zIndex: 99, overflow: 'hidden', alignItems:'center', justifyContent:'center'}}>
						<Image style={{height: 14, width: 14}} source={ICON_SEARCH_BLACK}/>
					</View>
					<TextInput style={{backgroundColor: '#f2f2f2', width: 225, height: 36, marginTop:8, paddingLeft: 40, borderRadius: 18}}></TextInput>
				</View>

				<TouchableOpacity style={{position: 'absolute', top: 14, right: 105}} onPress={()=>{}}>
					<View style={{ height:40,width:40, alignItems:'center', justifyContent:'center'}}>
						<Image style={{height: 26, width: 26}} source={ICON_PLUS_ORANGE}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={{position: 'absolute', top: 14, right: 65}} onPress={()=>{}}>
					<View style={{ height:40,width:40, alignItems:'center', justifyContent:'center'}}>
						<Image style={{height: 24, width: 26}} source={ICON_FOLDER_BLACK}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={{position: 'absolute', top: 16, right: 20}} onPress={()=>{}}>
					<View style={{ height:36,width:36, borderRadius: 18, overflow: 'hidden', alignItems:'center', justifyContent:'center'}}>
						<Image style={{height: 36, width: 36}} source={{uri: `https://ui-avatars.com/api/?name=${name || ' '}&format=png&color=fff&background=${randomColor().replace('#','')}`}}/>
					</View>
				</TouchableOpacity>
			</NavBarMeeting>
			<ScrollView style={{ flex: 1 }}>
				<Accordion
			        sections={spaces}
			        activeSections={activeSelection}
			        renderHeader={_renderHeader}
			        renderContent={_renderContent}
					  underlayColor={'transparent'}
			        onChange={_updateSections}
			      />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
  sectionHeader: {
	  padding:14,
	  height: 70,
	  paddingHorizontal: 36,
	  borderTopWidth: 1,
	  borderLeftWidth: 1,
	  borderRightWidth: 1,
	  borderColor: '#CCCCCC',
	  backgroundColor: '#fff',
	  margin: 4,
	  marginBottom: 0,
	  position: 'relative'
  },
  sectionHeaderText: {
	  fontSize: 18,
	  marginBottom: 4,
  },
  sectionHeaderSubText: {
	  fontSize: 10
  },
  sectionHeaderOptions: {
	  position: 'absolute',
	  width: 50,
	  height: 50,
	  top: 35 - 25,
	  right: 4,
	  alignItems: 'center',
	  justifyContent: 'center'
  },
  sectionHeaderDropdown: {
		position: 'absolute',
		width: 25,
		height: 50,
		top: 0,
		left: 4,
		alignItems: 'center',
		justifyContent: 'center'
  },
  iconChevron: {
		width: 20,
		height: 20,
		resizeMode: 'cover'
  },
  actionIcon: {
		width: 30,
		height: 30,
		resizeMode: 'cover',
  },
  sectionContent: {
	  borderBottomWidth: 1,
	  borderLeftWidth: 1,
	  borderRightWidth: 1,
	  borderColor: '#CCCCCC',
	  backgroundColor: '#fff',
	  padding: 10,
	  paddingHorizontal: 20,
	  marginHorizontal: 4,
	  marginBottom:10,
	  flexDirection: 'row',
	  flexWrap: 'wrap',
	  alignItems:'center',
	  justifyContent:'flex-start',
  },
  roomThumbnail: {
	  borderRadius: 4,
	  height: 140,
	  alignItems:'center',
	  paddingTop: 4,
  },
  touchableRoomThumbnail: {
	  width: '30%',
	  margin: "1%",
  }
 });
