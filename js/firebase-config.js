// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDziK4bVUjy-IXprnJ_yr8ysHIWHVzOmds",
    authDomain: "globodespachanteapp.firebaseapp.com",
    projectId: "globodespachanteapp",
    storageBucket: "globodespachanteapp.firebasestorage.app",
    messagingSenderId: "88216133278",
    appId: "1:88216133278:web:7ab905dac35589869b658f",
    measurementId: "G-D10XBW579Z"
};

// Initialize Firebase
// Note: 'firebase' is available globally via the CDN scripts in index.html
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

console.log("Firebase initialized (Compat Mode)");
