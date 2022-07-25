
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { getAvatar } from '../utils/user'; 

const setUserData =  async function(params) {  
    params.avatar_url =  getAvatar(params) 
    await AsyncStorage.setItem("userInfo", JSON.stringify(params));  
}; 

const getUserData = async function() { 
    const  result = await AsyncStorage.getItem("userInfo") ; 
    return result ? JSON.parse(result) : null; 
}

const UserService = { 
    getAvatar,
    setUserData,
    getUserData 
};

export default UserService;