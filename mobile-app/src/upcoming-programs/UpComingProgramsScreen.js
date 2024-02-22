import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
    StatusBar,
    ScrollView,
    Dimensions,
    FlatList
} from "react-native";
import { connect } from 'react-redux';
import {DataTable, Divider,Button,Card,Avatar,List } from  "react-native-paper";
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
const { width,height } = Dimensions.get('screen');
import getApi from "@apis/getApi";
import { logfunction } from "@helpers/FunctionHelper";
import RenderHtml from 'react-native-render-html';
import FastImage from 'react-native-fast-image';
import { Linking } from 'react-native';

function UpComingProgramsScreen(props) {

    const [state, setState] = React.useState({ content: [], loading: true, heading: null });
    const { content, heading, loading } = state;
    const [programs, setPrograms] = React.useState([]);

    useEffect(() => {
        async function getUserAccessData() {
            let sendData = new FormData();
            sendData.append('status', '1');
            try {
                getApi.postData(
                    'user/getUpCommingPrograms',
                    sendData,
                ).then((response => {
                    logfunction("RESPONSE ", response)
                    if (response.status == 1) {
                        setPrograms(response.data);
                    }
                    else {}
                }));
            } catch (error) {
                logfunction("Error", error)
            }
    }
    getUserAccessData();
    }, []);

    const { width } = useWindowDimensions();
    const tagsStyles = {
        
        div:{
            color:'#000',
            fontFamily: Fonts.Font_Reguler,
            fontSize: 15,
            textAlign:'justify',
            lineHeight: 25
        },
        p: {
            color: Colors().black,
            fontFamily: Fonts.Font_Reguler,
            fontSize: wp('3.5%'),
            lineHeight: hp('2.4%'),
        }
    };
    const getTitle = (program,index) =>{
        return <Text style={[styles.contentText,{fontFamily:Fonts.Font_Medium}]}>{(index+1) + ". "+program.title}</Text> 
    }

    return (
        <>
        <ScrollView style={{backgroundColor:'#ffffff'}}>
            <View>
            <Text style={[styles.cardTitle,{padding:10}]}>Pray for upcoming programs:</Text>
            {programs.map((program, index) => {
                    return  <List.Accordion style={styles.ListAccordion}
                            title={getTitle(program, index)}>
                                <View style={{paddingHorizontal:20}}>
                                
                                    <View style={styles.box}>
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{
                                                html: program.description
                                            }}
                                            tagsStyles={tagsStyles}
                                        />
                                    </View>
                                    
                                

                            {/* <Text style={styles.contentText}>{program.description}</Text> */}
                                        <View style={styles.details}>
                                            <Text style={styles.contentHeading}>Dates:</Text>
                                            <Text style={styles.detailValue}>{program.date}</Text>
                                        </View>
                                        <View style={styles.details}>
                                            <Text style={styles.contentHeading}>Venue:</Text>
                                            <Text style={styles.detailValue}>{program.venue}</Text>
                                        </View>
                                        <View style={styles.details}>
                                            <Text style={styles.contentHeading}>Speakers:</Text>
                                            
                                        </View>
                                        <View style={styles.details}>
                                        <View style={styles.box}>
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{
                                                html: program.speakers
                                            }}
                                            tagsStyles={tagsStyles}
                                        />
                                    </View>
                                            
                                        </View>
                                        <View style={styles.details}>
                                            <Text style={styles.contentHeading}>Registration Link:</Text>
                                            <Text style={[styles.detailValue,{color: 'blue',textDecorationLine:'underline'}]} onPress={() => Linking.openURL(program.registration_link)}> Click Here </Text>
                                        </View>

                                        <Text style={styles.contentHeading}>Payment Link: </Text>
                                        <FastImage
                                        style={{height:300,width:300}}
                                        source={{
                                            uri: program.scanner_image,
                                            priority: FastImage.priority.high,
                                        }}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />

                                    <Text style={styles.contentHeading}>Invitation Details: </Text>
                                    <FastImage
                                        style={{paddingHorizontal:30,marginTop:10, height:800,width:'100%'}}
                                        source={{
                                            uri: program.invitation_image,
                                            priority: FastImage.priority.high,
                                        }}
                                        resizeMode={FastImage.resizeMode.stretch}
                                    />
                                 </View>
                                
                        </List.Accordion>
                    
                })}

            <View style={{borderTopWidth: 1, borderColor: Colors().custom_gray,}}></View>      
            </View>
        </ScrollView>
        </>
    )
}

function mapStateToProps(state) {
    return {

    }
}


export default connect(mapStateToProps, {})(UpComingProgramsScreen);

const styles = StyleSheet.create({
    contentText:{
        fontFamily:Fonts.Font_Reguler,
        fontSize: 15,
        color:'#000000',
        marginTop:10,
        lineHeight:25,
        textAlign:'justify'
    },
    contentTitle:{
        fontFamily:Fonts.Font_Medium,
        fontSize: 15,
        color:'#000000'
    },
    cardTitle:{
        fontFamily:Fonts.Font_Medium,
        fontSize: 15,
        color: Colors().themeSecondColor
    },
    details:{flex:1, flexDirection:'row'},
    detailValue:{
        flex:1,
        fontFamily:Fonts.Font_Reguler,
        fontSize: 15,
        color:'#000000',
        //padding:10,
        marginTop:5,
        marginLeft:10, 
        //marginLeft:10,
        lineHeight:25,
        //width: width-70
    },
    contentHeading:{
        fontFamily:Fonts.Font_Medium,
        fontSize: 17,
        color:'#000000',
       // marginTop:5,
        //marginLeft:10,
        lineHeight:25,
        fontWeight:'bold',

    },
    box: {
        justifyContent: 'center',
        alignItems: 'center',
        //padding: hp('1.5%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        //marginHorizontal: wp('1%'),
        //borderRadius: wp('2%'),
        //borderWidth: 0.5,
        //borderColor: Colors().custom_gray,
        fontFamily: Fonts.Font_Reguler
    },
    txt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Medium,
        color: Colors().text_color,
        textAlign: 'left'
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: hp('16%'),
        width: wp('30%'),
    },
    ListAccordion:{
        //marginTop:-10,
        marginBottom:-5,
        backgroundColor:'#fff',
        //borderRadius: wp('2%'),
        borderTopWidth: 1,
        borderColor: Colors().custom_gray,
        //marginHorizontal:5
    }

});