import {useState} from 'react';
import {View, Modal, Text, TouchableOpacity} from 'react-native';
function Modals({
  text,
  visible,
  setVisible,
}: {
  text: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
}) {
  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent={true}
      onRequestClose={() => {
        setVisible(false);
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
            backgroundColor: 'red',
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
              {text}
            </Text>
            <Text
              style={{
                fontWeight: '500',
                color: 'gray',
                textAlign: 'center',
                flexDirection: 'column',
              }}>
              Something went wrong.
            </Text>
            <TouchableOpacity
              onPress={() => {
                setVisible(false);
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
  );
}

export default Modals;
