import * as React from "react";
import { View, Text, Image } from "react-native";

export default function SplashScreen({ navigation }) {

	setTimeout(function () {
		navigation.replace('WelcomeScreen');
	}, 3000);

	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Image style={{ height: 58, width: 200 }} source={require('../assets/images/logo-orange.png')} resizeMode="cover" />
			<Text style={{fontSize: 10}}>Build 26</Text>
		</View>
	);
}
