import React, { useContext } from 'react';
import { Switch, Route, Link, useRouteMatch, Redirect } from 'react-router-dom';
import { AuthContext } from '../Context/firebaseContext';
import './Main.css';
import Game from './Game.js';
import GameOnline from './GameOnline';
import firebase from '../firebase';
import Profile from './Profile';

export default function Main() {
    const { user } = useContext(AuthContext);

    let { path, url } = useRouteMatch();

    if (!user) {
        return <Redirect to='/' />;
    }

    return (
        <div>
            <header className='header'>
                <div style={{ cursor: 'default' }}>8 Puzzle Game</div>
                <div style={{ display: 'flex', gap: '30px', fontSize: '16px' }}>
                    <div className='linktext'>
                        <Link
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                            }}
                            to={url}
                        >
                            Play
                        </Link>
                    </div>
                    <div className='linktext'>
                        <Link
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                            }}
                            to={`${url}/profile`}
                        >
                            Profile
                        </Link>
                    </div>
                    <div
                        onClick={() => firebase.auth().signOut()}
                        className='linktext'
                    >
                        Sign out
                    </div>
                </div>
            </header>
            <Switch>
                <Route exact path={path}>
                    <Game />
                </Route>
                <Route path={`${path}/gameonline`}>
                    <GameOnline />
                </Route>
                <Route path={`${path}/profile`}>
                    <Profile />
                </Route>
            </Switch>
        </div>
    );
}
