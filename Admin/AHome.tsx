import {View, Text, TextInput, Dimensions, Modal} from 'react-native';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {ScrollView, Image} from 'react-native';
import {
  CommonActions,
  NavigationRouteContext,
  useNavigation,
} from '@react-navigation/native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalidUser, setInvalidUser] = useState(false);
  const handleLogin = () => {
    console.log(
      'Logging in with username:',
      username,
      'and password:',
      password,
    );
    setModalVisible(true);
  };
  const createAccountVerify = () => {
    if (username === 'admin' && password === 'admin') {
      setInvalidUser(true);
      setModalVisible(false);
      navigator.navigate('CreateUser');
    } else {
      setInvalidUser(true);
    }
  };
  useEffect(() => {
    setInvalidUser(false);
  }, [username, password]);
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
                backgroundColor: '#F1F5F9',
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                width: '100%',
              }}>
              <Text
                style={{
                  color: 'gray',
                  fontWeight: '500',
                  textAlign: 'center',
                  fontSize: 18,
                }}>
                Student
              </Text>
              <View
                style={{
                  height: 150,
                  backgroundColor: '#F1F5F9',
                  flexDirection: 'row',
                  borderTopEndRadius: 10,
                  borderTopStartRadius: 10,
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

              <Text
                style={{
                  color: 'gray',
                  fontWeight: '500',
                  textAlign: 'center',
                  fontSize: 18,
                }}>
                Teacher
              </Text>
              <View
                style={{
                  height: 150,
                  backgroundColor: '#F1F5F9',
                  borderBottomEndRadius: 10,
                  borderBottomStartRadius: 10,
                  flexDirection: 'row',
                  paddingHorizontal: 5,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setPhotography(false);
                    navigator.navigate('EID Card');
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
                    // navigator.navigate('idCardsummary');
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
          <TouchableOpacity
            style={styles.box}
            onPress={() => {
              setUsername('');
              setPassword('');
              setModalVisible(true);
            }}>
            <Image
              source={require('../assets/list.png')}
              style={{
                width: 50,
                height: 50,
                top: -10,
              }}
            />
            <Text style={styles.text}>Create User</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 30}}></View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Please verify your identity</Text>
              <Text style={styles.modalDescription}>
                For access to the admin panel, please verify your identity.
              </Text>

              <TextInput
                style={[styles.input]}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
              {invalidUser && (
                <Text style={styles.errorText}>Invalid username</Text>
              )}
              <TextInput
                style={[styles.input, {marginTop: 10}]}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />

              <View style={[styles.buttonContainer, {marginTop: 10}]}>
                <TouchableOpacity
                  style={[styles.button, styles.buttonContinue]}
                  onPress={createAccountVerify}>
                  <Text style={styles.textStyle}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonCancel]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.textStyle}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  errorText: {
    width: '100%',
    marginBottom: 5,
    color: 'red',
    fontSize: 12,
    textAlign: 'left',
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: 'gray',
    position: 'absolute',
    bottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Dark blue color for heading
  },
  modalDescription: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  buttonContinue: {
    backgroundColor: '#0077d9',
  },
  buttonCancel: {
    backgroundColor: '#5e5e5e',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
