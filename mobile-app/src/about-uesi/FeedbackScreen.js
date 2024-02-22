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
function FeedbackScreen(props) {

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
            fontFamily: Fonts.Font_Reguler,
            fontSize: wp('3.5%'),
            lineHeight: hp('2.4%'),
        }
    };
    const callus =()=>{
        Linking.openURL('tel:+917702471313');
    }
    const sendMessage =()=>{
        Linking.openURL('whatsapp://send?text=&phone=+917702471313');
    }

    return (
        <SafeAreaView style={{backgroundColor:'#ffffff',height:height}}>
            <OtrixContent>
            <View style={{paddingVertical:10}}>
                <Text style={{color:'#000', fontSize:15, fontFamily:Fonts.Font_Reguler}}>Note: If you find mistake in any song (or) If You facing any issue, kindly report below. </Text>
            </View>
            <View style={{paddingVertical:20}}>
            <Button  icon="phone" mode="outlined" onPress={()=>callus()}>
                    Call Us
            </Button>
            </View>
            <View>
            <Button  icon="whatsapp" mode="outlined" theme={{ colors: { primary: '#01a884' } }} onPress={()=>sendMessage()}>
                    Send Whatsapp Message
            </Button>
            </View>

        </OtrixContent>
        </SafeAreaView>
        

    )
}

function mapStateToProps(state) {
    return {

    }
}


export default connect(mapStateToProps, {})(FeedbackScreen);

const styles = StyleSheet.create({

    box: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: hp('1.5%'),
        backgroundColor: Colors().white,
        marginVertical: hp('1%'),
        marginHorizontal: wp('1%'),
        borderRadius: wp('2%'),
        borderWidth: 0.5,
        borderColor: Colors().custom_gray
    },
    txt: {
        fontSize: wp('4%'),
        fontFamily: Fonts.Font_Medium,
        color: Colors().text_color,
        textAlign: 'left'
    }

});