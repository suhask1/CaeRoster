import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

export const ApiCall= async() => {
    var isConnected = false;
    await NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        isConnected = state.isConnected;
    });
    if(!isConnected){
        return fetch('https://rosterbuster.aero/wp-content/uploads/dummy-response.json')
        .then((response) => response.json())
        .then(async(json) => {
            await AsyncStorage.setItem('rosterData', JSON.stringify(json))
            return json;    
        })    
        .catch((error) => {      
            console.error(error);   
            return false; 
        });
    }else{
        const data = await AsyncStorage.getItem('rosterData');
        if(data){
            return JSON.parse(data);
        }else{
            return false;
        }
    }
}