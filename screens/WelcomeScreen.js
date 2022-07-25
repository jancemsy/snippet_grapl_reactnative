import * as React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, StatusBar } from "react-native";
import { ThemingStyles } from "./Styles";


export default function WelcomeScreen({ navigation }) {

    StatusBar.setBarStyle('dark-content', true);

    const handleNavigateJoinAsGuest = () => {
        navigation.navigate('GuestJoinScreen');
    };

    const handleNavigateSignUp = () => {
        navigation.navigate('SignUpScreen');
    };


    const handleNavigateLogin = () => {
        navigation.navigate('LoginScreen');
    };
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			  <StatusBar hidden={true} translucent={true} />

            <Text style={{ color: '#00205B', fontSize: 20, fontWeight: 'bold' }}>Let's Grapl</Text>
            <Image style={styles.imgBG} source={require('../assets/images/Persistent-Workspace.png')} />

            <TouchableOpacity onPress={handleNavigateJoinAsGuest}>
                <View style={ThemingStyles.orangeButton}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>Join a Meeting</Text>
                </View>
            </TouchableOpacity>

            <View style={{ position: 'absolute', bottom: 70, display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center' }}>
                <TouchableOpacity onPress={handleNavigateSignUp}>
                    <View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, width: 170 }}>
                        <Text style={{ color: '#00205B', fontSize: 15, fontWeight: 'bold' }}>Sign Up</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNavigateLogin} >
                    <View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, width: 170 }}>
                        <Text style={{ color: '#00205B', fontSize: 15, fontWeight: 'bold' }}>Login</Text>
                    </View>
                </TouchableOpacity>
            </View>


        </View>
    );
}


const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 220
    },
    imgBG: {
        justifyContent: 'center',
        width: '100%',
        height: '30%',
        marginTop: 30,
        marginBottom: 50
    }
});
