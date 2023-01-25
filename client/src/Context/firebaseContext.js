import React, { useEffect, useState } from 'react';
import firebase from '../firebase';

//2.
export const AuthContext = React.createContext();

//3.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged((user) => {
                setUser(user);
                setLoading(false);
            });

        return () => unregisterAuthObserver();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading === false ? children : <div></div>}
        </AuthContext.Provider>
    );
};
