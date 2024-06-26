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
import {Formik} from 'formik';
import * as Yup from 'yup';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {Linking, Share} from 'react-native';
import {Circle} from 'react-native-animated-spinkit';
// import RNFS from "react-native-fs";0
import RNFS from 'react-native-fs';
import {url} from './GlobalVariable';
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

// const socket = io('https://reactnativebackendnew.onrender.com');
// const url = 'http://192.168.1.6:4000';

export default function CreateUser() {
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
  const [invalidText, setInvalidText] = useState('');
  const [ptotal, setPtotal] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(true);
  const [user, setUser] = useState('');
  const [mainlist, setMainlist] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
  const validationSchema = Yup.object().shape({
    password: Yup.string().required('Password is required'),
    repassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Retype Password is required'),
  });
  const createUser = (value: any) => {
    const obj = {
      username: user,
      password: value.password,
    };
    fetch(`${url}/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    }).then(response => {
      if (response.status === 200) {
        console.log('Successfully updated');
        setStatus(!status);
        setModalVisible(false);
        setSpin(true);
        setUser('');
      } else {
        response.json().then(data => {
          console.log([data, response.status]);
        });
      }
    });
  };
  const deleteUser = () => {
    console.log('delete user', user);
    const obj = {
      username: user,
      password: '',
    };
    const queryurl = `${url}/admin/delete`;
    console.log(queryurl);
    fetch(queryurl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then(response => {
        if (response.ok) {
          console.log('Successfully deleted');
          setStatus(!status);
          setSpin(true);
          setDeleteModalVisible(false);
          setUser('');
        } else {
          return response.json().then(data => {
            console.log([data, response.status]);
            throw new Error(data.message || 'Error deleting user');
          });
        }
      })
      .catch(error => {
        console.error('Network or server error:', error);
      });
  };
  useEffect(() => {
    setSpin(true);
    setList([]);
    setMainlist([]);
    const query = `${url}/admin/${selectedUser === true ? 'Auser' : 'Nuser'}`;
    axios
      .get(query)
      .then(async (response: any) => {
        if (typeof response.data === 'string') {
          const value = `[${response.data}]`;
          console.log(typeof response.data, typeof value);
          const data1 = JSON.parse(value);
          try {
            console.log(data1[0].name);
            setMainlist(data1);
          } catch (e) {
            console.log(e);
          }
          setList(data1);
          setSpin(false);
        } else if (typeof response.data === 'object') {
          setMainlist(Array(response.data));
          setList(Array(response.data));
          setSpin(false);
        } else {
          setSpin(false);
        }
      })
      .catch(error => console.log(error));
  }, [status, selectedUser]);
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
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
            paddingVertical: 10,
          }}>
          <TouchableOpacity
            onPress={() => setSelectedUser(true)}
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor: selectedUser ? '#D3D3D3' : 'transparent',
            }}>
            <Text
              style={{
                textAlign: 'left',
                color: '#475569',
                fontSize: 13,
                fontWeight: '500',
              }}>
              Created User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedUser(false)}
            style={{
              padding: 10,
              borderRadius: 10,
              backgroundColor:
                selectedUser === false ? '#D3D3D3' : 'transparent',
            }}>
            <Text
              style={{
                textAlign: 'left',
                color: '#475569',
                fontSize: 13,
                fontWeight: '500',
              }}>
              Inactive User
            </Text>
          </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => {
                if (selectedUser === false) {
                  setUser(item.mob);
                  setModalVisible(true);
                } else {
                  setUser(item.mob);
                  setDeleteModalVisible(true);
                }
              }}
              style={style.main}>
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
            </TouchableOpacity>
          );
        }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              height: 'auto',
              backgroundColor: 'white',
              borderRadius: 10,
              elevation: 4,
            }}>
            <Text style={styles.modalText}>Create User</Text>
            <Text style={styles.modalDescription}>
              Fill the all fields for changing password
            </Text>
            <Formik
              initialValues={{
                username: '',
                password: '12345678',
                repassword: '12345678',
              }}
              validationSchema={validationSchema}
              onSubmit={(values: any) => {
                console.log(values);
                createUser(values);
              }}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View
                  style={{
                    gap: 10,
                    padding: 10,
                  }}>
                  <TextInput
                    style={[styles.input]}
                    editable={false}
                    value={user}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    // secureTextEntry={true}
                  />
                  {touched.password && errors.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                  <TextInput
                    style={styles.input}
                    placeholder="Retype Password"
                    onChangeText={handleChange('repassword')}
                    onBlur={handleBlur('repassword')}
                    value={values.repassword}
                    // secureTextEntry={true}
                  />
                  {touched.repassword && errors.repassword && (
                    <Text style={styles.errorText}>{errors.repassword}</Text>
                  )}
                  <View style={{width: '100%'}}>
                    <TouchableOpacity
                      style={styles.buttonContinue}
                      onPress={handleSubmit}>
                      <Text
                        style={[
                          styles.textStyle,
                          {
                            color: '#006eff',
                            fontWeight: 'bold',
                            fontSize: 16,
                          },
                        ]}>
                        Continue
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonCancel}
                      onPress={() => setModalVisible(false)}>
                      <Text
                        style={[
                          styles.textStyle,
                          {
                            color: 'black',
                            fontSize: 16,
                          },
                        ]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      <Modal
        transparent={true}
        animationType="slide"
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}>
        <View style={deletesStyle.modalContainer}>
          <View style={deletesStyle.modalView}>
            <Text style={deletesStyle.modalTitle}>Delete User?</Text>
            <Text style={deletesStyle.modalMessage}>
              Are you sure you want to delete this user? This action is
              irreversible and the user's data will be permanently removed.
            </Text>
            <TouchableOpacity
              onPress={() => deleteUser()}
              style={deletesStyle.deleteButton}>
              <Text style={deletesStyle.deleteButtonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setDeleteModalVisible(false)}
              style={deletesStyle.cancelButton}>
              <Text style={deletesStyle.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e0e0e',
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  input: {
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 13,
    color: 'gray',
  },

  buttonContinue: {
    marginTop: 10,
    borderTopWidth: 1,
    borderColor: '#d1d1d1',

    paddingVertical: 10,
  },
  buttonCancel: {
    borderTopWidth: 1,
    borderColor: '#e4e4e4',
    paddingVertical: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    top: -5,
    textAlign: 'left',
  },
});
const deletesStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  openButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'black',
    fontSize: 16,
  },
});
