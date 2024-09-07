// firebase.ts (or firebase.js)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {

    apiKey: "AIzaSyCnnpVnNcV18NI6xZLFWmBM4-dMUuwRyuY",

    authDomain: "saas-landingpage.firebaseapp.com",

    projectId: "saas-landingpage",

    storageBucket: "saas-landingpage.appspot.com",

    messagingSenderId: "453700964046",

    appId: "1:453700964046:web:92470d96081594bf110a9f",

    measurementId: "G-RWPBF9W67F"

  };


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
