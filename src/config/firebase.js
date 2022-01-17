import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore/lite';

// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration

const firebaseConfig = {
  apiKey: "AIzaSyCW7ks1ihzyy2iFxEpPtsELWZyAXIdN_ow",
  authDomain: "myacc-a769f.firebaseapp.com",
  projectId: "myacc-a769f",
  storageBucket: "myacc-a769f.appspot.com",
  messagingSenderId: "986941649268",
  appId: "1:986941649268:web:13254eb6bb22ea2b9bfc21"
};

/*
const firebaseConfig = {
    apiKey: "AIzaSyBqpvfI415O7VVBZkE1BdGGyB1sYJ5nby8",
    authDomain: "trademate-1cf3f.firebaseapp.com",
    projectId: "trademate-1cf3f",
    storageBucket: "trademate-1cf3f.appspot.com",
    messagingSenderId: "82203407775",
    appId: "1:82203407775:web:265d2cf428105d210a79aa"
  };
*/

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

