import React, { useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
} from "react-native";
import { requestInit } from '@actions';
import {
    OtrixContainer, OtrixHeader, OtrixContent, OtrixDivider, OtrixAlert
} from '@component';
import { Input, Text, FormControl, Button } from "native-base"
import { connect } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors, isValidEmail, isValidMobile, isValidpassword, isValidConfirmPassword } from '@helpers'
import { logfunction } from "@helpers/FunctionHelper";
import Fonts from "@helpers/Fonts";
import getApi from "@apis/getApi";
import { congratulation } from '@common';



function DonationSuccessScreen(props) {
    useEffect(() => {

    }, []);

    return (
        <OtrixContainer>

            {/* Header */}
            {/* <OtrixHeader customStyles={GlobalStyles.authHeader}>
                <Text style={[GlobalStyles.authtabbarText]}>Donation done successfully</Text>
            </OtrixHeader> */}
            <OtrixDivider size={'md'} />

            {/* Content Start from here */}
            <OtrixContent>
                <OtrixDivider size={'md'} />
                <Image source={congratulation} resizeMode="contain" style={styles.image} />
                <OtrixDivider size={'md'} />
                <Text style={styles.registerTxt}>Donation successfully done!</Text>
                <OtrixDivider size={'md'} />
                <Button
                    size="md"
                    variant="solid"
                    bg={Colors().themeColor}
                    style={GlobalStyles.button}
                    onPress={() => props.navigation.navigate('UESIHomeScreen')}
                >
                    <Text style={GlobalStyles.buttonText}>Go To Home page</Text>
                </Button>
                <OtrixDivider size={'md'} />
            </OtrixContent>
        </OtrixContainer >
    )

}

function mapStateToProps({ params }) {
    return {}
}

export default connect(mapStateToProps)(DonationSuccessScreen);

const styles = StyleSheet.create({
    registerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerTxt: {
        fontSize: wp('6%'),
        textAlign: 'center',
        fontFamily: Fonts.Font_Reguler,
        color: Colors().secondry_text_color,
        lineHeight: hp('3.5%')
    },
    image: {
        resizeMode: 'contain',
        alignSelf: 'center',
        height: hp('25%'),
        width: wp('45%'),
    },
    signupTxt: {
        fontSize: wp('3.5%'),
        textAlign: 'right',
        fontFamily: Fonts.Font_Medium,
        color: Colors().link_color
    },
});