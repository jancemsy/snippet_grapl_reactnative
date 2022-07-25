import { StyleSheet } from "react-native";

export const ThemingStyles = StyleSheet.create({
    orangeButton: {
        backgroundColor: '#F69018',
        padding: 10,
        height: 45,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        width: 170
    },
    modalText: {
        fontSize: 15,
        marginBottom: 20,
        color: 'rgb(60,60,60)'
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'rgb(40,40,40)'
    },
    orangeButtonText: {
        color: '#fff',
        fontSize: 16
    }
})