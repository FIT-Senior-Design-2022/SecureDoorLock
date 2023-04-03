import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SelectList} from 'react-native-dropdown-select-list';
import {networkInterfaces} from 'os';

let serv_url = 'http://10.154.2.38:3000/';
const TabNav = createBottomTabNavigator();
function TabNavs() {
  return (
    <TabNav.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name == 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name == 'My Devices') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name == 'Visitors') {
            iconName = focused ? 'people' : 'people-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}>
      <TabNav.Screen name="Home" component={HomeScreen} />
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

const LockButton = () => {
  const [lockState, setlockState] = useState('Unlock');

  async function Unlock(lockState) {
    const body = JSON.stringify({
      lockState: lockState,
    });
    fetch(serv_url + lockState);
    setlockState(lockState === 'Unlock' ? 'Lock' : 'Unlock');
  }

  return (
    <View>
      <Button
        style={styles.button}
        title={lockState}
        onPress={() => Unlock(lockState)}
      />
    </View>
  );
};

const VideoFeed = () => {
  async function viewFeed() {
    fetch(serv_url + 'VideoFeed');
    //We need to start a new component here and change the current view
  }
  return (
    <View>
      <Button
        style={styles.button}
        title="Live Feed"
        onPress={() => viewFeed()}></Button>
    </View>
  );
};

const HomeScreen = ({navigation}) => {
  data = [
    {key: '1', value: 'Front Door'},
    {key: '2', value: 'Back Door'},
    {key: '3', value: 'Garage Door'},
    {key: '4', value: 'Device 4'},
    {key: '5', value: 'Deivce 5'},
  ];
  const [selected, setSelected] = useState('Home Lock');
  return (
    <View style={styles.homeScreenContainer}>
      <View style={styles.sectionContainer}>
        <SelectList
          setSelected={val => setSelected(val)}
          search={false}
          data={data}
          defaultOption={data[0]}
          save="value"
        />
        <View style={styles.homeScreenContainer}>
          <LockButton styles={styles.button} />
        </View>
        <View style={styles.homeScreenContainer}>
          <VideoFeed></VideoFeed>
        </View>
      </View>
    </View>
  );
};

const DeviceList = ({data}) => {
  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <View style={styles.nameContainer}>
          <Text style={styles.sectionTitle}>{item.name}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.lockState}>Button 1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.lockState}>Button 2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.lockState}>Button 3</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const MyDevices = ({navigation}) => {
  data = [
    {id: '1', name: 'Device 1'},
    {id: '2', name: 'Device 2'},
  ];
  return (
    <View style={styles.sectionContainer}>
      <DeviceList data={data}></DeviceList>
      <View style={styles.sectionContainer}>
        <View style={styles.buttonBottom}>
          <Button title="Add Device"></Button>
        </View>
      </View>
    </View>
  );
};

const VisitorList = ({visitordata}) => {
  const [visitors, setVisitors] = useState(visitordata);

  function removeVisitor({removeItem}) {
    return setVisitors(visitors.filter(item => item.id !== removeItem.id));
  }

  const renderItem = ({item}) => {
    return (
      <View style={styles.visitorsContainer}>
        <TouchableOpacity
          onPress={() => removeVisitor({visitordata, removeItem: item})}
          style={styles.visitorsContainerbutton}>
          <Ionicons
            style={styles.visitorsContainerbuttonText}
            name={'person-remove-outline'}
            size={25}
          />
        </TouchableOpacity>
        <Image
          source={{uri: item.profileImage}}
          style={styles.visitorsContainerProfileImage}
        />
        <View style={styles.visitorsContainerData}>
          <Text style={styles.visitorsContainername}>{item.name}</Text>
          <Text
            style={
              styles.visitorsContainerdate
            }>{`Last seen: ${item.dateLastSeen}`}</Text>
        </View>
      </View>
    );
  };
  return (
    <View>
      <FlatList
        data={visitors}
        keyExtractor={item => item.id.toString()}
        extraData={visitors}
        renderItem={renderItem}
      />
      <TouchableOpacity style={styles.visitorsContainerAddVisitor}>
        <Ionicons name={'person-add-outline'} size={35} color={'black'} />
      </TouchableOpacity>
    </View>
  );
};

const Visitors = ({navigation}) => {
  visitordata = [
    {
      id: '1',
      name: 'Test',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: './test_img/test.png',
    },
    {
      id: '2',
      name: 'Test2',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: './test_img/test.png',
    },
    {
      id: '3',
      name: 'Test3',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: './test_img/test.png',
    },
    {
      id: '4',
      name: 'Test4',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: './test_img/test.png',
    },
    {
      id: '5',
      name: 'Test5',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: './test_img/test.png',
    },
    {
      id: '6',
      name: 'Test6',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: './test_img/test.png',
    },
  ];
  return <VisitorList visitordata={visitordata}></VisitorList>;
};

const styles = StyleSheet.create({
  visitorsContainer: {
    height: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 20,
  },

  visitorsContainerProfileImage: {
    backgroundColor: 'lightgrey',
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  visitorsContainerData: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
  },

  visitorsContainername: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  visitorsContainerdate: {
    fontSize: 16,
  },
  visitorsContainerbutton: {
    position: 'absolute',
    top: 10,
    right: 10,

    width: 25,
    height: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  visitorsContainerbuttonText: {
    color: 'black',
  },

  visitorsContainerAddVisitor: {
    position: 'absolute',
    backgroundColor: 'lightskyblue',
    top: 590,
    right: 10,
    width: 55,
    height: 55,
    borderRadius: 50,

    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  homeScreenContainer: {
    flexDirection: 'column',
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
  },

  buttonBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },

  lockState: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },

  sectionContainer: {
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
