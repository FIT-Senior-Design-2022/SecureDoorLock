import React,{useState} from 'react';
import {StyleSheet, Text, View,Pressable, Button,FlatList,TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';



const TabNav = createBottomTabNavigator();

function TabNavs() {
  return (
    <TabNav.Navigator
          screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name == "Home") {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name == "My Devices") {
              iconName = focused 
              ? 'list'
               : 'list-outline';
            }else if(route.name == "Visitors"){
              iconName = focused ?
               'people' : 'people-outline'
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
    >
      <TabNav.Screen name="Home" component={HomeScreen}/>
      <TabNav.Screen name="My Devices" component={MyDevices} />
      <TabNav.Screen name="Visitors" component={Visitors} />
    </TabNav.Navigator>
  );
}

const App = Section => {
  return (
    <NavigationContainer>
      <TabNavs />
    </NavigationContainer>
  );
};



const LockButton = () =>{
  const [buttonText,setButtonText] = useState("Unlock")
  function Unlock(buttonText){
    buttonText === "Unlock" ? setButtonText("Lock") : setButtonText("Unlock")
  }

  return(
    <View>
      <Button style = {styles.button} title={buttonText} onPress = {() => {Unlock(buttonText)}}/>
    </View>
  )
}
  
const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.sectionContainer}>
      <LockButton styles = {styles.button} lockName="Placeholder"/>
    </View>
  );
};




const MyList = ({ data }) => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <View style={styles.nameContainer}>
          <Text style={styles.sectionTitle}>{item.name}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Button 3</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Devices</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const MyDevices = ({navigation}) => {
  data = [{id: '1', name: 'Device 1'},{id: '2', name: 'Device 2'}]
  return (
    <View style={styles.sectionContainer}>
      <MyList data={data}></MyList>
    </View>
  );
};

const Visitors = ({navigation}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text>Visitors</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },

  buttonText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },


  sectionContainer: {
    alignContent: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 0.5,
    padding: 10,
  },
});

export default App;
