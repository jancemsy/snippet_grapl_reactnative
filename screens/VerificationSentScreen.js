import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function VerificationSentScreen({ navigation, route }) {

	const { type } = route.params;


	console.log(type);

	StatusBar.setBarStyle('light-content', true);

	const handleLogin = () => {
	};


	const handleDismiss = () => {
		navigation.navigate('WelcomeScreen');
	};


	const handleNavigateLogin = () => {
		navigation.navigate('LoginScreen');
	};


	return (
		<View style={{ flex: 1, alignItems: 'center' }}>

			<LinearGradient
				// Background Linear Gradient
				colors={['#00205B', '#0659A9']}
				style={styles.background}
			/>
			<Image style={{ height: 58, width: 200, marginTop: '40%', marginBottom: '30%' }} source={require('../assets/images/grapl-white-logo.png')} />

			<View style={{ padding: 10, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<Text style={{ color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: 'bold' }}>Check Your Email</Text>
			</View>

			<View style={{ marginBottom: 30, width: 300, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				{type === 'magic link' ?
					<Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>We have sent a Magic Link to your email address.</Text>
					:
					<Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>We have sent a password recover intructions to your email address</Text>
				}
			</View>

			<TouchableOpacity onPress={handleDismiss}>
				<View style={{ margin: 5, backgroundColor: '#F69018', padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, width: 250 }}>
					<Text style={{ color: '#fff', fontSize: 15 }}>Ok</Text>
				</View>
			</TouchableOpacity>

			<View style={{ position: 'absolute', bottom: 20, display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
				<TouchableOpacity onPress={handleNavigateLogin}>
					<View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
						<Text style={{ color: '#fff', fontSize: 15 }}>Login</Text>
					</View>
				</TouchableOpacity>

			</View>




		</View>
	);
}


const styles = StyleSheet.create({
	input: {
		height: 45,
		margin: 5,
		borderRadius: 99,
		borderWidth: 0,
		backgroundColor: '#fff',
		padding: 10,
		width: 250,
		paddingLeft: 42
	},
	imgBG: {
		justifyContent: 'center',
		width: '100%',
		height: '100%',
		position: 'absolute',
		bottom: -100
	},
	background: {
		position: 'absolute',
		left: 0,
		right: 0,
		height: '100%',
	},
	textInputCont: {
		justifyContent: 'center',
	},
	mail: {
		width: 16,
		height: 16,
		position: 'absolute',
		marginLeft: 20
	},
	key: {
		width: 17,
		height: 17,
		position: 'absolute',
		marginLeft: 20
	}
});