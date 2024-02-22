import React, { useEffect,useCallback,useState } from "react";
import {
    View,
    TouchableOpacity,
    Text,
    useWindowDimensions,
    StyleSheet,
    Dimensions, ActivityIndicator, Alert, Linking
} from "react-native";
import { connect } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { bindActionCreators } from "redux";
import { selectSong,setSongType,setSongs,setMagazineType } from '@actions';
import {
    OtrixContainer, OtrixHeader, OtrixDivider, OtirxBackButton, OtrixContent, OtrixLoader
} from '@component';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles, Colors } from '@helpers';
import Fonts from "@helpers/Fonts";
import getApi from "@apis/getApi";
import { logfunction } from "@helpers/FunctionHelper";
import RenderHtml from 'react-native-render-html';
import Pdf from 'react-native-pdf';
const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
let url='';
function MagazineScreen(props,{ route, navigation }) {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [pdfUrl, setPdfUrl] = useState('');
    const [percentage, setPercentage] = useState(0);

    const [state, setState] = React.useState({ content: [], loading: true, heading: null });
    const { content, heading, loading } = state;
    
    useFocusEffect(
        useCallback(() => {
            const { magazineType } = props.route.params;
            if(magazineType === 'vidyarthi-velugu'){
                url = 'https://vidhyarthigeethavali.com/uesi/magazines/vidyarthi-velugu/full-edition/09-2023.pdf';
            }else if(magazineType === 'campus-connect'){
                url = 'https://vidhyarthigeethavali.com/uesi/magazines/campus-connect/09-2023.pdf';
            }else if(magazineType === 'in-touch'){
                url = 'https://vidhyarthigeethavali.com/uesi/magazines/in-touch/09-2023.pdf';
            }else if(magazineType === 'our-field'){
                url = 'https://vidhyarthigeethavali.com/uesi/magazines/our-field/09-2023.pdf';
            }else{
                url = '';
            }
            setPdfUrl(url);
        //});
        //   async function fetchData() {
        //     //setToastMessage('');
        //       getApi.getData(  //getManufacturers
        //           "getSongsUpdate",
        //           [],
        //       ).then( async response => {
        //           if(response.status === 1){
        //             
        //             // await AsyncStorage.getItem('SONG_UPDATE_VERSION').then(data=>{
        //             //   if(Number(data) !== Number(response.data[0].version)){
        //             //      AsyncStorage.setItem('SONG_UPDATE_VERSION',response.data[0].version);
        //             //      callAPI();
        //             //   }
        //             // });
        //           }
        //       });
        //   }
        //   fetchData();
        }, [])
      )

    const { width } = useWindowDimensions();
    const tagsStyles = {
        p: {
            color: Colors().black,
            fontFamily: Fonts.Font_Reguler,
            fontSize: wp('3.5%'),
            lineHeight: hp('2.4%'),
        }
    };

    return (
        <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center'}}>
      {pdfUrl!==''?<Pdf
        trustAllCerts={false}
        source={{
          uri: pdfUrl,
        }}
        page={1}
        scale={1.0}
        minScale={0.5}
        maxScale={3.0}
        renderActivityIndicator={() => (
            <>
          <ActivityIndicator size="large" color={Colors().themeColor} />
          <Text style={{color:Colors().themeColor,fontSize:20, fontFamily:Fonts.Font_Reguler}}>{percentage}% Loaded...</Text>
          </>
        )}
        enablePaging={true}
        onLoadProgress={(percentage) => {
            setPercentage((percentage*100).toFixed(0));
        }}
        onLoadComplete={() => console.log('Loading Complete')}
        onPageChanged={(page, totalPages) => console.log(`${page}/${totalPages}`)}
        onError={(error) => console.log(error)}
        //onPageSingleTap={(page) => alert(page)}
        onPressLink={(link) => Linking.openURL(link)}
        onScaleChanged={(scale) => console.log(scale)}
        // singlePage={true}
        spacing={5}
        // horizontal
        style={{flex: 1, width: Dimensions.get('window').width}}
      />:null}
    </View>

    )
}

function mapStateToProps(state) {
    return {
        selectedSong: state.song.selectedSong,
        songType: state.song.songType,
        magazineType: state.song.magazineType
    }
  }
  
  const mapDispatchToProps = dispatch => (
    bindActionCreators({
        selectSong,
        setSongs,
        setSongType,
        setMagazineType
    }, dispatch)
  );

export default connect(mapStateToProps, mapDispatchToProps) (MagazineScreen);

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