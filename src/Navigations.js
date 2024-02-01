import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Principal from './pages/Principal';
import Mapa from './pages/Mapa';

const Stack = createNativeStackNavigator();

export default function Navigations() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Principal" component={Principal} options={{ headerShown: false }} />
                <Stack.Screen name="Mapa" component={Mapa} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}