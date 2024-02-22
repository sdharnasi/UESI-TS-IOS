import { types } from "../Action/actionTypes";
import { logfunction } from "../../helpers/FunctionHelper";

const initialState = {
    selectedSong: {},
    songType:'',
    selectedSongsList:[],
    magazineType:'',
    songsDonated:'',
    triconType:'',
    paymentModuleType:'',
    reloginVerified:''
}
export default (state = initialState, action) => {

    const { payload } = action;
    switch (action.type) {
        case "SONG_TYPE": {
            return { ...state, songType:payload.data };
        }
        case "MAGAZINE_TYPE": {
            return { ...state, magazineType:payload.data };
        }
        case "SELECT_SONG": {
            return { ...state, selectedSong:payload.data };
        }
        case "SET_SONGS_DONATED": {
            return { ...state, songsDonated:payload.data };
        }
        case "SELECTED_SONGS_LIST": {
            return { ...state, selectedSongsList:payload.data };
        }
        case "NEXT_SONG": {
            let song = {};
            return { ...state, selectedSong: song };
        }
        case "PREVIOUS_SONG": {
            return { ...state, selectedSong: song };
        }
        case "TRICON_TYPE": {
            return { ...state, triconType:payload.data };
        }
        case "PAYMENT_MODULE_TYPE": {
            return { ...state, paymentModuleType:payload.data };
        }
        case "RELOGIN_VERIFIED": {
            return { ...state, reloginVerified:payload.data };
        }
        default: {
            return state;
        }
    }
  };
