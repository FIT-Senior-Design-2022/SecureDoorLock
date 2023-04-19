import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SelectList} from 'react-native-dropdown-select-list';
import {launchImageLibrary} from 'react-native-image-picker';
import {NodePlayerView} from 'react-native-nodemediaclient';

let serv_url = 'http://10.154.4.171:3000/';
const TabNav = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
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

const LockButton = ({selected}) => {
  const [lockState, setlockState] = useState('Unlock');

  async function Unlock(selected) {
    const body = JSON.stringify({
      lockState: lockState,
    });
    let response;
    try {
      response = await fetch(serv_url + lockState);
    } catch (error) {
      console.debug(error);
    }
    if (response.ok) {
      response = await response.json();
      setlockState(response.lockState === 'Unlock' ? 'Unlock' : 'Lock');
      console.debug(lockState);
    } else {
      console.debug('There was an Error with Unlocking' + {selected});
      Alert.alert(
        'Issue Connecting ',
        'There seems to be an issue connecting to the lock ',
        [
          {
            text: 'OK',
            style: 'OK',
          },
        ],
      );
    }
  }

  return (
    <TouchableOpacity
      onPress={() => Unlock(selected)}
      style={{
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        height: 160,
        width: 160,
      }}>
      <View>
        <Ionicons
          size={150}
          name={
            lockState === 'Lock' ? 'lock-closed-outline' : 'lock-open-outline'
          }
        />
      </View>
    </TouchableOpacity>
  );
};

