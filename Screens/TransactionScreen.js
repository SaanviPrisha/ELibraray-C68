import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions'
import { Header } from 'react-native-elements'
import db from '../Config'
import firebase from 'firebase'


export default class TransactionScreen extends React.Component {
  constructor() {
    super()
    this.state = {
      hasCamPerm: null,
      scanned: false,
      scannedData: "",
      buttonState: "normal",
      scannedStudentID: "",
      scannedBookID: ""
    }
  }
  getCameraPermissions = async (id) => {
    const {status} = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCamPerm: status === "granted",
      buttonState: id, 
      scanned: false
    })
  }
  handleBarcodeScanned = (type,data) => {
    if(this.state.buttonState == "bookId") {
      this.setState({
        scannedBookID: data,
        scanned: true,
        buttonState: "normal"
      })
    } else if(this.state.buttonState == "studentID") {
      this.setState({
        scannedStudentID: data,
        scanned: true,
        buttonState: 'normal'
      })
    }
  }
  handleTransaction = async () => {
    await db.collection("Books").doc(this.state.scannedBookID).get()
    .then((doc) => {
      var book = doc.data()
      if(book.bookAvailability == true) {
        this.initiateBookIssue()
      } else {
        this.initiateBookReturn()
      }
    }) 
    this.setState({
      scannedBookID: "",
      scannedStudentID: ""
    })
  }
  initiateBookIssue = async () => {
    await db.collection("Transactions").add({
      bookId: this.state.scannedBookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      studentID: this.state.scannedStudentID,
      transactionType: "issue"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({
      bookAvailability: false
    })
    db.collection("Students").doc(this.state.scannedStudentID).update({
      BooksIssued: firebase.firestore.FieldValue.increment(1)
    })
  }
  initiateBookReturn = async () => {
    await db.collection("Transactions").add({
      bookId: this.state.scannedBookID,
      date: firebase.firestore.Timestamp.now().toDate(),
      studentID: this.state.scannedStudentID,
      transactionType: "return"
    })
    db.collection("Books").doc(this.state.scannedBookID).update({
      bookAvailability: true
    })
    db.collection("Students").doc(this.state.scannedStudentID).update({
      BooksIssued: firebase.firestore.FieldValue.increment(-1)
    })
  }
  render() {
    const hasCamPerm = this.state.hasCamPerm
    const buttonState = this.state.buttonState
    const scanned = this.state.scanned
    if(hasCamPerm == true && buttonState != "normal") {
      return(
        <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={scanned ? undefined: this.handleBarcodeScanned}/>
      )
    } else if(buttonState == "normal") {
      return (
        <View style={styles.container}>
          <View style={styles.center}>
            <Header containerStyle={{justifyContent: "space-around", width: '100%'}} centerComponent={{text: "E-Library", style: {color: '#a1cced', fontSize: 25}}}></Header>
            <Image source={require('../assets/booklogo.jpg')} style={styles.image}/>
          </View>
          <View style={styles.center}>
            <TextInput placeholder="Book ID" style={styles.textInput} onChangeText={(text) => {
              this.setState({
                scannedBookID: text
              })
            }}/>
            <TouchableOpacity onPress={() => {
              this.getCameraPermissions('bookID')
            }} style={styles.scanButton}>
            <Text style={styles.ScanButtonText}>Scan</Text>
          </TouchableOpacity>
          </View>
          <View style={styles.center}>
            <TextInput placeholder="Student ID" style={styles.textInput} onChangeText={(text) => {
              this.setState({
                scannedStudentID: text
              })
            }}/>
            <TouchableOpacity onPress={() => {
              this.getCameraPermissions('studentID')
            }} style={styles.scanButton}>
            <Text style={styles.ScanButtonText}>Scan</Text>
          </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => {this.handleTransaction()}}>
            <Text style={styles.ScanButtonText}>Sumbit</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scanButton: {
    backgroundColor: '#871010',
    width: 100, 
    height: 50,
    marginLeft: 230,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginTop: -50,
  },
  ScanButtonText: {
    fontSize: 20, 
    fontWeight: 'bold',
    textAlign: 'center'
  },
  textInput: {
    borderWidth: 2,
    width: 200,
    height: 50,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 30,
  },
  image: {
    width: 100, 
    height: 100, 
    marginTop: 30
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})
