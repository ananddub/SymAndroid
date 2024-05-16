import React, {useCallback, useEffect, useState} from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
import DropDown from './AComponent/DropwDown';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Path, Svg} from 'react-native-svg';
import {io} from 'socket.io-client';
import Modals from './AComponent/Modal';
import {CommonActions, useNavigation} from '@react-navigation/native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {Circle} from 'react-native-animated-spinkit';
import {url} from './GlobalVariable';
import RNFS from 'react-native-fs';
import {Uparrow} from '../assets/SVG';
// const socket = io('https://reactnativebackendnew.onrender.com');
// const url = 'http://192.168.1.6:4000';
// const url = 'http://3.110.47.78:4000';

// const url = 'https://reactnativebackendnew.onrender.com';

export default function Searching() {
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
  const secarr = ['ALL', 'A', 'B', 'C', 'D'];
  const [classindex, setClassIndex] = useState<number>(-1);
  const [secindex, setSecIndex] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [list, setList] = useState<any[]>([]);
  const [mainlist, setMainlist] = useState<any[]>([]);
  const [lcheck, setLcheck] = useState<Array<boolean>>(new Array(0));
  const [mcheck, setMcheck] = useState<boolean>(true);
  const [textmsg, setTextmsg] = useState<string>('');
  const [succes, setSucces] = useState<boolean>(false);
  const [spin, setSpin] = useState<boolean>(false);
  const [emsgVisible, setEmsgVisible] = useState<boolean>(false);
  const [errmsg, setErrmsg] = useState<string>('');
  const navigation = useNavigation();
  const [fileResponse, setFileResponse] = useState<any>([]);

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);
  //   fetch()
  const sendData = (name: string) => {
    const form = new FormData();

    form.append('document', {
      name: name,
      type: fileResponse[0].type,
      uri: fileResponse[0].uri,
    });
    fetch(`${url}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: form,
    }).then(e => console.log(name));
  };
  useEffect(() => {
    if (classindex > -1) {
      console.log('rerender ', classindex);
      setList([]);
      setSpin(true);
      const query = `${url}/searchstd?class=${classarr[classindex]}&sec=${
        secindex > 0 ? secarr[secindex] : 'null'
      }&roll=${text.length > 0 ? text : 'null'}`;
      console.log(query);
      fetch(query)
        .then((response: any) => {
          if (response.status === 200) {
            response.json().then((data: any) => {
              setList(data);
              setLcheck(new Array(data.length).fill(false));
              setSpin(false);
              console.log(data);
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
  }, [classindex, secindex, text]);
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
  useEffect(() => {
    if (succes) {
      setTextmsg('');
      setFileResponse([]);
    }
  }, [succes]);
  const onSubmit = () => {
    let date: string = `${new Date()}`;
    date = date.replaceAll(' ', '_');
    date = date.replaceAll(':', '_');
    date = date.replaceAll('+', '_');

    console.log(date);
    const socket = io(url);
    if (classindex === -1) {
      // setEFlags(true);
      setErrmsg('please select class');
      setEmsgVisible(true);
    } else if (textmsg.length === 0) {
      setErrmsg('please enter message');
      setEmsgVisible(true);
    } else if (
      mcheck === false &&
      lcheck.filter(x => x === true).length === 0
    ) {
      setErrmsg('please select students');
      setEmsgVisible(true);
    } else {
      if (classindex === 0) {
        if (fileResponse.length > 0) {
          const type = fileResponse[0].type.split('/')[1];
          const name = `${date}.${type}`;
          console.log('type :', type);
          sendData(name);
        }
        const obj = {
          message: textmsg,
          to: ['all'],
          from: 'admin',
          class: '',
          sec: '',
          file:
            fileResponse.length > 0
              ? `${date}.${fileResponse[0].type.split('/')[1]}`
              : '',
        };

        socket.emit('admin', obj);
        setSucces(true);
      } else if (classindex > 0) {
        setMainlist([]);
        setList([]);
        if (mcheck === true) {
          if (fileResponse.length > 0) {
            const type = fileResponse[0].type.split('/')[1];
            console.log('type :', type);
            sendData(`${date}.${type}`);
          }
          const obj = {
            message: textmsg,
            to: classarr[classindex],
            from: 'admin',
            class: classarr[classindex],
            sec:
              secindex == 0 ? secarr[secindex].toLowerCase() : secarr[secindex],
            file:
              fileResponse.length > 0
                ? `${date}.${fileResponse[0].type.split('/')[1]}`
                : '',
          };
          socket.emit('admin', obj);
          setSucces(true);
        } else {
          const arr = lcheck
            .map((x, i) => (x === true ? list[i].admno : false))
            .filter(x => x);
          const classar = lcheck
            .map((x, i) => (x === true ? list[i].class : false))
            .filter(x => x);
          const sec = lcheck
            .map((x, i) => (x === true ? list[i].section : false))
            .filter(x => x);
          const roll = lcheck
            .map((x, i) => (x === true ? list[i].roll : false))
            .filter(x => x);
          const fname = lcheck
            .map((x, i) => (x === true ? list[i].fname : false))
            .filter(x => x);
          const name = lcheck
            .map((x, i) => (x === true ? list[i].name : false))
            .filter(x => x);
          if (fileResponse.length > 0) {
            const type = fileResponse[0].type.split('/')[1];
            console.log('type :', type);
            sendData(`${date}.${type}`);
          }
          const obj = {
            message: textmsg,
            to: arr,
            from: 'admin',
            class: null,
            sec: null,
            mclass: classar,
            msec: sec,
            mroll: roll,
            name: name,
            fname: fname,
            file:
              fileResponse.length > 0
                ? `${date}.${fileResponse[0].type.split('/')[1]}`
                : '',
          };
          console.log(arr);
          socket.emit('admin', obj);
          setSucces(true);
        }
      }
    }
  };
  return (
    <View
      style={{
        width: width,
        height: '100%',
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
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            paddingHorizontal: 30,
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#17d09f',
              borderRadius: 20,
              paddingLeft: 10,
            }}>
            <View
              style={{
                width: '100%',
                height: 200,
                backgroundColor: 'white',
                flexDirection: 'Column',
                borderRadius: 20,
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: '500',
                  color: 'black',
                  textAlign: 'center',
                }}>
                Success!
              </Text>
              <Text
                style={{
                  fontWeight: '500',
                  color: 'gray',
                  textAlign: 'center',
                  flexDirection: 'column',
                }}>
                The operation was completed
              </Text>
              <Text style={{color: 'gray'}}>successful.</Text>
              <TouchableOpacity
                onPress={() => {
                  setSucces(false);
                }}>
                <Text
                  style={{
                    backgroundColor: '#E9ECEF',
                    color: 'black',
                    padding: 10,
                    fontSize: 15,
                    fontWeight: '500',
                    borderRadius: 10,
                  }}>
                  continue
                </Text>
              </TouchableOpacity>
            </View>
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
          style={{flex: 1, justifyContent: 'center'}}
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
            backgroundColor: 'white',
          }}>
          Annoucment
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ANotice');
          }}
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}>
          <Image
            style={{
              height: 22,
              width: 22,
            }}
            source={require('../assets/archive.png')}
          />
        </TouchableOpacity>
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
        <View
          style={{
            borderBottomWidth: 1,
            height: 30,
            borderColor: 'gray',
            paddingHorizontal: 10,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: 'black',
              textAlign: 'left',
              fontSize: 14,
              backgroundColor: 'white',
              flex: 2,
            }}>
            Name
          </Text>

          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 14,
              backgroundColor: 'white',
              flex: 1,
            }}>
            Section
          </Text>
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              fontSize: 14,
              backgroundColor: 'white',
              flex: 1,
            }}>
            Roll
          </Text>
          <View
            style={{
              flex: 0.4,
              backgroundColor: 'white',
            }}>
            <BouncyCheckbox
              size={25}
              fillColor="#1c9cf7"
              unFillColor="#FFFFFF"
              text=""
              isChecked={mcheck}
              iconStyle={{borderColor: 'red'}}
              innerIconStyle={{borderWidth: 2}}
              textStyle={{fontFamily: 'JosefinSans-Regular'}}
              onPress={(isChecked: boolean) => {
                console.log(isChecked);
                setMcheck(isChecked);
                setLcheck(new Array(list.length).fill(isChecked));
              }}
            />
          </View>
        </View>

        {spin && (
          <View
            style={{
              height: 100,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              flex: 1,
              flexDirection: 'row',
            }}>
            <ActivityIndicator size="large" color="#1c9cf7" />
          </View>
        )}
        <FlatList
          style={{flex: 1, backgroundColor: 'white'}}
          data={list}
          renderItem={({item, index}: any) => {
            return (
              <View
                style={{
                  backgroundColor: 'white',
                  flex: 3,
                  borderBottomWidth: 1,
                  borderColor: '#E9ECEF',
                }}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: '#E9ECEF',
                    paddingHorizontal: 10,
                    alignContent: 'center',
                    minHeight: 40,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: 'gray',
                      textAlign: 'left',
                      textAlignVertical: 'center',

                      fontSize: 16,
                      backgroundColor: 'white',
                      flex: 2,
                    }}>
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      color: 'gray',
                      textAlign: 'center',
                      fontSize: 16,
                      textAlignVertical: 'center',

                      backgroundColor: 'white',
                      flex: 1,
                    }}>
                    {item.section}
                  </Text>
                  <Text
                    style={{
                      color: 'gray',
                      textAlign: 'center',
                      fontSize: 16,
                      textAlignVertical: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white',
                      flex: 1,
                    }}>
                    {item.roll}
                  </Text>
                  <View
                    style={{
                      flex: 0.4,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                    }}>
                    <BouncyCheckbox
                      size={25}
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
                  </View>
                </View>
              </View>
            );
          }}
        />
        <KeyboardAvoidingView>
          {fileResponse.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 4,
                paddingVertical: 5,
                backgroundColor: 'white',
                paddingHorizontal: 6,
              }}>
              <TouchableOpacity
                onPress={() => {
                  setFileResponse([]);
                }}>
                <Text
                  style={{
                    color: 'black',
                    backgroundColor: '#E9ECEF',
                    paddingHorizontal: 10,
                    borderRadius: 5,
                  }}>
                  {fileResponse[0].name}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 4,
              paddingVertical: 5,
              backgroundColor: 'white',
              paddingHorizontal: 6,
            }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#E9ECEF',
                padding: 13,
                borderRadius: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={handleDocumentSelection}>
              <Image
                style={{
                  height: 20,
                  width: 20,
                }}
                source={require('../assets/attach.png')}
              />
            </TouchableOpacity>
            <TextInput
              style={{
                backgroundColor: '#E9ECEF',
                paddingHorizontal: 20,
                paddingVertical: 10,
                color: 'black',
                borderRadius: 30,
                maxHeight: 80,
                flex: 1,
                fontSize: 15,
                textAlignVertical: 'center',
              }}
              cursorColor={'black'}
              onChangeText={e => setTextmsg(e.trim())}
              multiline={true}
              placeholderTextColor={'gray'}
            />

            <TouchableOpacity
              style={{
                height: 45,
                width: 45,
                borderRadius: 1000,
                backgroundColor: '#17d09f',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={onSubmit}>
              <Uparrow color="white" width={30} height={20}></Uparrow>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      {/* 
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
      )} */}
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
