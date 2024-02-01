import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const LocationMapScreen = ({ route }) => {
    const { latitude, longitude } = route.params;

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <TouchableOpacity style={{ zIndex: 1, position: 'absolute', top: 120, left: 20, right: 0 }}>
                <AntDesign
                    onPress={() => navigation.goBack()}
                    name="leftcircle"
                    size={24}
                    color="gray" />
            </TouchableOpacity>
            <GooglePlacesAutocomplete
                placeholder='Pesquisar endereço...'
                onPress={(data, details = null) => {
                    // 'data' contém informações sobre o local selecionado
                    // 'details' contém informações detalhadas do local, como latitude e longitude
                    console.log('O data é: ', data);
                    console.log('O details é: ', details);
                }}
                query={{
                    key: 'API_KEY_2', //API Key Maps
                    language: 'pt',
                }}
                styles={{
                    container: { position: 'absolute', top: 40, left: 0, right: 0, zIndex: 2 },
                    textInputContainer: { backgroundColor: '#FFF', borderBottomWidth: 1, paddingLeft: 10 },
                    textInput: { marginLeft: 0, marginRight: 0, height: 50, color: '#5d5d5d', fontSize: 16 },
                    predefinedPlacesDescription: { color: '#1faadb' },
                }}
            />

            {/* Mapa */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{ latitude: latitude, longitude: longitude }}
                    title="Localização Inicial"
                />
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    map: {
        marginTop: 94,
        ...StyleSheet.absoluteFillObject,
    },
});

export default LocationMapScreen;



