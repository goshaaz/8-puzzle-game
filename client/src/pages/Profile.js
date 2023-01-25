import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import firebase from 'firebase';
import produce from 'immer';

export default function Profile() {
    const [userHistory, setUserHistory] = useState([]);

    const history = useHistory();

    var listItems;

    useEffect(() => {
        axios
            .post('https://eightpuzzlegame.onrender.com/api/profile', {
                userId: firebase.auth().currentUser.email,
            })
            .then((res) => {
                var arr = [];
                res.data.forEach((element) => {
                    arr.push(element);
                });

                const newtest = produce(userHistory, (userCopy) => {
                    for (var i = 0; i < arr.length; i++) {
                        userCopy.push(arr[i]);
                    }
                });
                setUserHistory(newtest);

                listItems = res.data.map((game, idx) => (
                    <div key={idx}>{game.difficulty}</div>
                ));
                console.log(listItems);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <div
            style={{
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
                position: 'absolute',
                paddingTop: '20px',
            }}
        >
            Your profile{' '}
            <div style={{ fontWeight: 'bold' }}>
                {firebase.auth().currentUser.email}
            </div>
            <br></br>
            <div style={{ fontWeight: 'bold' }}>Game history</div>
            <ul>{listItems}</ul>
            <h1></h1>
            {userHistory.map((val, idx) =>
                !val.teammate ? (
                    <div style={{ marginTop: '5px', padding: '10px' }}>
                        <b>Game {idx + 1}:</b> Number of moves:{' '}
                        {val.number_of_moves} Lowest possible:{' '}
                        {val.lowest_possible} Difficulty: {val.difficulty}{' '}
                    </div>
                ) : (
                    <div style={{ marginTop: '5px', padding: '10px' }}>
                        {' '}
                        <b>Game {idx + 1}: </b>Online match. Teammate:{' '}
                        {val.teammate}{' '}
                        <div>
                            Number of moves: {val.number_of_moves} Difficulty:{' '}
                            {val.difficulty}{' '}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
