import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

export const ApiCall= async(url) => {
    var isConnected = false;
    await NetInfo.fetch().then(state => {
        isConnected = state.isConnected;
    });
    if(isConnected){
        return fetch(url)
        .then((response) => response.json())
        .then(async(json) => {
            await AsyncStorage.setItem('rosterData', JSON.stringify(json))
            return json;    
        })    
        .catch((error) => {        
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