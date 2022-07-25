import * as React from "react";
import { View, Text, StatusBar, Dimensions, Platform  } from "react-native";
import { WebView } from 'react-native-webview';
const config = require('../../config.json');

export default function WebviewScreen() {

	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;
	const isIOS = Platform.OS === 'ios';
	const userAgent = isIOS ? "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36" : null;


	const injectedJS = `
		setTimeout(function() {
			// INJECT IOS NO ZOOM
			document.head.insertAdjacentHTML("beforeend", "<style>input{ font-size:16px !important;}</style>");

			// INJECT AUTH TOKEN EXTRACTION
			// let authToken = window.localStorage.getItem('token');
			// if (authToken && authToken.length) {
			// 	let payload = JSON.stringify({ authToken: authToken });
			// 	window.ReactNativeWebView.postMessage(payload);
			// }

	  }, 1000);
		true;
	`;

	console.log(config.endpoint);

	return (
		<View style={{ flex: 1}}>
			<StatusBar animated={true} backgroundColor="#000" hidden={true} />
			<WebView
				setDisplayZoomControls={false}
				userAgent={userAgent}
				style={{width: windowWidth, height:windowHeight - 20, marginTop: 30 }}
				injectedJavaScript={null}
				injectedJavaScriptBeforeContentLoaded={null}
				originWhitelist={['*']}

				onMessage={(event) => {
					console.log("I was triggered");
					if(event && event.hasOwnProperty('nativeEvent')) {
						console.log('Received Data', event.nativeEvent.data);
					}
				}}
				source={{ uri: config.endpoint + '/login'}} />
		</View>
	);
}
