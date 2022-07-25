import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, StatusBar, ActivityIndicator, Dimensions, ScrollView } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { forgotPass, magicLink } from "../api/controller";
import { ThemingStyles } from "./Styles";
import CustomModal from "../components/CustomModal";

export default function MagicLinkScreen({ navigation }) {
    const [email, setemail] = useState('')
    const [showModal, setshowModal] = useState(false)
    const [modalInfo, setmodalInfo] = useState('')
    const [wait, setWait] = useState(false)
    const [evalid, setevalid] = useState(false)

    StatusBar.setBarStyle('light-content', true);

    const handleLogin = () => {
    };


    const handleSendMagicLink = async () => {
        setWait(true)
        const magic = await magicLink({ email: `${email}` })

        setTimeout(() => {
            setWait(false)
        }, 300);


        switch (magic.msg) {
            case 'Authentication failed. User not found.':
                setshowModal(true)
                setmodalInfo('No user found with the provided email')
                break;
            case 'Authorized logged in.':
                navigation.navigate('VerificationSentScreen', { type: 'magic link' });
                break;

            default:
                break;
        }
    };


    const handleNavigateLogin = () => {
        navigation.navigate('LoginScreen');
    };


    const validateEmail = (email) => {
        if (email.length > 0) {
            setevalid(true)
            if (String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) setevalid(false)
        } else {
            setevalid(false)
        }

        setemail(email)

    };


    return (
        <ScrollView>

            <View style={{ height: Dimensions.get('window').height, alignItems: 'center' }}>

                <LinearGradient
                    // Background Linear Gradient
                    colors={['#00205B', '#0659A9']}
                    style={styles.background}
                />
                <Image style={{ height: 58, width: 200, marginTop: '40%', marginBottom: '30%' }} source={require('../assets/images/grapl-white-logo.png')} />

                <View style={{ padding: 10, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 15, textAlign: 'center' }}>Enter the email address associated with your account and  we’ll send  you a Magic Link to login</Text>
                </View>


                <View style={styles.textInputCont}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email Address"
                        onChangeText={(text) => validateEmail(text)}
                    />
                    <Image style={styles.mail} source={require('../assets/images/icons/mail.png')} />
                </View>

                {
                    evalid &&
                    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 15, height: 15, marginTop: 1, marginRight: 2 }} source={require('../assets/images/icons/error.png')} />
                        <Text style={{ color: '#ff3b3b', fontSize: 13 }}>Invalid email address</Text>
                    </View>
                }

                <TouchableOpacity disabled={email.length === 0 || evalid} onPress={handleSendMagicLink}>
                    <View style={{
                        margin: 5,
                        backgroundColor: `${email.length === 0 ? 'rgba(246,144,24,.9)' : 'rgb(246,144,24)'}`,
                        padding: 10,
                        height: 45,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20, width: 250
                    }}>

                        {wait ? <ActivityIndicator size="small" color="#fff" /> :
                            <Text style={{ color: `${email.length === 0 || evalid ? 'rgba(255,255,255,.6)' : 'rgb(255,255,255)'}`, fontSize: 15 }}>Send Magic Link</Text>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNavigateLogin}>
                    <View style={{ padding: 10, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 15 }}>Cancel</Text>
                    </View>
                </TouchableOpacity>

                {showModal &&
                    <CustomModal show={showModal}>
                        <Text style={ThemingStyles.modalTitle}>Unable to send Magic Link</Text>
                        <Text style={ThemingStyles.modalText}>{modalInfo}</Text>
                        <TouchableOpacity onPress={() => setshowModal(false)}>
                            <View style={ThemingStyles.orangeButton} >
                                <Text style={ThemingStyles.orangeButtonText}>OK</Text>
                            </View>
                        </TouchableOpacity>
                    </CustomModal>
                }


            </View>
        </ScrollView>
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