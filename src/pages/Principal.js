import React from 'react';
import {
  Text,
  View,
  TextInput,
  ImageBackground,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import bg from '../../assets/BG.png';
import * as Font from 'expo-font';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

//Chave Api Openai
const KEY_GPT = 'API_KEY_1';

const App = () => {

  const navigation = useNavigation();

  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [travel, setTravel] = useState("")
  const [temperature, setTemperature] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  //useEffect para carregar fontes customizadas
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        'montitalic': require('../../assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
        'normal': require('../../assets/fonts/Montserrat-VariableFont_wght.ttf'),
        'playbold': require('../../assets/fonts/Play-Bold.ttf'),
        'playregular': require('../../assets/fonts/Play-Regular.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);
  if (!fontLoaded) {
    return null;
  }

  //Função principal
  const FuncaoPrincipal = () => {
    console.log('Função principal executada.');
    //Chama outras duas funções adicionais
    PesquisaCoordenadasTemperatura();
    PesquisaRoteiro();
  };

  //Função 1 - Coordenadas e Tempertura
  const PesquisaCoordenadasTemperatura = async () => {
    try {
      //Pesquisa as coordenadas - API Maps
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=API_KEY_2`
      );
      console.log('response é:', response)
      const { lat, lng } = response.data.results[0].geometry.location;

      console.log('Latitude:', lat);
      console.log('Longitude:', lng);

      setLatitude(lat);
      setLongitude(lng);

      //Pesquisa a temperatura - API OpenWeather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=API_KEY_3`
      );
      console.log('weatherResponse é:', weatherResponse)
      const currentTemperature = weatherResponse.data.main.temp;
      setTemperature(currentTemperature);
      console.log('Temperatura:', currentTemperature);

    } catch (error) {
      console.error('Erro ao buscar dados meteorológicos:');
    }
  };

  //Função 2 -  Roteiro de Viagem
  async function PesquisaRoteiro() {
    if (city === "") {
      Alert.alert("Atenção", "Preencha o nome da cidade!")
      return;
    }
    setTravel("")
    setLoading(true);
    Keyboard.dismiss();

    const prompt = `Crie um roteiro para uma viagem de exatos ${days.toFixed(0)} dias na cidade de ${city}, busque por lugares turisticos, lugares mais visitados, seja preciso nos dias de estada fornecidos e limite o roteiro apenas na cidade fornecida. Forneça apenas em tópicos com nome do local onde ir em cada dia.`

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.20,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log('O data é: ', data.choices[0].message.content);
        setTravel(data.choices[0].message.content)
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <ImageBackground source={bg} style={estilos.container}>
      <View style={estilos.form}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={estilos.heading}>Roteiro - Viagens</Text>
        </View>

        <Text style={estilos.label}>Cidade Destino:</Text>

        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', justifyContent: 'center' }}>

          <TextInput
            placeholder="Ex.: Brasília, DF"
            style={estilos.input}
            value={city}
            onChangeText={(text) => setCity(text)}
          />

          <Pressable
            style={estilos.button}
            onPress={FuncaoPrincipal}
          >
            <Text style={estilos.buttonText}>Criar Roteiro</Text>
          </Pressable>

        </View>

        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
          {days === 1
            ? (<Text style={estilos.label}>Tempo de Estada: <Text style={estilos.days}> {days.toFixed(0)} </Text> dia.</Text>)
            : (<Text style={estilos.label}>Tempo de Estada: <Text style={estilos.days}> {days.toFixed(0)} </Text> dias.</Text>)}

          <Pressable
            style={estilos.button}
            onPress={() => navigation.navigate('Mapa', { latitude: latitude, longitude: longitude })}
          >
            <Text style={estilos.buttonText}>Ver Mapa</Text>
          </Pressable>
        </View>

        <Slider
          style={{ marginTop: 16, marginBottom: 14 }}
          minimumValue={1}
          maximumValue={7}
          minimumTrackTintColor="#009688"
          maximumTrackTintColor="#000000"
          value={days}
          onValueChange={(value) => setDays(value)}
        />

      </View>
      {loading && (
        <View style={estilos.content}>
          <Text style={{ color: '#0F1F38' }}>Carregando roteiro...</Text>
          <ActivityIndicator
            color="#0F1F38"
            size="large"
            style={{ marginTop: 16 }}
          />
        </View>
      )}

      {travel && (
        <View style={estilos.content}>
          <Text style={estilos.title}>Roteiro da viagem</Text>
        </View>
      )}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, marginTop: 4, }}
        style={estilos.containerScroll}
        showsVerticalScrollIndicator={false} >

        <Text style={{ lineHeight: 24, color: '#0F1F38' }}>{travel}</Text>
      </ScrollView>

      <View style={estilos.temperatura}>
        {temperature && (
          <Text style={estilos.textTemperatura}>
            Temperatura Atual: {city} é de {temperature}°C.
          </Text>
        )}
      </View>
    </ImageBackground>

  );
}

export default App;

const estilos = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#',
    alignItems: 'center',
    paddingTop: 36,
  },
  form: {
    backgroundColor: '#BFB8A9',
    width: '91%',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '500',
    marginTop: 4,
    borderRadius: 12,
    backgroundColor: '#0F1F38',
    paddingHorizontal: 43,
    paddingVertical: 10,
    elevation: 8,
    letterSpacing: 3,
    color: '#FFF',
    fontFamily: 'playbold',
  },
  label: {
    fontWeight: '400',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 14,
    color: '#1f1e1d',
    marginLeft: 6,
    fontFamily: 'playregular',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#FFF',
    padding: 9,
    fontSize: 16,
    width: 210,
    backgroundColor: '#FFF',
    fontFamily: 'playregular',
  },
  days: {
    color: "#009688",
    fontWeight: 'bold',
    fontSize: 18,
  },
  button: {
    backgroundColor: "#52658F",
    borderRadius: 8,
    flexDirection: 'row',
    padding: 11,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginVertical: 5,
    width: 120,
  },
  buttonText: {
    fontSize: 16,
    padding: 2,
    color: '#FFF',
    fontWeight: '500',
    fontFamily: 'playregular',
  },
  content: {
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
    fontFamily: 'playregular',
    color: '#1f1e1d',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#0F1F38',
    fontFamily: 'playregular',
  },
  containerScroll: {
    width: '84%',
    marginBottom: 80,
  },
  temperatura: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',

  },
  textTemperatura: {
    backgroundColor: '#2d2e30',
    paddingVertical: 14,
    borderRadius: 18,
    color: '#FFF',
    width: '90%',
    fontFamily: 'playregular',
    textAlign: 'center',
  }
});











