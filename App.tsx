import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import temp from './temp/temp';
import AHome from './Admin/AHome';
import ALogin from './Admin/Alogin';
import ANotice from './Admin/ANotice';
import Searching from './Admin/Searching';
import IDCard from './Admin/IDCard';
import Dues from './Admin/Dues';
import StdReg from './Admin/StdReg';
import IDCardSummary from './Admin/IDCardSummar';
import PIDCard from './Admin/PIDCard';

const stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <stack.Navigator>
        <stack.Screen
          name="ALogin"
          component={ALogin}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />
        <stack.Screen
          name="Sealecting"
          component={Searching}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />
        <stack.Screen
          name="ANotice"
          component={ANotice}
          options={{
            title: 'Admin Annoucment List',
          }}
        />

        <stack.Screen
          name="idCardsummary"
          component={IDCardSummary}
          options={{
            title: 'Photography Summary',
            headerShown: true,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />
        <stack.Screen
          name="EID Card"
          component={PIDCard}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />
        <stack.Screen
          name="AHome"
          component={AHome}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />

        <stack.Screen
          name="ID Card"
          component={IDCard}
          options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />

        <stack.Screen
          name="StdReg"
          component={StdReg}
          options={{
            title: 'Stduent Registered',
            headerShown: false,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />
        <stack.Screen
          name="Dues"
          component={Dues}
          options={{
            title: 'Dues List',
            headerShown: false,
            headerStyle: {
              backgroundColor: 'white',
            },
          }}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
