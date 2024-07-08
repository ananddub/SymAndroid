
// App.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image, PermissionsAndroid, Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import store from './store';
import { selectUsername, selectData } from './counterSlice';
import GetLocation from 'react-native-get-location/dist';

import ImageResizer from '@bam.tech/react-native-image-resizer';
import { faceurl, url } from './GlobalVariable';
import { replace } from 'formik';
import jestConfig from '../jest.config';
export default function Attendance() {
    const [photo, setPhoto] = useState(null);
    const [status, setStatus] = useState('IN');
    const empid = useSelector(selectUsername);
    const data = useSelector(selectData);
    const [errorVisible, setErrorVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const close = () => setErrorVisible(false)
    const [text, setText] = useState("");
    const takePhoto = async () => {
        const loc: any = await getLocation();
        console.log(loc)
        if (loc !== false) {
            ImagePicker.openCamera({
                width: 300,
                height: 300,
                hideBottomControls: true
            }).then(image => {
                ImageResizer.createResizedImage(image.path, 300, 300, 'JPEG', 100)
                    .then((response) => {
                        console.log(response)
                        setPhoto(response.uri)
                        uploadData(response.uri, loc)
                    }).catch((err) => {
                    });
                // updateData()
            });
        }
    };
    async function checkPermission() {
        const permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
        const result = await check(permission);
        switch (result) {
            case RESULTS.UNAVAILABLE:
                setText('Location services are not available on this device.');
                setErrorVisible(true);
                request(permission);
                return false;
            case RESULTS.DENIED:
                request(permission);
                return false;
            case RESULTS.LIMITED:
                return true;
            case RESULTS.GRANTED:
                return true;
            case RESULTS.BLOCKED:
                setText('Location permission is denied and not requestable.');
                setErrorVisible(true);
                return false;
        }
    }
    async function getLocation() {
        //take PermissionsAndroid in android 
        if (!(await checkPermission()))
            return false;
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
                console.log("Error in Location :", code, message)
                setText("Please enable your Location")
                setErrorVisible(true)
                //console.warn(code, message);
                reject(false);
            })
        )

    }
    async function updateData(loc: any) {
        const data = {
            empid: empid,
            inout: status,
            address: {
                latitude: loc.latitude,
                longitude: loc.longitude
            }
        }
        console.log(data)
        fetch(`${url}/teacher/attendance`, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(async (response) => {
            console.log("upDate status code :", response.status)
            const data = await response.json()
            console.log(data)
            if (response.status === 200) setSuccessVisible(true);
            else {
                setText("Server Error:please Contact Us")
                setErrorVisible(true)
            }
        }).catch((error) => {
            setText(`apdate error :${error}`)
            setErrorVisible(false)
            console.log("upload error :", error);
        })
    } function uploadData(photo: any, loc: any) {
        const data = new FormData();
        data.append('image', {
            uri: photo,
            name: 'image.jpeg',
            type: 'image/jpeg',
        });
        const url = `${faceurl}/detect_faces`
        fetch(url, {
            method: 'POST',
            body: data,
        })
            .then(async response => {
                // console.log(response);

                console.log("upload status code :", response.status)
                if (response.status === 200) {
                    const json = await response.json();
                    console.log("faces_detected value :", json)
                    if (json.faces_detected) {

                        updateData(loc)
                    }
                    else {
                        setText("Face Does Not Found")
                        setErrorVisible(true)
                    }
                    //setSuccessVisible(false)
                } else {
                    setText("Server Error:Please Contact Us")
                    setErrorVisible(true)
                }
            }
            )
            .catch(error => {
                setText("Server Error:Please Contact Us")
                setErrorVisible(true)
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

            <Modal
                animationType="fade"
                transparent={true}
                visible={errorVisible}
                onRequestClose={() => setErrorVisible(false)}
            >
                <View style={style.modalBackground}>
                    <View style={style.modalContainer}>
                        <Text style={style.modalText}>{text}</Text>
                        <TouchableOpacity style={style.closeButton} onPress={() => setErrorVisible(false)}>
                            <Text style={style.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={successVisible}
                onRequestClose={() => setSuccessVisible(false)}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        padding: 20,
                        borderRadius: 10,
                        alignItems: 'center',
                        elevation: 5,
                        minWidth: 250,
                    }}>
                        <Text style={{ marginBottom: 15, color: 'black', textAlign: 'center', fontSize: 16 }}>Attendance Marked Successfully</Text>
                        <TouchableOpacity style={{
                            backgroundColor: '#4CAF50',
                            paddingVertical: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            marginTop: 10,
                        }} onPress={() => setSuccessVisible(false)}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
const style = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
        minWidth: 250,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        color: 'gray'
    },
    closeButton: {
        backgroundColor: '#f44336',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