const VideoFeed = ({selected, url, videoActive, setVideoActive}) => {
  async function viewFeed() {
    let response = await fetch(serv_url + 'VideoFeed');
    if (response.ok) {
      response = await response.json();
      url = response.url;
      console.debug(currentConnection);
    } else {
      console.debug('There was an Error with Unlocking' + {selected});
      Alert.alert(
        'Issue Connecting ',
        'There seems to be an issue connecting to the lock ',
        [
          {
            text: 'OK',
            style: 'OK',
          },
        ],
      );
    }
  }

  return (
    <TouchableOpacity
      onPress={() => {
        viewFeed(selected);
        setVideoActive(!videoActive);
      }}
      style={{
        backgroundColor: 'lightgrey',
        borderRadius: 10,
        height: 160,
        width: 160,
      }}>
      <View style={{alignItems: 'center'}}>
        <Ionicons size={150} name="videocam-outline" />
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = ({navigation}) => {
  var url;
  var data = [
    {key: '1', value: 'Front Door'},
    {key: '2', value: 'Back Door'},
    {key: '3', value: 'Garage Door'},
    {key: '4', value: 'Device 4'},
    {key: '5', value: 'Deivce 5'},
  ];
  const [videoActive, setVideoActive] = useState(true);
  const [selected, setSelected] = useState(data);

  return (
    <View style={styles.homeScreenContainer}>
      <NodePlayerView
        style={{height: 300}}
        ref={vp => {
          this.vp = vp;
        }}
        inputUrl={'rtmp://10.154.6.105:1935/live/stream'}
        scaleMode={'ScaleAspectFit'}
        bufferTime={300}
        maxBufferTime={1000}
        autoplay={true}
      />
      <View style={styles.homeScreenContainerData}>
        <View style={styles.homeScreenContainerSubsection}>
          <SelectList
            setSelected={val => setSelected(val)}
            search={false}
            data={data}
            defaultOption={selected}
            save="value"
          />
        </View>
      </View>
      <View style={styles.homeScreenContainerInput}>
        <LockButton
          style={styles.homeScreenContainerSubsection}
          selected={selected.value}
        />
        <VideoFeed
          videoActive={videoActive}
          setVideoActive={() => setVideoActive(!videoActive)}
          style={styles.homeScreenContainerSubsection}
          selected={selected}
          url={url}
        />
      </View>
    </View>
  );
};

const StatusIcon = ({state, status}) => {
  const size = 50;
  const fail = 'DarkRed';
  const success = 'DarkGreen';
  let iconName = '';
  let color = '';
  if (status == 'Connection') {
    iconName = 'pulse-outline';
    color = state ? {success} : {fail};
  } else if (status == 'VideoConnection') {
    iconName = state ? 'videocam-outline' : 'videocam-outline';
    color = state ? {success} : {fail};
  } else if (status == 'Visitor') {
    iconName = 'people-circle-outline';
    color = state ? {success} : {fail};
  }

  return (
    <View style={styles.deviceContainerStatusValid}>
      <Ionicons name={iconName} size={size} color={fail} />
    </View>
  );
};

const DeviceList = ({data}) => {
  const [deviceName, setDevice] = useState(data);
  const [deviceConnection, setConnection] = useState(false);
  const [deviceVideoConnection, setConnectionVideo] = useState(false);
  const [deviceVisitor, setVisitors] = useState(false);

  const renderItem = ({item}) => {
    return (
      <View style={styles.deviceMainContainer}>
        <View style={styles.deviceContainerData}>
          <Text style={styles.deviceContainerData}>{item.name}</Text>
          <StatusIcon state={deviceConnection} status={'Connection'} />
          <StatusIcon
            state={deviceVideoConnection}
            status={'VideoConnection'}
          />
          <StatusIcon state={deviceVisitor} status={'Visitor'} />
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
  var data = [
    {id: '1', name: 'Front Door'},
    {id: '2', name: 'Back Door'},
    {id: '3', name: 'Garage Door'},
    {id: '4', name: 'Device 4'},
    {id: '5', name: 'Deivce 5'},
  ];
  return (
    <View style={styles.sectionContainer}>
      <DeviceList data={data} />
      <View style={styles.sectionContainer}>
        <View style={styles.buttonBottom}>
          <Button title="Add Device" />
        </View>
      </View>
    </View>
  );
};

function AddVisModal({addModelVisable, changeState}) {
  [selectedPhoto, setSelectedPhoto] = useState(null);
  async function selectImage() {
    options = {
      mediaType: 'photo',
    };
    const result = await launchImageLibrary(options);
    setSelectedPhoto(result);
  }
  return (
    <Modal
      transparent={true}
      visible={addModelVisable}
      onRequestClose={() => changeState}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-around',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        }}>
        <View style={styles.addVisitorsLayout}>
          <Image
            source={selectedPhoto ? {uri: selectedPhoto.uri} : null}
            style={styles.visitorsContainerProfileImage}
          />
          <Text style={styles.addVisitorsTitle}>Add New Visitor</Text>
          <TextInput
            placeholder="New Visitor"
            style={styles.addVisitorsInput}
          />
          <Button
            on
            onPress={() => selectImage()}
            title="Upload Photo"></Button>
          <Button title="Create Visitor"></Button>
        </View>
      </View>
    </Modal>
  );
}

const VisitorList = ({visitordata, navigation}) => {
  const [visitors, setVisitors] = useState(visitordata);
  const [addModelVisable, setaddModelVisable] = useState(false);
  function removeVisitor({removeItem}) {
    Alert.alert(
      'Confrim Visitor Removal',
      'Are you sure you want to remove this visitor?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          test: 'OK',
          onPress: () => {
            return setVisitors(
              visitors.filter(item => item.id !== removeItem.id),
            );
          },
        },
      ],
    );
  }

  const renderItem = ({item}) => {
    return (
      <View style={styles.visitorsContainer}>
        <AddVisModal
          addModelVisable={addModelVisable}
          changeState={() =>
            setaddModelVisable(!addModelVisable)
          }></AddVisModal>
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
          source={item.profileImage.toString()}
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
        keyExtractor={item => item.id}
        extraData={visitors}
        renderItem={renderItem}
      />
      <TouchableOpacity
        onPress={() => setaddModelVisable(true)}
        style={styles.visitorsContainerAddVisitor}>
        <Ionicons name={'person-add-outline'} size={35} color={'black'} />
      </TouchableOpacity>
    </View>
  );
};

const Visitors = ({navigation}) => {
  var visitordata = [
    {
      id: '1',
      name: 'Luke',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: require('./assets/luke.jpg'),
    },
    {
      id: '2',
      name: 'James',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: require('./assets/james.jpg'),
    },
    {
      id: '3',
      name: 'Warren',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: require('./assets/warren.jpg'),
    },
    {
      id: '4',
      name: 'Chris',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: require('./assets/chris.jpg'),
    },
    {
      id: '5',
      name: 'Dr. Silaghi',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: require('./assets/Silaghi.jpg'),
    },
    {
      id: '6',
      name: 'Dr. Chan',
      dateLastSeen: '4/3/2023 1:10PM',
      profileImage: require('./assets/chan.jpg'),
    },
  ];
  return <VisitorList visitordata={visitordata} />;
};

const styles = StyleSheet.create({
  deviceMainContainer: {
    backgroundColor: 'white',
    height: 150,
    borderRadius: 10,
    gap: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  deviceContainerData: {
    fontSize: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexGrow: 1,
  },
  deviceContainerStatusValid: {
    padding: 5,
    height: 60,
    width: 60,
    backgroundColor: 'DarkGreen',
  },
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
    top: 540,
    right: 10,
    width: 55,
    height: 55,
    borderRadius: 60,
    shadowColor: 'black',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addVisitorsModal: {
    backgroundColor: 'red',
    flex: 1,
    alignitems: 'center',
    justifycontent: 'center',
  },
  addVisitorsBackground: {
    flex: 1,
    flexdirection: 'column',
    backgroundColor: 'Grey',
  },
  addVisitorsLayout: {
    height: '50%',
    width: '80%',
    borderRadius: 15,
    borderWidth: 2,
    padding: 16,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  addVisitorsTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    padding: 10,
  },
  addVisitorsPhotoUpload: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 25,
  },
  addVisitorsInput: {
    borderColor: 'gray',
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    paddingBottom: 10,
  },
  homeScreenContainer: {
    display: 'flex',
    flexGrow: 1,
    padding: 16,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  homeScreenContainerData: {
    display: 'flex',
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
  },

  homeScreenContainerSubsection: {
    margin: 20,
    display: 'flex',
    alignContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },
  homeScreenContainerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'flex-start',
    justifyContent: 'space-around',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  buttonBottom: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16,
  },

  button: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  lockState: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
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
