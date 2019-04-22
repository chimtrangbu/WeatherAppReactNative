import React, { Component } from "react";
import {
  ScrollView,
  TextInput,
  Picker,
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  TouchableOpacity
} from "react-native";

const API_KEY = "36818c9f1da38977ad93cd017b511d07";
const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&";
const ICON_URL = "http://openweathermap.org/img/w/";

const cityList = require("./city.list.json");

const CustomButton = props => {
  const { text, onPress } = props;
  return (
      <TouchableOpacity style={styles.buttonStyle} onPress={() => onPress()}>
        <Text style={styles.textStyle}>{text}</Text>
      </TouchableOpacity>
  );
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      currentPicker: "",
      currentCityInfo: {}
    };
  }

  getWeather(id) {
    fetch(`${API_URL}id=${id}&APPID=${API_KEY}`)
        .then(response => response.json())
        .then(currentCityInfo => this.setState({ currentCityInfo }));
  }

  handleTextInput(text) {
    this.setState({ text });
    for (let city of cityList) {
      if (city.name.toLowerCase().startsWith(text.toLowerCase())) {
        this.setState({
          currentPicker: city.name
        });
        this.getWeather(city.id);
        break;
      }
    }
  }

  handlePickerValue(itemValue) {
    this.setState({
      currentPicker: itemValue,
      text: itemValue
    });
    for (let city of cityList) {
      if (city.name === itemValue) {
        this.getWeather(city.id);
        break;
      }
    }
  }

  render() {
    return (
        <ScrollView>
          <View style={styles.app}>
            <Text style={styles.head}>Weather App</Text>
            <Text style={styles.tip}>Weather Statistics</Text>
            <CustomButton
                text="Continue with Facebook"
                onPress={() => {
                  Linking.openURL("#");
                }}
            />

            <TextInput
                style={styles.textInput}
                onChangeText={text => this.handleTextInput(text)}
                value={this.state.text}
            />

            <Picker
                selectedValue={this.state.currentPicker}
                style={{ height: 40, width: "100%" }}
                onValueChange={itemValue =>
                    this.handlePickerValue(itemValue)
                }
            >
              {cityList.map((city, index) => (
                  <Picker.Item key={index} label={city.name} value={city.name} />
              ))}
            </Picker>
            {this.state.currentCityInfo.name ? (
                <View style={{ margin: 20 }}>
                  <Text>City: {this.state.currentCityInfo.name}</Text>
                  <Image
                      style={{ width: 300, height: 200 }}
                      source={{
                        uri: `${ICON_URL}${
                            this.state.currentCityInfo.weather[0].icon
                            }.png`
                      }}
                  />
                  <Text>Temperature: {this.state.currentCityInfo.main.temp} C</Text>
                  <Text>
                    Pressure: {this.state.currentCityInfo.main.pressure} P
                  </Text>
                  <Text>
                    Humidity: {this.state.currentCityInfo.main.humidity} %
                  </Text>
                </View>
            ) : null}
          </View>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    marginHorizontal: "auto",
    maxWidth: "100%"
  },

  head: {
    color: "#fff",
    backgroundColor: "#3498db",
    fontSize: 30,
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 5
  },

  tip: {
    fontSize: 20,
    textAlign: "center",
    paddingTop: 20,
    paddingBottom: 15,
    color: "#000"
  },

  textInput: {
    textAlign: "center",
    height: 40,
    borderColor: "#3498db",
    borderWidth: 1,
    marginVertical: 20
  },

  textStyle: {
    fontSize: 20,
    color: "#fafafa",
    textAlign: "center"
  },

  buttonStyle: {
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
    borderColor: "#3498db",
    borderWidth: 2,
    marginLeft: 25,
    marginRight: 25
  }
});

export default App;
