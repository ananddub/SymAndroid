import {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  useWindowDimensions,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Pressable,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import SelectDropdown from 'react-native-select-dropdown';
import DropDown from './AComponent/DropwDown';
import {io} from 'socket.io-client';
import FileViewer from 'react-native-file-viewer';
import Modals from './AComponent/Modal';
import {Circle} from 'react-native-animated-spinkit';
import {url} from './GlobalVariable';
import RNFS from 'react-native-fs';
import WebView from 'react-native-webview';
// const url = 'https://reactnativebackendnew.onrender.com';
// const url = 'http://192.168.1.6:4000';
// const url = 'http://3.110.47.78:4000';

// const url = 'https://reactnativebackendnew.onrender.com';

const socket = io(url);
function ANotice(): JSX.Element {
  const {width, height, scale} = useWindowDimensions();
  const [tfocus, setTfocus] = useState<boolean>(false);
  const classarr = [
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
  const secarr = [
    'ALL',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];
  const [option, setOption] = useState<number>(-1);
  const [emsgVisible, setEmsgVisible] = useState<boolean>(false);
  const [msg, setMessage] = useState<string>('');
  const [textmsg, setTextMsg] = useState<string>('');
  const [classValue, setclassValue] = useState<number>(-1);
  const [succes, setSucces] = useState<boolean>(false);
  const [secValue, setSecValue] = useState<number>(-1);
  const [admno, setAdmno] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [eFlags, setEFlags] = useState<boolean>(false);
  const [spin, setSpin] = useState<boolean>(true);
  useEffect(() => {
    const socket = io(url);
    console.log('connecting to socket');
    setSpin(true);
    socket.on('connect', () => {
      console.log('connected');
      socket.emit('getAdminChat');
    });
    socket.on('getAdminStatus', (data: any) => {
      console.log('got admin status');
      socket.emit('getAdminChat');
    });
    socket.on('getAdminChat', async (msgvalue: any) => {
      console.log('is array', msgvalue);
      for (let x of msgvalue.data) {
        if (x.file != null && x.file) {
          const filepath = `${RNFS.TemporaryDirectoryPath}/${x.file}`;
          console.log('filepath', filepath);
          await RNFS.writeFile(filepath, x.imagepath, 'base64');
          x.file = encodeURI(`file:///${filepath}`);
          x.imagepath = '';
          console.log('filepath', x.file);
        }
      }
      console.log(msgvalue);
      setMessage(msgvalue.data);
      setSpin(false);
    });
    return () => {
      console.log('disconnecting from socket');
      socket.off('getAdminChat');
      socket.off('getAdmitStatus');
    };
  }, []);

  useEffect(() => {
    setError('');
  }, [option, classValue, secValue, admno]);
  return (
    <View
      style={{
        backgroundColor: '#F1F5F9',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      {spin && <ActivityIndicator size={'large'} color="black" />}
      <FlatList
        style={{
          width: '100%',
          alignContent: 'center',
          flexDirection: 'column',
        }}
        data={msg}
        renderItem={({item}: {item: any}) => {
          console.log('new ', item.to);
          let formattedDate = '';
          try {
            let dateStr = item?.date;
            let date = new Date(item.date);
            formattedDate = date.toISOString().split('T')[0];
            console.log('formdata :', formattedDate);
            item.filestatus =
              item.file.split('.')[2].trim() === 'jpg' ||
              item.file.split('.')[2].trim() === 'jpeg' ||
              item.file.split('.')[2].trim() === 'png';
          } catch (err: any) {
            console.log('error :', err.message);
            item.filestatu = false;
          }
          return (
            <View
              style={{
                borderRadius: 10,
                marginVertical: 5,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <View
                style={{
                  borderRadius: 10,
                  marginVertical: 5,
                  maxWidth: '90%',
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  elevation: 5,
                }}>
                {item.filestatus && (
                  <TouchableOpacity
                    onPress={() => {
                      FileViewer.open(item.file);
                    }}>
                    <Image
                      source={{uri: item.file}}
                      style={{
                        height: 200,
                        width: '100%',
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                      }}
                    />
                  </TouchableOpacity>
                )}
                {!item.filestatus && item.file && (
                  <TouchableOpacity
                    onPress={() => {
                      FileViewer.open(item.file);
                    }}>
                    <Text
                      style={{
                        height: 200,
                        width: '100%',
                        color: 'black',
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        fontWeight: 'bold',
                        fontSize: 40,
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                        backgroundColor: '#e9b51d',
                      }}>
                      {item.file.split('.')[2]}
                    </Text>
                  </TouchableOpacity>
                )}
                <View
                  style={{
                    paddingHorizontal: 10,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      columnGap: 20,
                      fontSize: 16,
                      fontWeight: '500',
                    }}>
                    To {item.name !== null ? item.name : item.to}
                  </Text>
                  {item.name !== null && (
                    <>
                      <View
                        style={{
                          width: '120%',
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginBottom: 10,
                        }}>
                        <Text
                          style={{
                            color: 'black',
                            flex: 1,
                            columnGap: 20,
                            fontSize: 12,
                            fontWeight: '500',
                          }}>
                          class {item.mclass}
                        </Text>
                        <Text
                          style={{
                            color: 'black',
                            flex: 1,
                            columnGap: 20,
                            fontSize: 12,
                            fontWeight: '500',
                          }}>
                          section {item.msec}
                        </Text>
                        <Text
                          style={{
                            color: 'black',
                            flex: 1,
                            columnGap: 20,
                            fontSize: 12,
                            fontWeight: '500',
                          }}>
                          roll {item.mroll}
                        </Text>
                      </View>
                      <Text
                        style={{
                          color: 'black',
                          flex: 1,
                          top: -10,
                          columnGap: 20,
                          fontSize: 14,
                          fontWeight: '500',
                        }}>
                        father's Name {item.fname}
                      </Text>
                    </>
                  )}
                  <Text style={{color: 'black'}}>{item.message}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    width: '100%',
                    flexDirection: 'row',
                    columnGap: 10,
                    paddingBottom: 5,
                    paddingRight: 10,
                  }}>
                  <Text style={{color: 'black', textAlign: 'right'}}>
                    {item.time}
                  </Text>
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'right',
                    }}>
                    {formattedDate}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
export default ANotice;
