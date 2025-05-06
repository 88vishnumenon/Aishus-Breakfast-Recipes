import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCPVAOl1kox_HTjRvR7PN3HzviAMiDOOc8",
    authDomain: "aishu-breakfast-recipes.firebaseapp.com",
    projectId: "aishu-breakfast-recipes",
    storageBucket: "aishu-breakfast-recipes.firebasestorage.app",
    messagingSenderId: "502310395559",
    appId: "1:502310395559:web:d240411e9db2c63d484582"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 