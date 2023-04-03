import React from 'react';
import './App.css';

// firebase SDK
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// hooks
import { initializeApp } from "firebase/app";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getFirestore, query, orderBy, limit } from "firebase/firestore";
import { collection } from "firebase/firestore";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBXrimxJdwiFlzrtf6TiMXf60eoqf7CZEE",
  authDomain: "superchat-practice-215000.firebaseapp.com",
  projectId: "superchat-practice-215000",
  storageBucket: "superchat-practice-215000.appspot.com",
  messagingSenderId: "457434483616",
  appId: "1:457434483616:web:ae48fdf683d1d16968b2c5",
  measurementId: "G-D5HBJ648W3"
};

const app = firebase.initializeApp(firebaseConfig)

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className="App">
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  )
}

const SignOut = () => {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

const ChatRoom = () => {

  //const messagesRef = firestore.collection('messages')
  const messagesRef = collection(db, "messages")
  //const query = messagesRef.orderBy('createdAt').limit(25)
  const q = query(messagesRef, orderBy("createdAt"), limit(25))

  const [messages, loadingMessages, error] = useCollectionData(q, { idField: "id" })
  console.log('messages:', messages)
  console.log('error:', error)

  return (
    <>
      <div>chatroom</div>
      <div>
        {messages && messages.map(msg => {
          <ChatMessage key={msg.id} message={msg} />
        })}
      </div>
    </>

  )
}

const ChatMessage = ({ message }) => {
  const { text, uid } = message

  return (
    <p>{text}</p>
  )
}
