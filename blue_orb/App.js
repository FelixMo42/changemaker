import React from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import { Camera, Permissions } from 'expo'
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  render() {
    const { hasCameraPermission } = this.state

    if (hasCameraPermission) {
      return (
        <View style={styles.container}>
              <Camera
                style={{ flex: 1 }}
                type={ this.state.type }
              >
                <TouchableHighlight
                  onPress={this.onClicked}
                  style={{flex: 1}}
                >
                  <View></View>
                </TouchableHighlight>
              </Camera>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
        </View>
      )
    }
  }

  onClicked() {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});
