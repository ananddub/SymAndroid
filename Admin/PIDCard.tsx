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
  StyleSheet,
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
                                <p class="dom">EmpID </p>
                                <p class="nom">${item.empid}</p>
                            </div>
                            <div class="dm">
                                <p class="dom">Name</p>
                                <p class="nom">${item.name}</p>
                            </div>
                           
                            <div class="dm">
                                <p class="dom">F.Name</p>
                                <p class="nom">${item.fname}</p>
                            </div>
                            <div class="dm">
                                <p class="dom">Designation</p>
                                <p class="nom">${item.designation}</p>
                            </div>
                            <div class="dm">
                                <p class="dom">Mob</p>
                                <p class="nom">${item.mob}</p>
                            </div>
                        </div>
                        </div>`;
};
export default function PIDCard() {
  const {width, height} = useWindowDimensions();
  const [text, setText] = useState<string>('');
  const [succes, setSucces] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true);
  const [list, setList] = useState<[]>([]);
  const [title, setTitle] = useState<string>('');
  const [emsgVisible, setEmsgVisible] = useState<boolean>(false);
  const [spin, setSpin] = useState<boolean>(true);
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
                    <h1 style="color: #2B2B2B;" >Employess List</h1>
                    ${str}
            </div>
            </body>
      </html>`;
      const options = {
        html,
        fileName: `Employees`,
        directory: 'PDF',
      };
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      const file: any = await RNHTMLtoPDF.convert(options);
      let filePath = file.filePath;
      console.log([filePath, RNFS.DocumentDirectoryPath]);
      const stats = await RNFS.stat(filePath);
      if (stats.isFile()) {
        const path = `${RNFS.ExternalStorageDirectoryPath}/Documents/Employees.pdf`;
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
            setTitle(`Saved In Document Employees.pdf`);
            setSucces(true);
            console.log('Error: The source path is not a file.', [path]);
          });
      } else {
        setTitle(`Saved In Document Employees.pdf`);
        setSucces(true);
        console.log('Error: The source path is not a file.');
      }
      //   await FileViewer.open(filePath);
    } catch (error: any) {
      setTitle(`Saved In Document Employees.pdf`);
      setSucces(true);
      console.log('last Error: The source path is not a file.');
      console.log(error);
    }
  };
  const handleCameraPicker = (empid: string) => {
    ImagePicker.openCamera({
      width,
      height: 400,
      cropping: true,
    })
      .then((image: any) => {
        console.log('camera ', image);
        uploadData(image, empid);
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    const socket = io(url);
    console.log('conecting to socket');
    setSpin(true);
    console.log(socket);
    socket.on('connect', () => {
      socket.emit('getEmpImage');
      console.log('connected');
    });
    socket.on('getEmpImage', (data: any) => {
      console.log('recived data from getImage');
      setSpin(false);
      setMainlist(data);
      setList(data);
    });
  }, [status]);
  useEffect(() => {
    if (list.length > 0) {
      setTrecord(list.length);
      const value = list.reduce((acc: number, item: any) => {
        console.log('imagepath :', item.imagepath.length);
        if (item.imagepath.length > 0) {
          return acc + 1;
        }
        return acc;
      }, 0);
      console.log(value);
      setPtotal(value);
    } else {
      setTrecord(0);
      setPtotal(0);
    }
  }, [list]);
  useEffect(() => {
    if (text.length > 0) {
      const data: any = text.toUpperCase();
      const isNum = !isNaN(data);
      const ls: any = mainlist.filter((item: any) => {
        const mob: string = item.mob;
        const name: string = item.name;
        if (isNum == true) return mob.startsWith(data);
        else return name.startsWith(data);
      });
      setList(ls);
    } else {
      const data: any = mainlist;
      setList(data);
    }
  }, [text]);

  useEffect(() => {}, [text]);
  const uploadData = (image: any, empid: string) => {
    const form = new FormData();
    const obj = image;
    try {
      const names = obj.path.split('/').pop();
      const extension = names.slice(names.lastIndexOf('.') + 1);
      console.log(extension);
      const imageName = `${empid}.jpg`;
      console.log('uploading process started ', empid);
      form.append('image', {
        uri: obj.path,
        type: obj.mime,
        name: imageName,
      });
      fetch(`${url}/empimageupload`, {
        method: 'POST',
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
              setUpdate(!update);
              setStatus(!status);
            }
          } catch (err: any) {
            console.error('Error uploading image:');
          }
        })
        .catch((error: any) => {
          console.error('Error uploading image:', error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      style={{
        width: width,
        height: '100%',
        backgroundColor: 'white',
      }}>
      <View
        style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          paddingVertical: 10,
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
        <TextInput
          style={{
            flex: 1,
            height: 40,
            marginHorizontal: 20,
            backgroundColor: '#E9ECEF',
            borderRadius: 10,
            paddingHorizontal: 10,
            fontSize: 13,
            color: 'gray',
          }}
          onChangeText={e => setText(e.trim())}
          value={text}
          cursorColor={'gray'}
          placeholderTextColor={'gray'}
          placeholder="Search by Name or Phone"
        />
        <TouchableOpacity
          onPress={() => {
            if (list.length > 0) {
              generatePDF();
            }
          }}
          style={{
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
              color: '#475569',
              fontSize: 13,
              fontWeight: '500',
            }}>
            <Text style={{color: '#475569', fontWeight: '500'}}>
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
            <Text style={{color: '#475569', fontWeight: '500'}}>
              Photos Left
            </Text>{' '}
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
            <Text style={{color: '#475569', fontWeight: '500'}}>
              Photos Done
            </Text>{' '}
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
            <View style={style.main}>
              <View style={style.imcm}>
                <View style={style.imageContainer}>
                  <Image
                    source={
                      item.imagepath !== ''
                        ? {uri: `data:image/jpeg;base64,${item.imagepath}`}
                        : require('../assets/user.png')
                    }
                    style={style.image}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      handleCameraPicker(item.empid);
                      console.log(item.empid);
                    }}
                    style={style.camera}>
                    <CameraIcon
                      color="white"
                      width={20}
                      height={20}
                      style={{}}></CameraIcon>
                  </TouchableOpacity>
                </View>
                <View style={{width: '100%'}}>
                  <View style={style.container}>
                    <Text style={style.title}>EmpID</Text>
                    <Text style={style.text}>{item.empid}</Text>
                  </View>
                  <View style={style.container}>
                    <Text style={style.title}>Name</Text>
                    <Text style={style.text}>{item.name}</Text>
                  </View>

                  <View style={style.container}>
                    <Text style={style.title}>F.Name</Text>
                    <Text style={style.text}>{item.fname}</Text>
                  </View>
                  <View style={style.container}>
                    <Text style={style.title}>Designation</Text>
                    <Text style={style.text}>{item.designation}</Text>
                  </View>
                  <View style={style.container}>
                    <Text style={style.title}>Mob</Text>
                    <Text style={style.text}>{item.mob}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  main: {
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 10,
    alignContent: 'center',
    flexDirection: 'row',
  },
  imcm: {
    borderBottomWidth: 1,
    borderColor: '#E9ECEF',
    paddingHorizontal: 10,
    alignContent: 'center',
    paddingVertical: 10,
    minHeight: 40,
    flexDirection: 'row',
  },
  imageContainer: {
    backgroundColor: 'white',
    width: 90,
    height: 90,
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
  },
  title: {
    color: '#1e293b',
    textAlign: 'left',
    fontSize: 14,
    width: 90,
    // width: 90, Remove this line
  },
  text: {
    color: '#475569',
    textAlign: 'left',
    backgroundColor: 'white',
    fontSize: 14,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    // width: 90, Remove this line
  },

  camera: {
    padding: '10%',
    position: 'absolute',
    backgroundColor: 'black',
    borderRadius: 50,
    left: '48%',
    bottom: '0%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: 'white',
    width: 80,
    height: 80,
    borderRadius: 100 / 2,
    marginRight: 30,
  },
});
