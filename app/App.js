import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

const TabNav = createBottomTabNavigator();

function TabNavs() {
  return (
    <TabNav.Navigator>
      <TabNav.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
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

const HomeScreen = ({navigation}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text fontSize={120}>Dashboard goes here</Text>
    </View>
  );
};

const MyDevices = ({navigation}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text>My Devices</Text>
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
