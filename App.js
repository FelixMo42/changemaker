import React from 'react'
import { StyleSheet, View, TouchableHighlight } from 'react-native'
import { Camera, Permissions } from 'expo'

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
    console.log("app rendering")

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
    console.log("click")
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});
