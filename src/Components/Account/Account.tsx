import React, { useEffect } from 'react';
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './Account.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDWajFmlQ1rtmLEqrDxq5ytF6w2hktj_fc",
    authDomain: "finance-flow-ebfc3.firebaseapp.com",
    projectId: "finance-flow-ebfc3",
    storageBucket: "finance-flow-ebfc3.appspot.com",
    messagingSenderId: "532090806268",
    appId: "1:532090806268:web:886f032786f846be11dc79",
    measurementId: "G-9KNBRJQFLR"
  };


// Check if Firebase is not already initialized
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();


const Account: React.FC = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signedIn, setSignedIn] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');

    //check if user is signed in from session Storage or local storage
    useEffect(() => {
        const isSignedIn = sessionStorage.getItem('signedIn') === 'true';
        setSignedIn(isSignedIn);
        if (isSignedIn) {
            setUserName(sessionStorage.getItem('userName') || '');
            setEmail(sessionStorage.getItem('email') || '');
        }
    }, []);

    //function to handle sign in 
    const handleSignIn = async () : Promise<void> => {
        try {
            // Sign in with email and password using Firebase
            await auth.signInWithEmailAndPassword(email, password);
            // Update signedIn state to true
            setSignedIn(true);
            sessionStorage.setItem('signedIn', 'true');
            sessionStorage.setItem('userName', userName);
            sessionStorage.setItem('email', email);
          } catch (error: any) {
            console.error('Error signing in:', error.message);
          }
    };

    //function to handle sign out

    const handleSignOut = () : void => {
        // Sign out the user using Firebase
        auth.signOut();

        sessionStorage.removeItem('signedIn');
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('email');

        setSignedIn(false);
        setUserName('');
        setEmail('');
        setPassword('');

    };

    //sign-in form
    const signInForm = () : JSX.Element => (
        <div className="account-content">
            <TextField required id="UserName" label="User Name" variant="outlined" value={userName} onChange={(e) => {setUserName(e.target.value)}}/>
            <TextField required id="Email" label="Email" type="email" variant="outlined" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
            <TextField required id="Password" label="Password" type="password"variant="outlined" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            <div className="buttons">
                
                <Button variant="contained" onClick={handleSignIn}>Sign in</Button>
            </div>
            
        </div>
    )


    //sign-in details
    const userDetails = () : JSX.Element => (
        <div className="account-content">
            <div className="account-login-info">
                <div className="account-login-info-name">{userName}</div>
                <div className="account-login-info-email">{email}</div>
            </div>
            
            <Button variant="outlined" onClick={handleSignOut}>Sign out</Button>
        </div>
    )



  return (
    <div className="account">{signedIn ? userDetails() : signInForm()}</div>
    );
};

export default Account;