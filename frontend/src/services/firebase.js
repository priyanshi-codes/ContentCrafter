import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
     apiKey: "AIzaSyARmhLVS20SGoEFLEwGaQ8uXy8lkGRYR2w",
     authDomain: "contentcrafter-ad4c1.firebaseapp.com",
     projectId: "contentcrafter-ad4c1",
     storageBucket: "contentcrafter-ad4c1.firebasestorage.app",
     messagingSenderId: "921353864621",
     appId: "1:921353864621:web:6e4c250f7916d42df28d24",
     measurementId: "G-LH3V1KGW77"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);