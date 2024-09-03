import React, { useEffect } from 'react';
import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './Account.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { doc, collection, addDoc, setDoc, getDoc, where, query, getDocs } from "firebase/firestore";
import validator from 'validator';
import { IoAlertCircle } from "react-icons/io5";
import { useUserContext } from '../../Contexts/UserContextProvider';
import { useTheme } from '../Theme/ThemeContext';
import colors from '../../colors';
import GoogleIcon from '@mui/icons-material/Google';

const Account: React.FC = () => {
    const { uid, setUid, userDocId, setUserDocId, currency, setCurrency, budget, setBudget, auth, db, usersRef } = useUserContext();
    const { isDarkMode } = useTheme();
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

    //fetch UserDocId from firestore after successful sign-In
    useEffect(() => {
        const fetchUserDocId = async () => {
          const userQuery = query(collection(db, "Users"), where("uid", "==", uid));
          const userSnapshot = await getDocs(userQuery);
      
          if (userSnapshot.size > 0) {
            const userDoc = userSnapshot.docs[0]; // Assuming a single match
            setUserDocId(userDoc.id);
          } else {
            console.error("No matching user document found");
            // Handle the case where no document matches
          }
        };
      
        if (signedIn && !userDocId) {
          fetchUserDocId();
        }
      }, [signedIn, uid, db]);

    useEffect(() => {
        if(uid && userDocId){
          try{
            const fetchSettings = async() => {
              const userDocRef = doc(db, "Users", userDocId);
              const docSnapshot = await getDoc(userDocRef);
                        if (docSnapshot.exists()){
                            const userSettings = docSnapshot.data();
                            setCurrency(userSettings.currency);
                            setBudget(userSettings.budget);  
                        } else {
                            console.error("No matching user document found");
                        }
            }
            fetchSettings();
    
          } catch (error) {
            console.error("Error fetching user settings:", error);
          }
          
        }
      }, [uid, userDocId, db]);


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

            //session storage 
            sessionStorage.setItem('signedIn', 'true');
            sessionStorage.setItem('userName', userName);
            sessionStorage.setItem('email', email);

            if (userCredential.user && userCredential.user.uid){

                // create user document with the uid as document id
                const userDocRef = doc(db, "Users", userCredential.user.uid);

                //define the user settings
                const userSettings = { 
                    uid: userCredential.user.uid,
                    currency, 
                    budget, 
                };

                await setDoc(userDocRef, userSettings);

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

    //sign in via gmail
    const handleGmailSignIn = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);

            if (result.user) {
                console.log("gmail sign in result ", result);
                const user = result.user;
                const userRef = doc(db, "Users", user.uid);
                const docSnapshot = await getDoc(userRef);
                
                //add user to db if not exist
                if(! docSnapshot.exists()){
                    await setDoc(userRef, {
                        uid: user.uid,
                        currency,
                        budget,
                      });
                }
                setSignedIn(true);
                sessionStorage.setItem('signedIn', 'true');
                sessionStorage.setItem('userName', user.displayName || '');
                sessionStorage.setItem('email', user.email || '');
                setUid(user.uid);
                setUserName(user.displayName);
                setEmail(user.email);
            }

        } catch (error: any) {
            console.error("Error during Google sign-in:", error.message);
        }
    }

    useEffect(() => {
        console.log("userDocId: ",userDocId);
      }, [userDocId]);

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
        setUid(null);
        setUserDocId(null);

    };

    //sign-in form
    const signInForm = () : JSX.Element => (
        <div className="account-content">
            <TextField 
                required 
                id="UserName" 
                label="User Name" 
                variant="outlined" 
                value={userName} 
                onChange={(e) => {setUserName(e.target.value)}}
            />
            <TextField 
                required id="Email" 
                label="Email" 
                type="email" 
                variant="outlined" 
                value={email} 
                onChange={(e) => {setEmail(e.target.value)}} 
                onBlur={ () => validateEmail(email) } 
                error={!isEmailValid} 
                helperText={isEmailValid ? '' : `${emailInvalidMessage}`}
            />
            <TextField 
                required 
                id="Password" 
                label="Password" 
                type="password"
                variant="outlined" 
                value={password} 
                onChange={(e) => {setPassword(e.target.value)}}
            />
            {signInErrorMessage && (
                <div className="error-message">
                    <IoAlertCircle style={{ width:'20px', height: '20px', color:'#E32327' }}/>
                    <span>{signInErrorMessage}</span>
                </div>
            )}
            {/*<div>uid:{uid}</div>*/}
            <div className="buttons">
                <Button 
                    variant="outlined"
                    size="small"
                    onClick={handleSignUp} 
                    disabled={!isAccountFormValid}
                    sx={{ color:"#4758DC", border:"1px solid #4758DC", '&:hover': {color:"#4758DC", border:"1px solid #4758DC"}}}
                >
                    Sign up
                </Button>
                <Button 
                    variant="contained"
                    size="small"
                    onClick={handleSignIn} 
                    disabled={!isAccountFormValid}
                    sx={{ backgroundColor:"#4758DC",'&:hover': {backgroundColor:"#4758DC"}}}
                >
                    Log in
                </Button>
                <Button 
                    variant="contained"
                    size="small"
                    onClick={handleGmailSignIn} 
                    startIcon={<GoogleIcon/>}
                    sx={{ backgroundColor:"#4758DC",'&:hover': {backgroundColor:"#4758DC"}}}
                >
                    Log in
                </Button>
            </div>
            
        </div>
    )


    //sign-in details
    const userDetails = () : JSX.Element => (
        <div className="account-content">
            <div className="account-login-info">
                <div className="account-login-info-name"
                    style={{ color: isDarkMode ? colors.Gallery : colors.Black}}
                >
                    {userName}
                </div>
                <div className="account-login-info-email">{email}</div>
                {/*<div>uid:{uid}</div>*/}
            </div>
            
            <Button 
                variant="outlined" 
                size="small"
                onClick={handleSignOut}
                sx={{ color:"#4758DC", border:"1px solid #4758DC", '&:hover': {color:"#4758DC", border:"1px solid #4758DC"}}}
            >
                Log out
            </Button>
        </div>
    )

  return (
    <div className="account">{signedIn ? userDetails() : signInForm()}</div>
    );
};

export default Account;