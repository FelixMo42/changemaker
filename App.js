import React from 'react'
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Button,
  ScrollView
} from 'react-native'
import {
  Camera,
  Permissions
} from 'expo'
import enviroment from './enviroment'
import firebase from 'firebase'

firebase.initializeApp({  
  apiKey: enviroment.staging['FIREBASE_API_KEY'],
  authDomain: enviroment.staging['FIREBASE_AUTH_DOMAIN'],
  //databaseURL: enviroment['FIREBASE_DATABASE_URL'],
  projectId: enviroment.staging['FIREBASE_PROJECT_ID'],
  storageBucket: enviroment.staging['FIREBASE_STORAGE_BUCKET'],
  //messagingSenderId: enviroment['FIREBASE_MESSAGING_SENDER_ID']
})

async function uploadImageAsync(uri) {  
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child("0");
  const snapshot = await ref.put(blob);

  blob.close();

  return await snapshot.ref.getDownloadURL();
}

export default class App extends React.Component {
  state = {
    hasCameraPermission: null,
    page: "main",
    type: Camera.Constants.Type.back,
    labels: []
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
      <ScrollView style={[styles.container, {padding: 10, paddingTop: 25}]}>
        { this.state.labels.map(item =>
          <View key={ item.name } style={styles.infoBox}>
            <Text>name: { item.name } ({ item.certainty })</Text>
            <Text>how to dispose</Text>
          </View>
        ) }
      </ScrollView>
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
    let photo = await this.camera.takePictureAsync()

    this.goto("info")

    var image = await uploadImageAsync(photo.uri)

    let body = JSON.stringify({
      requests: [
        {
          features: [
            { type: "LABEL_DETECTION", maxResults: 10 },
            //{ type: "LANDMARK_DETECTION", maxResults: 5 },
            //{ type: "FACE_DETECTION", maxResults: 5 },
            //{ type: "LOGO_DETECTION", maxResults: 0 },
            //{ type: "TEXT_DETECTION", maxResults: 5 },
            //{ type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
            //{ type: "SAFE_SEARCH_DETECTION", maxResults: 0 },
            //{ type: "IMAGE_PROPERTIES", maxResults: 0 },
            //{ type: "CROP_HINTS", maxResults: 5 },
            //{ type: "WEB_DETECTION", maxResults: 0 }
          ],
          image: {
            source: {
              imageUri: image
            }
          }
        }
      ]
    })

    let response = await fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=" +
        enviroment.staging["GOOGLE_CLOUD_VISION_API_KEY"],
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: body
      }
    )
    
    let json = await response.json()
    let data = json.responses[0]

    var labels = []
    for (let label of data.labelAnnotations) {
      labels.push({
        name: label.description,
        certainty: label.score
      })
    }
    this.setState({
      labels: labels
    })

    //console.log(response)
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
