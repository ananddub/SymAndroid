import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  PermissionsAndroid,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {View} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';
import GetLocation from 'react-native-get-location';
import Modals from './AComponent/Modal';
import {url} from './GlobalVariable';

function ALogin() {
  const {width, height} = useWindowDimensions();
  const user: string = 'admin';
  const [tuser, setTuser] = useState<string>('');
  const [tpassword, setTpassword] = useState<string>('');
  const passwords: string = 'admin';
  const [inavlid, setInvalid] = useState<boolean>(false);
  const navigator = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [invalidText, setInvalidText] = useState('');
  BackHandler.addEventListener('hardwareBackPress', async () => {
    console.log('hardwareBackPress');
    process.exit(0);
  });
  const onPasswordSubmit = values => {
    console.log('onPasswordSubmit', {
      username: values.username,
      password: values.password,
    });
    fetch(`${url}/admin/update`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    }).then(response => {
      if (response.status === 200) {
        setModalVisible(false);
      } else {
        setInvalidText('invalid mobile number');
        console.log('error ' + response.status);
      }
    });
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^\d{10}$/, 'Mobile number must be exactly 10 digits')
      .required('Mobile is required'),
    password: Yup.string().required('Password is required'),
    repassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Retype Password is required'),
  });
  useEffect(() => {}, []);
  const onSuccess = async () => {
    await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
      })
      .catch(error => {
        const {code, message} = error;
        console.warn(code, message);
      });
    navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'AHome'}],
      }),
    );
  };
  const onSubmit = () => {
    if (tuser.trim() === 'admin' && tpassword.trim() === 'admin') {
      console.log('sucessfully submitted');
      onSuccess();
    } else {
      const obj = {
        username: tuser,
        password: tpassword,
      };
      fetch(`${url}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }).then(response => {
        if (response.status === 200) {
          console.log('Successfully updated');
          onSuccess();
        } else {
          response.json().then(data => {
            console.log([data, response.status]);
            setInvalid(true);
          });
        }
      });
    }
  };

  return (
    <View
      style={{
        width: width,
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        gap: 10,
        paddingHorizontal: 20,
      }}>
      <View
        style={{
          width: width,
          height: '100%',
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          style={{
            width: width,
            height: height,
          }}
          blurRadius={5}
          source={require('../assets/background.jpg')}
        />
      </View>
      <View
        style={{
          width: '100%',
          top: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/logo.jpg')}
          style={{
            width: 140,
            height: 140,
            borderRadius: 100,
          }}
        />
        <View>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: '#1579c2',
              textAlign: 'center',
            }}>
            Symbiosis
          </Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: '500',
              color: '#1579c2',
              textAlign: 'center',
            }}>
            {' '}
            International School
          </Text>
        </View>
      </View>
      <Modals text="Inavlid Admin" visible={inavlid} setVisible={setInvalid} />

      <TextInput
        placeholder="Username"
        onChangeText={setTuser}
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          borderWidth: 0,
          elevation: 4,
          fontSize: 14,
          color: 'gray',
          paddingHorizontal: 10,
          height: 40,
          borderColor: '#1c9cf7',
        }}
        placeholderTextColor="gray"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setTpassword}
        style={{
          backgroundColor: 'white',
          borderRadius: 10,
          fontSize: 14,
          elevation: 4,
          color: 'gray',
          borderWidth: 0,
          paddingHorizontal: 10,
          height: 40,
          borderColor: '#1c9cf7',
        }}
        placeholderTextColor="gray"
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text
            style={{
              color: 'red',
              textAlign: 'center',
              fontWeight: '500',
              fontSize: 16,
            }}>
            forgot password
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={onSubmit}
        style={{
          elevation: 4,
          backgroundColor: '#1c9cf7',
          borderRadius: 10,
          padding: 10,
        }}>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 16}}>
          Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          BackHandler.exitApp();
        }}
        style={{
          elevation: 4,
          backgroundColor: '#f43f5e',
          borderRadius: 10,
          padding: 10,
        }}>
        <Text style={{color: 'white', textAlign: 'center', fontSize: 16}}>
          Exit
        </Text>
      </TouchableOpacity>
      <View
        style={{
          height: height,
          width: width,
          position: 'absolute',
          flexDirection: 'column-reverse',
        }}>
        <Text
          style={{
            backgroundColor: 'white',
            fontSize: 16,
            color: 'black',
            textAlign: 'center',
            height: 50,
          }}>
          powered by webgen
        </Text>
      </View>
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
            <Text style={styles.modalText}>Change Password</Text>
            <Text style={styles.modalDescription}>
              Fill the all fields for changing password
            </Text>
            <Formik
              initialValues={{username: '', password: '', repassword: ''}}
              validationSchema={validationSchema}
              onSubmit={values => {
                onPasswordSubmit(values);
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
                    style={styles.input}
                    placeholder="Mobile"
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
                  />
                  {(touched.username && errors.username && (
                    <Text style={styles.errorText}>{errors.username}</Text>
                  )) ||
                    (invalidText && (
                      <Text style={styles.errorText}>{invalidText}</Text>
                    ))}
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={true}
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
                    secureTextEntry={true}
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
    </View>
  );
}

export default ALogin;
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
