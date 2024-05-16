import React, {useEffect, useState} from 'react';
import {
  BackHandler,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {View} from 'react-native';
import Modals from './AComponent/Modal';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';
function ALogin() {
  const {width, height} = useWindowDimensions();
  const user: string = 'admin';
  const [tuser, setTuser] = useState<string>('');
  const [tpassword, setTpassword] = useState<string>('');
  const password: string = 'admin';
  const [inavlid, setInvalid] = useState<boolean>(false);
  const navigator = useNavigation();
  BackHandler.addEventListener('hardwareBackPress', async () => {
    console.log('hardwareBackPress');
    process.exit(0);
  });
  const onSubmit = () => {
    if (user === tuser.trim() && password === tpassword.trim()) {
      console.log('sucessfully submitted');
      navigator.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'AHome'}],
        }),
      );
    } else {
      setInvalid(true);
    }
  };

  return (
    <View
      style={{
        width: width,
        height: height,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'white',
        gap: 10,
        paddingHorizontal: 20,
      }}>
      <View
        style={{
          width: width,
          height: height,
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
          width: width,
          top: 0,
          height: height / 2,
          justifyContent: 'center',
          position: 'absolute',
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
    </View>
  );
}

export default ALogin;
