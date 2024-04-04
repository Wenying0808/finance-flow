import React, { useEffect } from 'react';
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './Account.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import validator from 'validator';
import { IoAlertCircle } from "react-icons/io5";
import { useUserContext } from '../../Contexts/UserContextProvider';

const Account: React.FC = () => {
    const { uid, setUid, auth, db } = useUserContext();

    const [email, setEmail] = useState<string>('');
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [emailInvalidMessage, setEmailInvalidMessage] =useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [signedIn, setSignedIn] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [isAccountFormValid, setIsAccountFormValid] = useState<boolean>(false);
    const [signInErrorMessage, setSignInErrorMessage] = useState<string | null>(null);
    /*const [uid, setUid] = useState<string|null>(null);*/

    //check if user is signed in from session Storage or local storage
    useEffect(() => {
        const isSignedIn = sessionStorage.getItem('signedIn') === 'true';
        setSignedIn(isSignedIn);
        if (isSignedIn) {
            setUserName(sessionStorage.getItem('userName') || '');
            setEmail(sessionStorage.getItem('email') || '');
        }
    }, []);

    //access uid when user is signed in
    useEffect(() => {
        //sets up a listener for authentication state changes
        const unsubscribe = firebase.auth().onAuthStateChanged((user)=>{
            if(user) {
                setUid(user.uid);
            } else{
                setUid(null);
            }
        });
        //detach the listener when the component unmounts
        return () => unsubscribe();
    },[])

    const validateEmail = (email: string) => {
         if(validator.isEmail(email)){
            setIsEmailValid(true);
            setEmailInvalidMessage('');  
        } else{
            setIsEmailValid(false);
            setEmailInvalidMessage('Please enter a valid email address');
        }
        setIsAccountFormValid(userName !== "" && password !== "");
    };

    useEffect(()=>{
        //update the form validability when any input changes
        setIsAccountFormValid(userName !== "" && password !== "");
    },[userName, email, password]);

    const handleSignUp = async () => {
        try{
            //create new user via firebase
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            //update sign in state after successfully sign up
            setSignedIn(true);
            if (userCredential.user && userCredential.user.uid){
                setUid(userCredential.user.uid);
            } else{
                setUid(null);
            }
            console.log(uid);
            
        } catch (error: any) {
            console.error('Error signing up:', error.message);
          }
    };

    //function to handle sign in 
    const handleSignIn = async (): Promise<void> => {
        try {
             // Sign in with email and password
            const userCredential = await auth.signInWithEmailAndPassword(email, password);

            // Update signedIn state to true
            setSignedIn(true);

            //session storage 
            sessionStorage.setItem('signedIn', 'true');
            sessionStorage.setItem('userName', userName);
            sessionStorage.setItem('email', email);

            if (userCredential.user && userCredential.user.uid){
                setUid(userCredential.user.uid);
            } else {
                setUid(null);
            }

          } catch (error: any) {
            setSignInErrorMessage("Invalid email or password")
          } finally {
            setIsAccountFormValid(true);
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
            <TextField required id="Email" label="Email" type="email" variant="outlined" value={email} onChange={(e) => {setEmail(e.target.value)}} onBlur={ () => validateEmail(email) } error={!isEmailValid} helperText={isEmailValid ? '' : `${emailInvalidMessage}`}/>
            <TextField required id="Password" label="Password" type="password"variant="outlined" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            {signInErrorMessage && (
                <div className="error-message">
                    <IoAlertCircle style={{ width:'20px', height: '20px', color:'#E32327' }}/>
                    <span>{signInErrorMessage}</span>
                </div>
            )}
            <div>uid:{uid}</div>
            <div className="buttons">
                <Button variant="outlined" onClick={handleSignUp} disabled={!isAccountFormValid}>Sign up</Button>
                <Button variant="contained" onClick={handleSignIn} disabled={!isAccountFormValid}>Sign in</Button>

            </div>
            
        </div>
    )


    //sign-in details
    const userDetails = () : JSX.Element => (
        <div className="account-content">
            <div className="account-login-info">
                <div className="account-login-info-name">{userName}</div>
                <div className="account-login-info-email">{email}</div>
                <div>uid:{uid}</div>
            </div>
            
            <Button variant="outlined" onClick={handleSignOut}>Sign out</Button>
        </div>
    )



  return (
    <div className="account">{signedIn ? userDetails() : signInForm()}</div>
    );
};

export default Account;