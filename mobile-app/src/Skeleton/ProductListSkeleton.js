import React from "react";
import {
    View,
    TouchableOpacity,
} from "react-native";

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from '@helpers';
import { ScrollView } from "native-base";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

function ProductListSkeleton() {
    return (
        <SkeletonPlaceholder>


            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: hp('5%')
            }}>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('30%') }}>
                </View>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: hp('5%'),
                marginTop: hp('2%')
            }}>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('30%') }}>
                </View>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: hp('5%'),
                marginTop: hp('2%')
            }}>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('30%') }}>
                </View>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
            </View>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginHorizontal: hp('5%'),
                marginTop: hp('2%')
            }}>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
                <View style={{ height: hp('0%'), width: wp('30%') }}>
                </View>
                <View style={{ height: hp('25%'), width: wp('45%') }}>
                </View>
            </View>

            <View style={{
                marginTop: hp('2%'),
                flexDirection: 'row',
                marginLeft: wp('2%'),
            }}>
                {
                    [1, 2, 3, 4, 5, 6].map((item) =>
                        <View
                            key={item}
                            style={{
                                height: hp('8.5%'),
                                width: wp('15%'),
                                marginHorizontal: wp('1%'),
                                borderRadius: 5,
                            }}>
                            <View style={{
                                backgroundColor: Colors().light_white,
                                height: hp('7..5%'),
                            }}>

                            </View>
                        </View>
                    )
                }
            </View>
        </SkeletonPlaceholder>
    )
}

export default ProductListSkeleton;
