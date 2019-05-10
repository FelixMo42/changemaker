import React from 'react'
import { StyleSheet, View, TouchableHighlight, Text, Button } from 'react-native'
import { Camera, Permissions } from 'expo'

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    page: "main",
    type: Camera.Constants.Type.back,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  render() {
    const { page } = this.state

    console.log("rendering " + page + " page")

    switch (page) {
      case "main" : return this.renderMainPage()
      case "info" : return this.renderInfoPage()
      case "history" : return this.renderHistoryPage()
      case "settings" : return this.renderSettingsPage()
    }
  }

  /// rendering ///

  renderMainPage() {
    return (
      <View style={styles.container}>
        <Camera
          style={{ flex: 1 }}
          type={ this.state.type }
          ref={ ref => { this.camera = ref } }
        >
          <TouchableHighlight
            onPress={ () => { this.takePicture() } }
            style={{flex: 1}}
          >
            <View>
              <Button
                onPress={ () => { this.goto("history") } }
                title="history"
              />
              <Button
                onPress={ () => { this.goto("settings") } }
                title="settings"
              />
            </View>
          </TouchableHighlight>
        </Camera>
      </View>
    ) 
  }

  renderInfoPage() {
    return (
      <View style={[styles.container, {padding: 10, paddingTop: 25}]}>
        <View style={styles.infoBox}>
          <Text>name: Plastic</Text>
          <Text>how to dispose</Text>
        </View>
        <View style={styles.infoBox}>
          <Text>name: Plastic</Text>
          <Text>how to dispose</Text>
        </View>
      </View>
    )
  }

  renderHistoryPage() {
    return (
      <View style={styles.container}>
      </View>
    )
  }

  renderSettingsPage() {
    return (
      <View style={styles.container}>
      </View>
    )
  }

  /// functions ///

  goto(page) {
    this.setState(state => ({page: page}))
  }

  async takePicture() {
    this.goto("info")

    //let photo = await this.camera.takePictureAsync()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  infoBox: {
    padding: 10,
    margin: 5,
    fontSize: 25,
    borderColor: "black",
    borderWidth: 5,
    borderRadius: 10
  }
});
