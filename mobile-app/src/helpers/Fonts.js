import { I18nManager ,Platform} from 'react-native';

const Fonts = {
    // Font_Reguler:  I18nManager.isRTL === false ? 'Poppins-Regular' :  Platform.OS == 'ios' ? 'Droid Arabic Kufi'  : 'DroidKufi-Bold' ,
    // Font_Semibold: I18nManager.isRTL === false ? 'Poppins-Medium' : Platform.OS == 'ios' ? 'Droid Arabic Kufi'  : 'DroidKufi-Bold' ,
    // Font_Bold:  I18nManager.isRTL === false ? 'Poppins-Bold' : Platform.OS == 'ios' ? 'Droid Arabic Kufi'  : 'DroidKufi-Bold' ,
    Font_Reguler:  'Poppins-Regular',
    Font_Medium: 'Poppins-Medium',
    Font_Semibold: 'Poppins-SemiBold', 
    Font_Bold:  'Poppins-Bold'
}
export default Fonts;