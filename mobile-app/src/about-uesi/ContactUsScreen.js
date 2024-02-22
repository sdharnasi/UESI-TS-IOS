import React, { useEffect } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
    Linking,
    SafeAreaView,
    Dimensions
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import { Button,Card } from 'react-native-paper';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
import getApi from "@apis/getApi";
import { logfunction } from "@helpers/FunctionHelper";
import RenderHtml from 'react-native-render-html';
const { width, height } = Dimensions.get('screen');

function ContactUsScreen(props) {

    const [state, setState] = React.useState({ content: [], loading: true, heading: null });
    const { content, heading, loading } = state;


    useEffect(() => {
        getApi.getData(
            "getPages/4",
            [],
        ).then((response => {
            if (response.status == 1) {
                logfunction("RESPONSEEE ", response)
                setState({
                    ...state,
                    heading: response.data.heading,
                    content: response.data.description,
                    loading: false
                });
            }
        }));
    }, []);

    const { width } = useWindowDimensions();
    const tagsStyles = {
        p: {
            color: Colors().black,
            fontSize:15,
            fontFamily: Fonts.Font_Reguler,
            lineHeight: hp('2.5%'),
        }
    };
    const getDirections =()=>{
        Linking.openURL('geo:17.627152042575997, 78.35785009836181');
        
    }
    const openWebsite =()=>{
        Linking.openURL('https://www.uesits.in/');
    }

    return (

        <SafeAreaView style={{backgroundColor:'#ffffff',height:height}}>
            {/* Orders Content start from here */}
                {
                    loading && <OtrixLoader />
                }
                {
                    !loading && <OtrixContent>
                        <View style={styles.box}>
                            <RenderHtml
                                contentWidth={width}
                                source={{
                                    html: content
                                }}
                                tagsStyles={tagsStyles}
                            />
                            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                    <TouchableOpacity style={{display:'flex', flexDirection:'row', alignItems:'center'}} onPress={() => getDirections()}>
                                    <Ionicons name='location' size={20} color="blue" /> 
                                        <Text style={{fontSize:15, color:'blue',marginLeft:3}}>Get Directions</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{display:'flex', flexDirection:'row', alignItems:'center'}} onPress={() => openWebsite()}>
                                    <Ionicons name='globe' size={20} color="blue" /> 
                                        <Text style={{fontSize:15, color:'blue', marginLeft:5}}>Web Site</Text>
                                    </TouchableOpacity>
                                
                            </View>
                            </View>
                    </OtrixContent>
                }

            
        </SafeAreaView>
    )
}

function mapStateToProps(state) {
    return {

    }
}


export default connect(mapStateToProps, {})(ContactUsScreen);

const styles = StyleSheet.create({

    box: {
        justifyContent: 'center',
        //alignItems: 'center',
        padding: hp('1.5%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        borderRadius: wp('2%'),
        borderWidth: 0.5,
        borderColor: Colors().custom_gray,
        fontFamily: Fonts.Font_Reguler
    },
    txt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Medium,
        color: Colors().text_color,
        textAlign: 'left'
    }

});