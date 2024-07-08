
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
export function CallenderAttendance({ route }: { route: any }) {
    const [attendanceDates, setAttendanceDates] = useState({});
    const [presentDays, setPresentDays] = useState(0);
    const [absentDays, setAbsentDays] = useState(0);
    const item = route.params.item
    const tdate = {
        "attendance": item?.attendance
    };

    useEffect(() => {
        let markedDates = {};
        let presentDaysCount = 0;
        let currentMonth = moment().month();
        let currentYear = moment().year();
        console.log("attendance :", item.attendance)
        if (item.attendance !== undefined)
            tdate.attendance.forEach(record => {
                let date = moment(record.date).format('YYYY-MM-DD');
                const dateMonth = moment(record.date).month();
                const dateYear = moment(record.date).year();

                if (dateMonth === currentMonth && dateYear === currentYear) {
                    presentDaysCount++;
                }
                date = new Date(record.date).toISOString().split('T')[0];
                markedDates[date] = {
                    selected: true,
                    selectedColor: '#4DC173'
                };
            });
        let totalDaysInMonth = moment().daysInMonth();
        let absentDaysCount = totalDaysInMonth - presentDaysCount;

        setPresentDays(presentDaysCount);
        setAbsentDays(absentDaysCount);
        setAttendanceDates(markedDates);
        console.log('totalDaysInMonth :', totalDaysInMonth)
        console.log('absentDaysCount :', absentDaysCount)
    }, []);
    const dateChange = (date: any) => {
        let markedDates = {};
        let presentDaysCount = 0;
        console.log(date)
        let currentMonth = moment(date.dateString).month(); // current month
        let currentYear = moment(date.dateString).year(); // current year
        if (item.attendance !== undefined)
            tdate.attendance.forEach(record => {
                let date = moment(record.date).format('YYYY-MM-DD');
                const dateMonth = moment(record.date).month();
                const dateYear = moment(record.date).year();

                if (dateMonth === currentMonth && dateYear === currentYear) {
                    presentDaysCount++;
                }
                date = new Date(record.date).toISOString().split('T')[0];
                markedDates[date] = {
                    selected: true,
                    selectedColor: '#4DC173'
                };
            });
        let totalDaysInMonth = moment().daysInMonth();
        let absentDaysCount = totalDaysInMonth - presentDaysCount;

        setPresentDays(presentDaysCount);
        setAbsentDays(absentDaysCount);
        setAttendanceDates(markedDates);
        console.log('totalDaysInMonth :', totalDaysInMonth)
        console.log('absentDaysCount :', absentDaysCount)
    }
    return (
        <View style={styles.container}>
            <View
                style={styles.imagecon}
            >

                <Image
                    source={
                        item.image !== ''
                            ? { uri: `data:image/jpeg;base64,${item.image}` }
                            : require('../assets/user.png')
                    }
                    style={styles.image}
                />
                <Text
                    style={styles.detail}
                >{item.name}</Text>
                <Text style={{
                    color: 'gray'
                }}>{item.empid}</Text>
            </View>
            <Calendar
                markedDates={attendanceDates}
                markingType='multi-period'
                onMonthChange={(month) => {
                    console.log('Month changed', month);
                    dateChange(month)
                }}
            />

            <View
                style={styles.result}
            >
                <Text style={styles.present}>Present Days  {presentDays}</Text>
                <Text style={styles.absent}>Absent Days  {absentDays}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    absent: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
    },
    present: {
        color: '#4DC173',
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center',
    },
    detail: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    result: {
        gap: 10,
        padding: 10,
    },
    imagecon: {
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        height: 70,
        width: 70,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#ddd',
    }
})
