import { View, Text, Image, ActivityIndicator, FlatList } from "react-native";
import { useQuery } from "react-query";
import { url } from "./GlobalVariable";
import axios from "axios";
import EmployeeCard from "./AComponent/EmpCard";
import { CallenderAttendance } from "./CalenderAttendance";
import { useNavigation } from "@react-navigation/native";

export function AttendanceDetail() {
    const { isLoading, isError, data, error }: any = useQuery("data", async () => {
        const query = url + '/admin/getTeacherAttendance'
        return await axios.post(query).then(res => res.data);
    })
    const navigate = useNavigation();
    if (isLoading) return (
        <View>
            <ActivityIndicator size='large' color='black' />
        </View>
    )
    if (isError) {
        console.log(error);
        return (
            <View>
                <Text>Error</Text>
            </View>
        )
    }
    const onPress = (item: any) => {
        console.log(item.name)
        navigate.navigate('CalenderAttendance', { item: item })
    }
    console.log(data[0])

    return (
        <View
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'white',
            }}
        >
            <Text style={{
                backgroundColor: 'white',
                fontSize: 14,
                fontWeight: 'bold',
                borderWidth: 0.2,
                borderColor: '#C0C0C0',
                padding: 10,
                color: '#333',
            }} >Total result {data.length}</Text>
            <FlatList
                data={data}
                renderItem={({ item }) => <EmployeeCard item={item} onPress={onPress} />}
            />
        </View>
    )
}
