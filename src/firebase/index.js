import * as firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyDx7RPAEcUI-G4ScUCGsFVQRW7mq1ZmkFU',
  authDomain: 'attendances-62382.firebaseapp.com',
  databaseURL: 'https://attendances-62382.firebaseio.com',
  projectId: 'attendances-62382',
  storageBucket: 'gs://attendances-62382.appspot.com',
  messagingSenderId: '877869699076'
}

export default firebase.initializeApp(config)
