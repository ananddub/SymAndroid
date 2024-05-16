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
  Alert,
  Button,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import DropDown from './AComponent/DropwDown';
import {CameraIcon, GalleryIcon} from '../assets/SVG';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {Path, Svg} from 'react-native-svg';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import {BackHandler} from 'react-native';
import {io} from 'socket.io-client';
import {openFile} from 'react-native-open-file';
import ImagePicker from 'react-native-image-crop-picker';
import Modals from './AComponent/Modal';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {
  launchImageLibrary,
  launchCamera,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {AppRegistry} from 'react-native';

import FileViewer from 'react-native-file-viewer';

import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Linking, Share} from 'react-native';
import {Circle} from 'react-native-animated-spinkit';
// import RNFS from "react-native-fs";0
import RNFS from 'react-native-fs';
import {url} from './GlobalVariable';

// const socket = io('https://reactnativebackendnew.onrender.com');
// const url = 'http://192.168.1.6:4000';
const idcreate = (item: any) => {
  return `     <div id="card">
                        <img src=${
                          item.imagepath !== ''
                            ? 'data:image/jpeg;base64,' + item.imagepath
                            : '../assets/user.png'
                        } 
                            width="120px" 
                            height="120px"   
                        class="bg-gray-300 rounded-full"
                        alt="" srcset="">
                        <div id="details"> 
                            <div class="dm">
                                <p class="dom">Name</p>
                                <p class="nom">${item.name}</p>
                            </div>
                            <div class="dm">
                                <p class="dom">class </p>
                                <p class="nom">${item.class},${item.section},${
    item.roll
  }</p>
                            </div>
                            <div class="dm">
                                <p class="dom">F.Name</p>
                                <p class="nom">${item.fname}</p>
                            </div>
                            <div class="dm">
                                <p class="dom">Address</p>
                                <p class="nom">${item.ptown}</p>
                            </div>
                            <div class="dm">
                                <p class="dom">Mob</p>
                                <p class="nom">${item.fmob}</p>
                            </div>
                        </div>
                        </div>`;
};
export default function IDCard() {
  const {width, height} = useWindowDimensions();
  const classarr = [
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
  const [lcheck, setLcheck] = useState<Array<boolean>>(new Array(0));
  const [mcheck, setMcheck] = useState<boolean>(true);
  const [succes, setSucces] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [emsgVisible, setEmsgVisible] = useState<boolean>(false);
  const [spin, setSpin] = useState<boolean>(false);
  const [errmsg, setErrmsg] = useState<string>('');
  const [update, setUpdate] = useState<boolean>(false);
  const navigation = useNavigation();
  const [trecord, setTrecord] = useState<number>(0);
  const [ptotal, setPtotal] = useState<number>(0);
  const [mainlist, setMainlist] = useState<any[]>([]);
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

  const generatePDF = async () => {
    try {
      let str = '';
      list.forEach((x: any) => {
        str += idcreate(x);
      });
      const html = `<html>
          <style>
              #card{
                  display: flex;
                  flex: 1;
                  flex-direction: row;
                  outline-width: 2px;
                  outline-color: gray;
                  padding: 8px;
                  gap: 10px;
                  height: 300px;
                  width: 500px;
                  outline-style: solid;
                  border-radius: 20px;
              }
              .dm{
                  display: flex;
                  flex-direction: row;
                  gap: 10px;
                  height: 30px;
                  color:#2B2B2B ;
              }
              #details{
                  display: flex;
                  flex-direction: column;
                  margin
              }
              #mcontainer{
                  display: flex;
                  flex-direction: column;
                  gap: 10px;
                  align-items: center;
                  color:#2B2B2B ;
              }
             
              img{
                  border-radius: 100%;
              }
          </style>
            <body>
                <div id="mcontainer">
                    <h1 style="color: #2B2B2B;" >Class ${classarr[classindex]}  Sec ${secarr[secindex]}</h1>
                    ${str}
            </div>
            </body>
      </html>`;
      const options = {
        html,
        fileName: `${classarr[classindex]}${secarr[secindex]}`,

        directory: 'PDF',
      };
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const file: any = await RNHTMLtoPDF.convert(options);
      let filePath = file.filePath;
      console.log([filePath, RNFS.DocumentDirectoryPath]);
      const stats = await RNFS.stat(filePath);
      if (stats.isFile()) {
        const path = `${RNFS.ExternalStorageDirectoryPath}/Documents/${classarr[classindex]}${secarr[secindex]}.pdf`;
        try {
          await RNFS.copyFile(filePath, path);
        } catch (e) {
          console.log(e);
        }
        console.log('moved file to ', path);
        console.log('completed');
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        FileViewer.open(filePath)
          .then(() => {
            console.log('open file success');
          })
          .catch((e: any) => {
            setTitle(
              `Saved In Document ${classarr[classindex]}${secarr[secindex]}.pdf`,
            );
            setSucces(true);
            console.log('Error: The source path is not a file.', [path]);
          });
      } else {
        setTitle(
          `Saved In Document ${classarr[classindex]}${secarr[secindex]}.pdf`,
        );
        setSucces(true);
        console.log('Error: The source path is not a file.');
      }
      //   await FileViewer.open(filePath);
    } catch (error: any) {
      setTitle(
        `Saved In Document ${classarr[classindex]}${secarr[secindex]}.pdf`,
      );
      setSucces(true);
      console.log('last Error: The source path is not a file.');
      console.log(error);
    }
  };
  const handleCameraPicker = (admno: string) => {
    ImagePicker.openCamera({
      width,
      height: 400,
      cropping: true,
    })
      .then((image: any) => {
        console.log('camera ', image);
        uploadData(image, admno);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const socket = io(url);
    console.log('conecting to socket');
    console.log(socket);
    socket.on('connect', () => {
      console.log('connected');
    });
    socket.on('getImage', (data: any) => {
      console.log('recived data from getImage');
      setSpin(false);
      setMainlist(data);
      setList(data);
    });
    if (classindex > -1) {
      setSpin(true);
      socket.emit('getImage', {
        class: classarr[classindex],
      });
      setList([]);
      setMainlist([]);
      console.log('rerender ', classindex);
      return () => {
        socket.disconnect();
        console.log('rerender ', classindex);
      };
    }
  }, [classindex, update]);

  useEffect(() => {
    const len = list.reduce((a, b) => {
      if (b.imagepath !== '') return a + 1;
      else return a;
    }, 0);
    setPtotal(len);
    console.log('photography done :', len);
  }, [list, classarr, secindex, text]);

  useEffect(() => {
    console.log('secindex', secindex);
    if (secindex === 0) {
      setList(mainlist);
    } else if (secindex > 0 && text === '') {
      const sec = secarr[secindex];
      const arr = mainlist.filter((x: any) => x.section === sec);
      console.log('arr ', arr);
      setList(arr);
    }
    if (text !== '') {
      const sec = secarr[secindex];
      const arr = mainlist.filter(
        (x: any) =>
          (x.section === sec || secindex === 0) && text.trim() === `${x.roll}`,
      );
      setList(arr);
    }
  }, [secindex, mainlist, text]);
  const uploadData = (image: any, admno: string) => {
    const form = new FormData();
    const obj = image;
    try {
      const names = obj.path.split('/').pop();
      const extension = names.slice(names.lastIndexOf('.') + 1);
      console.log(extension);
      const imageName = `${admno}.${extension}`;
      console.log('uploading process started ', admno);

      form.append('image', {
        uri: obj.path,
        type: obj.mime,
        name: imageName,
      });

      form.append('admno', admno);
      form.append('imagename', imageName);

      fetch(`${url}/imageupload`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: form,
      })
        .then((resp: any) => {
          try {
            if (resp.status === 200) {
              console.log('completed uploading');
              setTitle('Uploaded Successfully');
              // setSucces(true);
              setUpdate(!update);
            }
          } catch (err: any) {
            console.error('Error uploading image:');

            // setText(`Error : ${err.message}`);
          }
        })
        .catch((error: any) => {
          console.error('Error uploading image:', error);
          // setText(`Error : ${error.message}`);
        });
    } catch (err) {
      console.log(err);
    }
  };

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
              {title}
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
          ID Card
        </Text>
        <TouchableOpacity
          onPress={() => {
            if (list.length > 0) {
              generatePDF();
            }
          }}
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'column',
            }}>
            <Image
              style={{
                height: 22,
                width: 22,
              }}
              source={require('../assets/export.png')}
            />
          </View>
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
            console.log('secindex ', secindex);
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
          alignItems: 'center',
          flexDirection: 'column',
          borderBottomWidth: 1,
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Text
            style={{
              flex: 1,
              textAlign: 'left',
              color: 'black',
              fontSize: 13,
              fontWeight: '500',
            }}>
            <Text style={{color: 'black', fontWeight: '500'}}>
              Total Record
            </Text>{' '}
            {list.length}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              flex: 1,
              color: 'red',
              fontSize: 13,
              fontWeight: 'bold',
            }}>
            <Text style={{color: 'black', fontWeight: '500'}}>Photos Left</Text>{' '}
            {list.length - ptotal}
          </Text>
          <Text
            style={{
              flex: 1,
              textAlign: 'right',
              color: 'green',
              fontSize: 13,
              fontWeight: 'bold',
            }}>
            <Text style={{color: 'black', fontWeight: '500'}}>Photos Done</Text>{' '}
            {ptotal}
          </Text>
        </View>
      </View>
      {spin && (
        <View
          style={{
            marginTop: 10,
          }}>
          <ActivityIndicator size="large" color="black" />
        </View>
      )}
      <FlatList
        style={{flex: 1, maxHeight: '90%'}}
        data={list}
        renderItem={({item, index}: any) => {
          return (
            <View
              style={{
                backgroundColor: 'white',
                flex: 3,
                borderWidth: 1,
                borderColor: '#E9ECEF',
              }}>
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#E9ECEF',
                  paddingHorizontal: 10,
                  alignContent: 'center',
                  paddingVertical: 10,
                  minHeight: 40,

                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    backgroundColor: 'white',
                    width: 90,
                    height: 90,
                  }}>
                  <Image
                    source={
                      item.imagepath !== ''
                        ? {uri: `data:image/jpeg;base64,${item.imagepath}`}
                        : require('../assets/user.png')
                    }
                    style={{
                      backgroundColor: 'white',
                      width: 80,
                      height: 80,
                      borderRadius: 100 / 2,
                      marginRight: 30,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      handleCameraPicker(item.admno);
                      // openCamera(item.admno);
                      console.log(item.admno);
                    }}
                    style={{
                      padding: '10%',
                      position: 'absolute',
                      backgroundColor: 'black',
                      borderRadius: 50,
                      left: '48%',
                      bottom: '0%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <CameraIcon
                      color="white"
                      width={20}
                      height={20}
                      style={{}}></CameraIcon>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flex: 1,
                  }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                    }}>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        fontSize: 14,
                        flex: 0.8,
                      }}>
                      Name
                    </Text>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        fontSize: 14,
                        flex: 3,
                      }}>
                      {item.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.8,
                      flexDirection: 'row',
                      backgroundColor: 'white',
                    }}>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        fontSize: 14,
                        flex: 0.8,
                      }}>
                      Class
                    </Text>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        fontSize: 14,
                        flex: 3,
                      }}>
                      {item.class},{item.section},{item.roll}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: 'white',
                    }}>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        fontSize: 14,
                        flex: 0.8,
                      }}>
                      F.Name
                    </Text>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        fontSize: 14,
                        flex: 3,
                      }}>
                      {item.fname}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: 'white',
                    }}>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        fontSize: 14,
                        flex: 0.8,
                      }}>
                      Add
                    </Text>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        fontSize: 14,
                        flex: 3,
                      }}>
                      {item.ptown}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      backgroundColor: 'white',
                    }}>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        fontSize: 14,
                        flex: 0.8,
                      }}>
                      Mob
                    </Text>
                    <Text
                      style={{
                        color: 'gray',
                        textAlign: 'left',
                        backgroundColor: 'white',
                        fontSize: 14,
                        flex: 3,
                      }}>
                      {item.fmob}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />

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
              fontStyle: 'italic',
              textAlign: 'center',
              fontSize: 40,
            }}>
            {classindex === -1 ? 'Select Class' : 'No Data '}
          </Text>
        </View>
      )}
    </View>
  );
}
