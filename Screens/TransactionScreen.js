import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions'


export default class TransactionScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      hasCamPerm: null,
      scanned: false,
      scannedData: "",
      buttonState: "normal"
    }
  }
  getCameraPermissions = async () => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCamPerm: status === "granted",
      buttonState: "clicked"
    })
  }
  handleBarcodeScanned = (type,data) => {
    this.setState({
      scannedData: data,
      scanned: true,
      buttonState: "normal"
    })
  }
  render() {
    const hasCamPerm = this.state.hasCamPerm
    const buttonState = this.state.buttonState
    const scanned = this.state.scanned
    if(hasCamPerm == true && buttonState == "clicked") {
      return(
        <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={scanned ? undefined: this.handleBarcodeScanned}/>
      )
    } else if(buttonState == "normal") {
      return (
        <View style={styles.container}>
          <Text>{hasCamPerm == true ? this.state.scannedData : "Request for camera permissions"}</Text>
          <View>
            <TextInput placeholde="Book ID" style={styles.textInput}/>
            <TouchableOpacity onPress={this.getCameraPermissions} style={styles.scanButton}>
            <Text style={styles.ScanButtonText}>Scan</Text>
          </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    backgroundColor: '#871010',
    width: 100, 
    height: 50, 
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  ScanButtonText: {
    fontSize: 20, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textInput: {
    borderWidth: 2,
    width: 100,
    height: 50,
    borderRadius: 5,
    marginTop: 200
  }
});
