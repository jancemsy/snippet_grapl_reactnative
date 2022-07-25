import { createStore } from 'redux'  
import AsyncStorage from '@react-native-async-storage/async-storage'
import UserService  from '../services/UserService';

export const set = async function(field,val){
  const storename = STORE[field]; 
	return AsyncStorage.setItem( storename , JSON.stringify(val) || ''); 
}

export const get = async function(field){
  const storename = STORE[field];
  const val = await AsyncStorage.getItem(storename); 
	return val ? JSON.parse(val) : null;  
} 

 async function chatsReducer(state = { value: [] }, action) {  
	let {type , payload} = action; 
  const storableActions = [STATES.UPDATE_CHATS, STATES.UPDATE_NOTIFICATIONS, STATES.UPDATE_USERS, STATES.SEND_CHAT];

   
   if( type === STATES.GET_CHATS ){
      const users = await get(STATES.UPDATE_USERS);
      const chats = await get(STATES.UPDATE_CHATS);
      const userInfo = await UserService.getUserData();   
      payload = { users, chats , userInfo};  
   }else if( storableActions.includes(type) ){ //not filtered? 
        set(type, payload);  //cache this. 
   } 

	  return { type, payload };
  }
 

  export const STORE = { 
    SEND_CHAT    : 'chats',
    UPDATE_USERS : 'users', 
    UPDATE_CHATS : 'chats' , 
    GET_CHATS : 'chats' , 
    UPDATE_NOTIFICATIONS : 'notifications', 
  }

  export const STATES = {
      SEND_CHAT    : 'SEND_CHAT',
      GET_CHATS    : 'GET_CHATS',
      UPDATE_USERS : 'UPDATE_USERS', 
	    UPDATE_CHATS : 'UPDATE_CHATS' , 
      GET_CHATS    : 'GET_CHATS' , 
      UPDATE_NOTIFICATIONS : 'UPDATE_NOTIFICATIONS', 
      CONNECT_CHAT : 'CONNECT_CHAT'};

  const store = createStore(chatsReducer) 
  export default store;
