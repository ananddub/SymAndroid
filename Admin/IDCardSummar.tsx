import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {url} from './GlobalVariable';
import {RefreshControl} from 'react-native-gesture-handler';

function IDCardSummary() {
  const [list, setList] = useState<any[]>([]);
  const [spin, setSpin] = useState<boolean>(true);
  const [mdetail, setMdetail] = useState({
    total: 0,
    pleft: 0,
    pdone: 0,
  });
  useEffect(() => {
    fetch(`${url}/totalphoto`).then(async (e: any) => {
      const ls: {
        title: string;
        num: number;
        item: any;
      }[] = [];
      const data: any = await e.json();
      const det = {
        total: data.total,
        pleft: data.tphotoleft,
        pdone: data.tphotodone,
      };
      setMdetail(det);
      let i = 0;
      for (let [key, value] of Object.entries(data)) {
        if (key === key.toUpperCase()) {
          console.log(value.total.totalSec);
          const items: any = value.total.totalSec.map((sec: string) => {
            return {
              class: key,
              section: sec,
              num: i,
              items: value[sec],
            };
          });
          console.log('items ', items);
          setSpin(false);
          ls.push({
            title: key,
            num: i,
            data: items,
          });
          i++;
        }
      }
      console.log('setList ', ls);
      setList(ls);
      console.log('success');
    });
  }, []);
  useEffect(() => {
    console.log('rerender occured due to list change');
  }, [list]);
  return (
    <View style={{backgroundColor: 'white', height: '100%'}}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          paddingHorizontal: 5,
          backgroundColor: '#1c9cf7',
        }}>
        <Text
          style={{
            flex: 1,
            textAlign: 'left',
            paddingHorizontal: 10,
            fontSize: 15,
            color: 'white',
            textAlignVertical: 'center',
            fontWeight: '600',
          }}>
          class
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'left',
            paddingHorizontal: 10,
            fontSize: 15,
            color: 'white',
            textAlignVertical: 'center',
            fontWeight: '600',
          }}>
          sec
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'left',
            paddingHorizontal: 10,
            fontSize: 15,
            color: 'white',
            textAlignVertical: 'center',
            fontWeight: '600',
          }}>
          Total
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'left',
            paddingHorizontal: 10,
            fontSize: 15,
            color: 'white',
            textAlignVertical: 'center',
            fontWeight: '600',
          }}>
          Photo left
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: 'left',
            paddingHorizontal: 10,
            fontSize: 15,
            color: 'white',
            textAlignVertical: 'center',
            fontWeight: '600',
          }}>
          Photo Done
        </Text>
      </View>
      {spin && <ActivityIndicator size="large" color="#1c9cf7" />}
      <SectionList
        style={{
          flex: 1,
        }}
        sections={list}
        renderItem={({item, index}) => (
          <View
            style={{
              width: '100%',
              paddingVertical: 2,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: item.num % 2 == 0 ? '#f1f5f9' : 'white',
            }}>
            <Text style={style.section}>{item.class}</Text>
            <Text style={style.section}>{item.section}</Text>
            <Text style={style.total}>{item.items.total}</Text>
            <Text style={style.pleft}>{item.items.photoleft}</Text>
            <Text style={style.pdone}>{item.items.photodone}</Text>
          </View>
        )}
      />
      <View
        style={{
          width: '100%',
          flexDirection: 'column',
          alignItems: 'center',
          borderTopWidth: 1,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#f1f5f9',
          }}>
          <Text
            style={{
              flex: 2,
              textAlign: 'left',
              paddingHorizontal: 10,
              fontSize: 15,
              color: 'black',
              textAlignVertical: 'center',
              fontWeight: '600',
            }}>
            Grand Total
          </Text>
          <Text style={style.total}>{mdetail.total}</Text>
          <Text style={style.pleft}>{mdetail.pleft}</Text>
          <Text style={style.pdone}>{mdetail.pdone}</Text>
        </View>
      </View>
    </View>
  );
}

export default IDCardSummary;
const style = StyleSheet.create({
  htext: {
    color: 'black',
    textAlign: 'left',
    fontSize: 15,
    paddingHorizontal: 10,
    fontWeight: '600',
  },
  lhtext: {
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 10,
    fontSize: 15,
    color: 'white',
    textAlignVertical: 'center',
    fontWeight: '600',
  },

  class: {
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 10,
    fontSize: 15,
    color: 'black',
    textAlignVertical: 'center',
    fontWeight: '600',
  },
  section: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 15,
    color: 'black',
    textAlignVertical: 'center',
    fontWeight: '600',
  },
  total: {
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 15,
    color: 'black',
    textAlignVertical: 'center',
    fontWeight: '600',
    flex: 1,
  },
  pleft: {
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 15,
    color: 'red',
    textAlignVertical: 'center',
    fontWeight: '600',
    flex: 1.5,
  },
  pdone: {
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 15,
    color: 'green',
    textAlignVertical: 'center',
    fontWeight: '600',
    flex: 1.5,
  },
});
