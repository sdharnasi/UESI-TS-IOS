import React from 'react'
import { Dimensions, Image, StatusBar, StyleSheet, TouchableOpacity, View,Text } from 'react-native'

//import { buttonColor, dividerColor } from '../utilities/colors'
import { Modal, Portal } from 'react-native-paper'
//import { homeStyles } from '../pages/home/home-css'
//import { imagesUrl } from '../config/uri'
//import { globalStyles } from '../global-css'
import { useNavigation } from '@react-navigation/native'
const { width, height } = Dimensions.get('screen');
//import Video from 'react-native-video';


const ModalPreview = (props: any) => {

    const goback = () => {
        props.hideImagePreview();
    }
    return (
        <Portal>
            <Modal visible={true} style={styles.wrapper} contentContainerStyle={{ flex: 1 }}>
                <View style={[styles.header]}>
                    <View style={styles.headerStart}>
                        <TouchableOpacity onPress={goback}>
                            {/* <Image
                                style={styles.backarrowIcon}
                                source={require("./../assets/backarrow.png")}
                            /> */}
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <Video source={{uri:props.localimage?props.image:`${imagesUrl}/${props.image}`}}
                    // ref={ref => image = ref}
                    resizeMode='cover'
                    pictureInPicture={false}
                    paused={false}
                    controls={true}
                    playWhenInactive
                    // onError={videoError}
                    poster={props.localimage?props.image:`${imagesUrl}/${props.image}`}
                    style={[styles.uploadVideo1]} >
                </Video> */}
                <Text>Stinivas</Text>
            </Modal>
        </Portal>
    )
}



const styles = StyleSheet.create({
    backarrowIcon: {
        resizeMode: 'contain',
        width: 12,
        marginLeft: 15
    },
    deleteIcon: {
        resizeMode: 'contain',
        width: 20,
    },
    previewImage: {
        flex: 1,
        resizeMode: 'contain',
        width: '100%',
        height: width / 1.5,
        marginBottom: 50,
    },
    header: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 5,
        marginHorizontal: 10
    },
    headerStart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1
    },
    headerEnd: {
        flex: 1,
        alignSelf: 'center',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    wrapper: {
        backgroundColor: '#111111',
        flex: 1,
    },
    uploadVideo1: {
        // marginHorizontal:5,
        // // alignItems:'center',
        // // width:width/2,
        // height:width/1.5,
        // borderRadius:10,
        // marginVertical:5,
        flex: 1,
        // resizeMode:'contain',
        width: '100%',
        height: height / 2,
        marginBottom: 50,
    },
})

export default ModalPreview;