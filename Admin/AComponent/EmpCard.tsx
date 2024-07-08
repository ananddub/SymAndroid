
import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

const EmployeeCard = ({ item, onPress }) => {

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(item)}>
            <Image
                source={item.image !== ''
                    ? { uri: `data:image/jpeg;base64,${item.image}` }
                    : require('../../assets/user.png')}
                style={styles.image}
            />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%'
                    }}
                >

                    <Text style={styles.empid}>{item.mob}</Text>

                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

    card: {
        backgroundColor: 'white',
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderWidth: 0.2,
        borderColor: '#C0C0C0'
    },
    image: {
        height: 52,
        width: 50,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    textContainer: {
        flex: 1,
        marginLeft: 20,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    empid: {
        fontSize: 14,
        color: '#666',
    },

});

export default EmployeeCard;
