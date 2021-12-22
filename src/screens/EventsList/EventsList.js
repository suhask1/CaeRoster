import React, { Component } from "react";
import { View, Image, ScrollView, StyleSheet, TouchableOpacity, Text, FlatList, Pressable, ToastAndroid } from 'react-native';
import { ApiCall } from "../../Services/API/apiCalls";
import moment from "moment";
import { BASE_URL } from "../../Services/API/ApiConstants/ApiConstants";

var prevDate = '';

export default class EventsList extends Component{
    constructor(props) {
        super(props);
        this.state= {
            rosterData: [],
            refreshingData: false
        }
    }

    componentDidMount() {
        this.getRosterData(BASE_URL);
    }

    getRosterData=async(url)=> {
        var data = await ApiCall(url);
        if(data){
            data.sort((a,b)=>{
                let currDate = Date(a.Date);
                let nextDate = Date(b.Date);
                return currDate < nextDate;
            })
            data.reverse();
    
            this.setState({
                rosterData: data,
                refreshingData: false
            })
        }
    }

    renderItem = (item, index) => {
        let showDate = false;

        if(item.Date !== prevDate){
            prevDate = item.Date
            showDate = true;
        }
        
        let date = moment(item.Date, "DD-MM-YYYY");
        let formattedDate = moment(date).format('DD MMM YYYY')

        return(
            <View key={index}>
                {
                    showDate
                    && <View style={{padding: 10, backgroundColor: '#f3f3f3', borderBottomWidth:1, borderColor:'grey'}}>
                        <Text style={{fontWeight:'bold', color:'#000'}}>{formattedDate}</Text>
                    </View>
                }
                <Pressable 
                    style={{backgroundColor:'#fff'}}
                    onPress={()=>{
                        if(item.DutyCode !=='OFF'){
                            if(!this.state["event"+index]){
                                this.setState({
                                    ["event"+index]: true
                                })
                            }else{
                                this.setState({
                                    ["event"+index]: false
                                })
                            }
                        }
                    }}
                >
                    {
                        item.DutyCode.toLowerCase() === 'flight'
                        ? <View style={{flexDirection :'row', alignItems:'center', padding:15, borderBottomWidth:1, borderColor:'grey'}}>
                            <Image source={require('../../Assets/airplane.png')} style={{width: 25, height: 25}} resizeMode="contain" />
                            <Text style={{ flex:1, marginLeft: 15, color:'#000', fontWeight:'bold'}}>{item.Departure} - {item.Destination}</Text>
                            <Text style={{marginLeft: 15, color:'red'}}>{item.Time_Arrive} - {item.Time_Depart}</Text>
                        </View>
                        : item.DutyCode.toLowerCase() === 'layover'
                            ? <View style={{flexDirection :'row', alignItems:'center', padding:15, borderBottomWidth:1, borderColor:'grey'}}>
                                <Image source={require('../../Assets/bag-checked.png')} style={{width: 25, height: 25}} resizeMode="contain" />
                                <View style={{flex:1}}>
                                    <Text style={{marginLeft: 15, color:'#000', fontWeight:'bold'}}>Layover</Text>
                                    <Text style={{marginLeft: 15}}>{item.Destination}</Text>
                                </View>
                                <Text style={{marginLeft: 15, color:'red'}}>{item.Time_Depart}</Text>
                            </View>
                            : item.DutyCode.toLowerCase() === 'standby'
                                ? <View style={{flexDirection :'row', alignItems:'center', padding:15, borderBottomWidth:1, borderColor:'grey'}}>
                                    <Image source={require('../../Assets/clipboard-text.png')} style={{width: 25, height: 25}} resizeMode="contain" />
                                    <View style={{flex:1}}>
                                        <Text style={{marginLeft: 15, color:'#000', fontWeight:'bold'}}>Standby</Text>
                                        <Text style={{marginLeft: 15}}>{item.DutyID}</Text>
                                    </View>
                                    <View>
                                        <Text style={{marginLeft: 15}}>Match Crew</Text>
                                        <Text style={{marginLeft: 15, color:'red'}}>{item.Time_Depart}</Text>
                                    </View>
                                </View>
                                : item.DutyCode.toLowerCase() === 'off'
                                    ? <View style={{flexDirection :'row', alignItems:'center', padding:15, borderBottomWidth:1, borderColor:'grey'}}>
                                        <Image source={require('../../Assets/alarm-note-off.png')} style={{width: 25, height: 25}} resizeMode="contain" />
                                        <Text style={{ flex:1, marginLeft: 15, color:'#000', fontWeight:'bold'}}>Week Off</Text>
                                    </View>
                                    : <View style={{flexDirection :'row', alignItems:'center', padding:15, borderBottomWidth:1, borderColor:'grey'}}>
                                        <Image source={require('../../Assets/bag-checked.png')} style={{width: 25, height: 25}} resizeMode="contain" />
                                        <View style={{flex:1}}>
                                            <Text style={{marginLeft: 15, color:'#000', fontWeight:'bold'}}>{item.DutyCode}</Text>
                                            <Text style={{ flex:1, marginLeft: 15}}>{item.Departure} - {item.Destination}</Text>
                                        </View>
                                        <Text style={{marginLeft: 15, color:'red'}}>{item.Time_Arrive} - {item.Time_Depart}</Text>
                                    </View>
                    }
                </Pressable>

                {
                    this.state['event'+index] &&
                    <View style={{backgroundColor:'#fff', padding: 15, borderBottomWidth:1, borderColor:'grey'}}>
                        {
                            Object.keys(item).map((key, num) => {
                                return(
                                    <View style={{flexDirection:'row'}} key={num}>
                                        <View style={{width: '40%'}}>
                                            <Text>{key}</Text>
                                        </View>
                                        <View style={{flex:1}}>
                                            <Text>{item[key]}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                    </View>
                }
            </View>
        )
    }

    onRefresh() {
        this.setState({
            refreshingData : true
        },()=>this.getRosterData())
    }

    render(){
        if(this.state.rosterData.length <1){
            return(
                <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                    <Text>fetching roster data...</Text>
                </View>
            )
        }else{
            return(
                <FlatList
                    data= {this.state.rosterData}
                    renderItem={({item, index})=>this.renderItem(item, index)}
                    extraData={this.state.rosterData}
                    onRefresh={()=> this.onRefresh()}
                    refreshing={this.state.refreshingData}
                />
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})