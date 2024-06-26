import {
  View,
  Text,
  TextInput,
  useWindowDimensions,
  StyleSheet,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import SelectDropdown from 'react-native-select-dropdown';

function DropDown({
  arr,
  fun,
  text,
}: {
  arr: any;
  fun: (value: number) => void;
  text: string;
}) {
  const {width, height} = useWindowDimensions();
  return (
    <SelectDropdown
      data={arr}
      onSelect={(selectedItem: any, index: number) => {
        console.log(selectedItem, index);
        fun(index);
      }}
      renderButton={(selectedItem, isOpened) => {
        return (
          <View style={styles.dropdownButtonStyle}>
            <Text style={styles.dropdownButtonTxtStyle}>
              {(selectedItem && selectedItem) || text}
            </Text>
          </View>
        );
      }}
      renderItem={(item, index, isSelected) => {
        return (
          <View
            style={{
              ...styles.dropdownItemStyle,
              ...(isSelected && {backgroundColor: '#D2D9DF'}),
            }}>
            <Text style={styles.dropdownItemTxtStyle}>{item}</Text>
          </View>
        );
      }}
      showsVerticalScrollIndicator={false}
      dropdownStyle={styles.dropdownMenuStyle}
    />
  );
}

const styles = StyleSheet.create({
  textinput: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    color: 'gray',
  },
  dropdownButtonStyle: {
    flex: 1,
    height: 40,
    backgroundColor: '#E9ECEF',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    color: '#151E26',
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: '#151E26',
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
export default DropDown;
