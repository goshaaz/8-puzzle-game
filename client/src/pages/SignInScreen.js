import React, {useContext} from 'react'
import app from '../firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import frontimg from '../assets/frontimg.png'
import { AuthContext } from "../Context/firebaseContext";
import { Redirect } from 'react-router-dom';

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        app.auth.FacebookAuthProvider.PROVIDER_ID,
      app.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => false,
    },
  };
  

export default function SignInScreen() {

    const { user } = useContext(AuthContext);

    if(user){
        return <Redirect to="/app"/>
    }

    return (
        <div style={{paddingTop:"100px"}}>
            <h1 style={{textAlign:"center", fontSize:"30px"}}>8 Puzzle Game</h1>
        <p style={{textAlign:"center", fontSize:"20px", paddingBottom:"10px"}}>Sign in to play!</p>
        <div>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={app.auth()} />
        </div>
        </div>
    )
}
