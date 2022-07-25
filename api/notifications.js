import axios from "axios";

const config = require('../config.json');
const url = `${config.endpoint}/api` || "https://api-staging.grapl.it/api";
import UserService from "../services/UserService";

 

export const findRoom = async (room) =>{  
    const { token } = await UserService.getUserData(); 
    const header  = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    } ;

 

    return axios.get(`${url}/meetings/find/${room}`, { meeting_name : room}, header);
} 



export const getNotifications = async (meeting_name) =>{  
            const {token } = await UserService.getUserData(); 
            const header  = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            } ; 
 
            return axios.post(`${url}/notifications`, {meeting_name}, header);
    } 