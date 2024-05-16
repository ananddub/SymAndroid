import {View, Text, Dimensions, Modal} from 'react-native';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {ScrollView, Image} from 'react-native';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Circle} from 'react-native-animated-spinkit';
import {useEffect, useState} from 'react';
import {Socket, io} from 'socket.io-client';

import Modals from './AComponent/Modal';
// 9631086222
function AHome() {
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;
  const [visible, setVisible] = useState(true);
  const [isErro, setError] = useState(false);
  const [text, setText] = useState('');
  const [data, setData] = useState<any>(undefined);
  const navigator = useNavigation();
  const [image, setImages] = useState<any>('');
  const [message, setMessage] = useState<number>(0);
  const [photography, setPhotography] = useState<boolean>(false);

  return (
    <View
      style={{
        height: height,
        width: width,
        backgroundColor: '#F1F5F9',
      }}>
      <View
        style={{
          width: width,
          flexDirection: 'row-reverse',
          paddingHorizontal: 30,
          paddingVertical: 10,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigator.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'ALogin'}],
              }),
            );
          }}
          style={{
            backgroundColor: '#ff8673',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 10,
            elevation: 3,
            shadowColor: '#94A3B8',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Logout</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* 1st part */}
        <View style={styles.flexdata}>
          <TouchableOpacity style={styles.box}>
            <Image
              source={require('../assets/user.png')}
              style={{
                width: 70,
                height: 70,
                top: -10,
              }}
            />
            <Text style={styles.text}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              navigator.navigate('Sealecting');
            }}>
            <Image
              source={require('../assets/annoucment.png')}
              style={{
                width: 100,
                height: 100,
                top: -10,
              }}
            />

            {/* </View> */}
            {/* <Icon name="campaign" size={30} color="#000" /> */}
            <Text style={styles.text}>Annoucment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setPhotography(true);
              // navigator.navigate('ID Card');
            }}
            style={styles.box}>
            <Image
              source={require('../assets/idcard.png')}
              style={{
                width: 70,
                height: 70,
                top: -10,
              }}
            />
            <Text style={styles.text}>ID Card</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="fade"
          visible={photography}
          transparent={true}
          onRequestClose={() => {
            // setVisible2(false);
            setPhotography(false);
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              paddingHorizontal: 30,
            }}>
            <View
              style={{
                width: '100%',
                height: 150,
                backgroundColor: '#F1F5F9',
                flexDirection: 'row',
                borderRadius: 20,
                paddingHorizontal: 5,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setPhotography(false);
                  navigator.navigate('ID Card');
                }}
                style={styles.box}>
                <Image
                  source={require('../assets/idcard.png')}
                  style={{
                    width: 70,
                    height: 70,
                    top: -10,
                  }}
                />
                <Text style={styles.text}>ID Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPhotography(false);
                  navigator.navigate('idCardsummary');
                }}
                style={{
                  width: '30%',
                  maxWidth: 150,
                  height: 100,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: '#F1F5F9',
                  elevation: 6,
                  shadowColor: '#94A3B8',
                }}>
                <Image
                  source={require('../assets/summary.png')}
                  style={{
                    width: 65,
                    height: 65,
                    top: -10,
                  }}
                />
                <Text style={styles.text}>Summary</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: '100%',
                height: 150,
                backgroundColor: '#F1F5F9',
                flexDirection: 'row',
                borderRadius: 20,
                paddingHorizontal: 5,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setPhotography(false);
                  navigator.navigate('ID Card');
                }}
                style={styles.box}>
                <Image
                  source={require('../assets/idcard.png')}
                  style={{
                    width: 70,
                    height: 70,
                    top: -10,
                  }}
                />
                <Text style={styles.text}>ID Card</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setPhotography(false);
                  navigator.navigate('idCardsummary');
                }}
                style={{
                  width: '30%',
                  maxWidth: 150,
                  height: 100,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: '#F1F5F9',
                  elevation: 6,
                  shadowColor: '#94A3B8',
                }}>
                <Image
                  source={require('../assets/summary.png')}
                  style={{
                    width: 65,
                    height: 65,
                    top: -10,
                  }}
                />
                <Text style={styles.text}>Summary</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.flexdata}>
          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              navigator.navigate('Dues');
            }}>
            <Image
              source={require('../assets/dues.png')}
              style={{
                width: 100,
                height: 100,
                top: -10,
              }}
            />
            <Text style={styles.text}>Dues</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              navigator.navigate('StdReg');
            }}>
            <Image
              source={require('../assets/list.png')}
              style={{
                width: 50,
                height: 50,
                top: -10,
              }}
            />
            <Text style={styles.text}>Std Reg</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 30}}></View>
      </ScrollView>
    </View>
  );
}

export default AHome;

const styles = StyleSheet.create({
  box: {
    width: '30%',
    maxWidth: 110,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#F1F5F9',
    elevation: 6,
    shadowColor: '#94A3B8',
  },
  flexdata: {
    width: '100%',
    height: 100,
    marginTop: '3%',
    backgroundColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderColor: 'white',
  },
  botomTap: {
    height: '95%',
    width: '24.6%',
    borderRadius: 5,
    backgroundColor: '',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: 'gray',
    position: 'absolute',
    bottom: 10,
  },
});
