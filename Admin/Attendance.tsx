
// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import store from './store';
import { selectUsername, selectData } from './counterSlice';
import GetLocation from 'react-native-get-location/dist';
const App = () => {
    const [photo, setPhoto] = useState(null);
    const [status, setStatus] = useState('IN');
    const empid = useSelector(selectUsername);
    const data = useSelector(selectData);
    const takePhoto = () => {
        if (!status) {
            return;
        }
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true,
        }).then(image => {
            setPhoto(image.path);
            //uploadData(image.path)
        });
    };
    async function getLocation() {
        return new Promise((resolve, reject) => GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 15000,
        })
            .then(location => {
                resolve(location)
                console.log(location);
            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
                reject(error);
            })
        )

    }
    async function updateData() {
        const data = {
            empid: empid,
            inout: status,
            address: await getLocation()
        }
        fetch('http://192.168.1.100:8080/attendance', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
    function uploadData(photo: any) {
        const data = new FormData();
        data.append('image', {
            uri: photo,
            name: 'image.jpg',
            type: 'image/jpg',
        });
        fetch('http://192.168.1.100:8080/isface', {
            method: 'POST',
            body: data,
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
    }
    const renderRadioButton = (value: string, label: string) => (
        <TouchableOpacity onPress={() => setStatus(value)} style={styles.radioButton}>
            <View style={[styles.radioCircle, status === value && styles.selectedRadioCircle]} />
            <Text style={styles.radioLabel}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {photo && (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: photo }}
                        style={styles.photo}
                    />
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            )}
            <View style={styles.radioButtonContainer}>
                {renderRadioButton('IN', 'IN')}
                {renderRadioButton('OUT', 'OUT')}
            </View>
            <TouchableOpacity onPress={takePhoto} style={styles.button}>
                <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E8F0FF',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 20,
        color: '#333',
    },
    imageContainer: {
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    photo: {
        width: 200,
        height: 200,
        borderRadius: 100, // Making the image round
        borderWidth: 4,
        borderColor: 'gray',
    },
    statusText: {
        marginTop: 10,
        fontSize: 18,
        color: '#666',
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    radioCircle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#666',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    selectedRadioCircle: {
        backgroundColor: '#666',
    },
    radioLabel: {
        fontSize: 18,
        color: '#333',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 25,
        marginTop: 20,
        width: '60%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default App;
