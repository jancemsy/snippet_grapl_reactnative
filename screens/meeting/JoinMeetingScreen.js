import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image  } from "react-native";

export default function JoinMeetingScreen ({ navigation }) {

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F4F6' }}>
			<Image style={{height: 200, width: 300, marginBottom: 10}} source={require('../../assets/images/cover-join-meeting.png')}  resizeMode="cover"/>
			<TouchableOpacity onPress={()=>{ navigation.replace('Meeting') }}>
				<View style={{backgroundColor: '#F69018', padding: 10, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 50, width: 200}}>
					<Text style={{color: '#fff', fontsize: 16}}>Join Meeting</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}
