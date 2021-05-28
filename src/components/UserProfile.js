import React from 'react';
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import {
  useDocumentData,
} from "react-firebase-hooks/firestore";

const firestore = firebase.firestore();

export default function UserProfile({
    match: {
      params: { id },
    },
  }) {

    const profileQuery = firestore.collection("scores").doc(id);
    const [profileData] = useDocumentData(profileQuery)

    return (
        <div className='text-white'>
            <h1>User Profile id: {id}</h1>
            {profileData && profileData.username && <h1>User Profile Username: {profileData.username}</h1>}
        </div>
    );
}