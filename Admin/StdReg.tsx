import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  useWindowDimensions,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Modal,
  BackHandler,
  Pressable,
  StyleSheet,
} from 'react-native';
import DropDown from './AComponent/DropwDown';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Path, Svg} from 'react-native-svg';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import {io} from 'socket.io-client';
import Modals from './AComponent/Modal';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Circle} from 'react-native-animated-spinkit';
import {url} from './GlobalVariable';
// const socket = io('https://reactnativebackendnew.onrender.com');
// const url = 'http://3.110.47.78:4000';

// const url = 'https://reactnativebackendnew.onrender.com';

export default function StdReg() {
  const {width, height} = useWindowDimensions();
  const classarr = [
    'All',
    'NUR',
    'LKG',
    'UKG',
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
  ];
  const secarr = ['A', 'B', 'C', 'D'];
  const [classindex, setClassIndex] = useState<number>(-1);
  const [secindex, setSecIndex] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [totaldues, setTotalDues] = useState<number>(0);
  const [list, setList] = useState<any[]>([]);
  const [mainlist, setMainlist] = useState<any[]>([]);
  const [lcheck, setLcheck] = useState<Array<boolean>>(new Array(0));
  const [mcheck, setMcheck] = useState<boolean>(true);
  const [textmsg, setTextmsg] = useState<string>('');
  const [succes, setSucces] = useState<boolean>(false);
  const [spin, setSpin] = useState<boolean>(false);
  const [emsgVisible, setEmsgVisible] = useState<boolean>(false);
  const [tap, setTap] = useState<number>(0);
  const [errmsg, setErrmsg] = useState<string>('');
  const navigation = useNavigation();
  //   fetch()
  useEffect(() => {
    if (classindex > -1) {
      console.log('rerender ', classindex);
      setList([]);
      setSpin(true);
      setTotalDues(0);
      // dues?class=NUR&section=A
      const query = `${url}/dues?class=${classarr[classindex]}&section=${secarr[secindex]}`;
      console.log(query);
      fetch(query)
        .then((response: any) => {
          if (response.status === 200) {
            response.json().then((data: any) => {
              setList(data.data);
              setMainlist(data.data);
              setText('');
              setLcheck(new Array(data.data.length).fill(false));
              setSpin(false);
              console.log(data.data);
              data = data.data;
              const total = data.reduce((a: any, b: any) => {
                console.log('dues :', a, b);
                return a + b.total;
              }, 0);
              setTotalDues(total);
              console.log(typeof data);
            });
          } else if (response.status === 404) {
            setList([]);
            setSpin(false);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
      console.log('rerender1');
    }
  }, [classindex]);
  useEffect(() => {
    console.log('secindex', secindex);
    if (secindex === 0) {
      setList(mainlist);
    } else if (secindex > 0 && text === '') {
      const sec = secarr[secindex];
      const arr = mainlist.filter((x: any) => x.basic.section === sec);
      console.log('arr ', arr);
      const total = arr.reduce((a: any, b: any) => {
        console.log('dues :', a, b);
        return a + b.total;
      }, 0);
      setTotalDues(total);
      setList(arr);
    }
    if (text !== '') {
      const sec = secarr[secindex];

      const arr = mainlist.filter(
        (x: any) =>
          (x.section === sec || secindex === 0) &&
          text.trim() === `${x.basic.roll}`,
      );
      const total = arr.reduce((a: any, b: any) => {
        console.log('dues :', a, b);
        return a + b.total;
      }, 0);
      setTotalDues(total);
      setList(arr);
    }
  }, [secindex, text]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', (): boolean => {
      navigation.navigate('AHome');
      return true;
    });

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', (): boolean => {
        return true;
      });
    };
  }, []);
  const onSubmit = () => {};
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: 'white',
      }}>
      <Modals
        text={errmsg}
        visible={emsgVisible}
        setVisible={setEmsgVisible}></Modals>
      <Modal
        animationType="fade"
        visible={succes}
        transparent={true}
        onRequestClose={() => {
          setSucces(false);
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
              flexDirection: 'Column',
              borderRadius: 20,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: '#4B5563',
                textAlign: 'center',
              }}>
              Send Successfully
            </Text>
            <TouchableOpacity
              onPress={() => setSucces(false)}
              style={{
                width: 200,
                height: 50,

                backgroundColor: '#32AD29',
                borderRadius: 25,
                elevation: 32,
                shadowColor: '#32AD29',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: '400',
                  color: 'white',
                  textAlign: 'center',
                }}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: 'white',
          flex: 0.2,
          flexDirection: 'row',
          paddingHorizontal: 10,
        }}>
        <TouchableOpacity
          style={{justifyContent: 'center'}}
          onPress={() =>
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'AHome'}],
              }),
            )
          }>
          <Svg width={40} height={40} viewBox="0 0 16 16" fill="none">
            <Path
              d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"
              fill="black"
            />
          </Svg>
        </TouchableOpacity>
        <Text
          style={{
            color: 'black',
            flex: 1,

            textAlignVertical: 'center',
            textAlign: 'center',
            fontWeight: '500',
            fontSize: 18,
          }}>
          Student Rejister
        </Text>
      </View>
      <View
        style={{
          width: width,
          marginTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 10,
          columnGap: 10,
          flexDirection: 'row',
        }}>
        <DropDown
          arr={classarr}
          text="Select class"
          fun={(value: number) => {
            setClassIndex(value);
            console.log('classindex ', classindex);
          }}
        />
        <DropDown
          arr={secarr}
          text={secarr[secindex]}
          fun={(value: number) => {
            console.log('secindex', secindex);
            setSecIndex(value);
          }}
        />
        <TextInput
          style={{
            flex: 1,
            height: 40,
            backgroundColor: '#E9ECEF',
            borderRadius: 10,
            paddingHorizontal: 10,
            fontSize: 13,
            color: 'gray',
          }}
          onChangeText={e => setText(e.trim())}
          value={text}
          cursorColor={'gray'}
          keyboardType="numeric"
          placeholderTextColor={'gray'}
          placeholder="Enter Roll"
        />
      </View>
      <View
        style={{
          backgroundColor: 'white',
          flex: 3,
          borderBottomWidth: 1,
          borderColor: '#E9ECEF',
        }}>
        <FlatList
          data={list}
          style={{
            flex: 1,
            marginBottom: 40,
            backgroundColor: 'white',
          }}
          renderItem={({item, index}: any) => {
            return (
              <Pressable
                onPress={() => {
                  setTap(index);
                }}
                style={{
                  backgroundColor: tap == index ? '#f1f5f9' : 'white',
                  borderBottomWidth: 1,
                  paddingLeft: 10,
                  borderColor: '#E9ECEF',
                  width: '100%',
                  gap: 2,
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                  }}>
                  <View
                    style={{
                      width: 80,
                      height: 80,
                    }}>
                    <Image
                      source={
                        item.image !== ''
                          ? {uri: `data:image/jpeg;base64,${item.image}`}
                          : require('../assets/user.png')
                      }
                      style={{
                        backgroundColor: 'white',
                        width: 70,
                        height: 70,
                        borderRadius: 100 / 2,
                        marginRight: 30,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 1,
                    // backgroundColor: 'red',
                    paddingVertical: 10,
                  }}>
                  <View
                    style={{
                      flex: 2,
                      gap: 11,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.text}>Name</Text>
                    <Text style={styles.text}>{item.basic.name}</Text>
                  </View>

                  <View
                    style={{
                      flex: 2,
                      gap: 11,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        gap: 11,
                      }}>
                      <Text style={styles.text}>Admno</Text>
                      <Text style={styles.text}>{item.admno}</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      gap: 11,
                    }}>
                    <Text style={styles.text}>Class</Text>
                    <Text style={styles.text}>
                      {item.basic.class},{item.basic.section},{item.basic.roll}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      gap: 11,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.text}>F.Name</Text>
                    <Text style={styles.text}>{item.basic.name}</Text>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      gap: 11,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.text}>Mob</Text>
                    <Text style={styles.text}>{item.basic.fmob}</Text>
                  </View>
                  <View
                    style={{
                      flex: 2,
                      gap: 11,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.text}>Total Dues</Text>
                    <Text style={(styles.text, {color: 'red'})}>
                      ₹{item.total}
                    </Text>
                  </View>
                </View>
                <BouncyCheckbox
                  size={25}
                  style={{
                    alignContent: 'center',
                    justifyContent: 'flex-end',
                  }}
                  fillColor="#1c9cf7"
                  unFillColor="#FFFFFF"
                  text=""
                  isChecked={mcheck === true ? true : lcheck[index]}
                  iconStyle={{borderColor: 'red'}}
                  innerIconStyle={{borderWidth: 2}}
                  textStyle={{fontFamily: 'JosefinSans-Regular'}}
                  onPress={(isChecked: boolean) => {
                    console.log(index);
                    lcheck[index] = !lcheck[index];
                  }}
                />
              </Pressable>
            );
          }}
        />
      </View>

      {spin && (
        <View
          style={{
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'center',
            top: height / 3,
            left: width / 2.5,
            alignItems: 'center',
          }}>
          <Circle size={100} color="black"></Circle>
        </View>
      )}
      {spin === false && list.length === 0 && (
        <View
          style={{
            position: 'absolute',
            flexDirection: 'column',
            justifyContent: 'center',
            top: height / 3,
            width: width,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'gray',
              textAlign: 'center',
              fontSize: 30,
            }}>
            {classindex === 0 ? 'All Stduent Selected' : 'No Data'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: 'gray',
    fontSize: 13,
  },
});
