import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

const PopupNotification = ({
  showPopup,
  imageSource,
  visitorName,
  onUnlock,
  onDeny,
}) => {
  const [modalVisible, setModalVisible] = useState(showPopup);

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleUnlock = () => {
    onUnlock();
    handleClose();
  };

  const handleDeny = () => {
    onDeny();
    handleClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image source={imageSource} style={styles.image} />
          <Text style={styles.text}>Visitor Detected {visitorName}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleUnlock}>
              <Text style={styles.buttonText}>Unlock</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleDeny}>
              <Text style={styles.buttonText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PopupNotification;
