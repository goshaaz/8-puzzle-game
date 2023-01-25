import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Astarsearch } from './Astarsearch';
import react0 from '../assets/react0.png';
import react1 from '../assets/react1.png';
import react2 from '../assets/react2.png';
import react3 from '../assets/react3.png';
import react4 from '../assets/react4.png';
import react5 from '../assets/react5.png';
import react6 from '../assets/react6.png';
import react7 from '../assets/react7.png';
import produce from 'immer';
import axios from 'axios';
import firebase from '../firebase';
import io from 'socket.io-client';
import PuffLoader from 'react-spinners/PuffLoader';
import { useLocation, Redirect } from 'react-router-dom';
import './GameOnline.css';

let socket;

export default function GameOnline() {
    const [pos, setPos] = useState([
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
    ]);
    const [emptyPos, setEmptyPos] = useState([2, 2]);
    const [bgColor, setBgColor] = useState('blue');
    const [visibility, setVisibility] = useState('block');
    const [visibilitySolve, setSolveVisibility] = useState('none');
    const [chosenDifficulty, setChosenDifficulty] = useState('easy');
    const [moves, setMoves] = useState(0);
    const [minMoves, setMinMoves] = useState(0);
    const [yourturn, setTurn] = useState(false);
    const [foundGame, setFoundGame] = useState(false);
    const [teammate, setTeammate] = useState('');
    const [chat, setChat] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);

    const allRefs = useRef([
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
        React.createRef(),
    ]);

    const imgarray = [
        react0,
        react1,
        react2,
        react3,
        react4,
        react5,
        react6,
        react7,
    ];

    const location = useLocation();
    let history = useHistory();

    useEffect(() => {
        setVisibility('none');
        setSolveVisibility('flex');

        var connectionOptions = {
            reconnectionAttempts: 2,
            timeout: 10000,
            transports: ['websocket'],
            query: { onlineId: location.state.params },
        };

        socket = io.connect(
            'https://eightpuzzlegame.onrender.com',
            connectionOptions
        );

        socket.on('your turn', () => {
            setTurn(true);
        });

        socket.on('teammateId', (teammateId) => {
            setTeammate(teammateId);
        });

        socket.on('teammate disconnected', () => {
            alert('Teammate disconnected');
            setTimeout(() => {
                history.push('/app');
            }, 3000);
        });

        socket.on('message', ({ name, message }) => {
            setChat((chat) => [...chat, { name, message }]);
        });

        socket.on('puzzle updated', (updatedPuzzle) => {
            console.log('UR TURN');
            const newtest = produce(pos, (posCopy) => {
                for (var i = 0; i < 9; i++) {
                    posCopy[i] = updatedPuzzle[i];
                }
            });
            setPos(newtest);
            setEmptyPos(newtest[8]);
            setTurn(true);
            if (
                newtest[0][0] == 0 &&
                newtest[0][1] == 0 &&
                newtest[1][0] == 0 &&
                newtest[1][1] == 1 &&
                newtest[2][0] == 0 &&
                newtest[2][1] == 2 &&
                newtest[3][0] == 1 &&
                newtest[3][1] == 0 &&
                newtest[4][0] == 1 &&
                newtest[4][1] == 1 &&
                newtest[5][0] == 1 &&
                newtest[5][1] == 2 &&
                newtest[6][0] == 2 &&
                newtest[6][1] == 0 &&
                newtest[7][0] == 2 &&
                newtest[7][1] == 1
            ) {
                setTimeout(function () {
                    alert('SOLVED');
                    history.push('/app');
                }, 250);
                setSolveVisibility('none');
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        setMoves(moves + 1);
        socket.on('start state', (puzzleStart) => {
            setFoundGame(true);
            const newtest = produce(pos, (posCopy) => {
                for (var i = 0; i < 9; i++) {
                    posCopy[i] = puzzleStart[i];
                }
            });
            setPos(newtest);
            setEmptyPos(newtest[8]);
        });
        if (
            pos[0][0] == 0 &&
            pos[0][1] == 0 &&
            pos[1][0] == 0 &&
            pos[1][1] == 1 &&
            pos[2][0] == 0 &&
            pos[2][1] == 2 &&
            pos[3][0] == 1 &&
            pos[3][1] == 0 &&
            pos[4][0] == 1 &&
            pos[4][1] == 1 &&
            pos[5][0] == 1 &&
            pos[5][1] == 2 &&
            pos[6][0] == 2 &&
            pos[6][1] == 0 &&
            pos[7][0] == 2 &&
            pos[7][1] == 1 &&
            gameStarted
        ) {
            axios.post('https://eightpuzzlegame.onrender.com/api/post', {
                userId: firebase.auth().currentUser.email,
                number_of_moves: moves - 1,
                difficulty: chosenDifficulty,
                lowest_possible: minMoves,
                teammate: teammate,
            });
        }
        setGameStarted(true);
    }, [pos]);

    const randomize = (difficulty) => {
        var prev_pos = [2, 2];
        var possible_movements = [];
        var empty_pos = [2, 2];
        var current = pos.slice();

        var moves;
        console.log(difficulty);
        if (difficulty == 'easy') {
            moves = 6;
        } else if (difficulty == 'medium') {
            moves = 20;
        } else if (difficulty == 'hard') {
            moves = 40;
        }

        for (var i = 0; i < moves; i++) {
            var idx_of_moved = [];
            for (var idx = 0; idx < 9; idx++) {
                var manhattan =
                    Math.abs(empty_pos[0] - current[idx][0]) +
                    Math.abs(empty_pos[1] - current[idx][1]);
                if (manhattan == 1) {
                    if (!compareTwoArrays(current[idx], prev_pos)) {
                        idx_of_moved.push(idx);
                        possible_movements.push(current[idx]);
                    }
                }
            }
            var rand_idx = Math.floor(
                Math.random() * possible_movements.length
            );
            var move_to = possible_movements[rand_idx];
            current = current.slice();
            if (i > 0) {
                prev_pos = current[8].slice();
            }
            current[8] = move_to.slice();
            current[idx_of_moved[rand_idx]] = empty_pos.slice();
            empty_pos = move_to.slice();
            possible_movements = [];

            const newtest = produce(pos, (posCopy) => {
                for (var i = 0; i < 9; i++) {
                    posCopy[i] = current[i];
                }
            });
            setPos(newtest);
            setEmptyPos(newtest[8]);
            if (i == moves - 1) {
                var start = new Array(9);
                var idx = 0;
                newtest.forEach((pos, num) => {
                    num = num + 1;
                    if (num == 9) num = 0;
                    if (pos[0] == 0 && pos[1] == 0) {
                        start[0] = num;
                    }
                    if (pos[0] == 0 && pos[1] == 1) {
                        start[1] = num;
                    }
                    if (pos[0] == 0 && pos[1] == 2) {
                        start[2] = num;
                    }
                    if (pos[0] == 1 && pos[1] == 0) {
                        start[3] = num;
                    }
                    if (pos[0] == 1 && pos[1] == 1) {
                        start[4] = num;
                    }
                    if (pos[0] == 1 && pos[1] == 2) {
                        start[5] = num;
                    }
                    if (pos[0] == 2 && pos[1] == 0) {
                        start[6] = num;
                    }
                    if (pos[0] == 2 && pos[1] == 1) {
                        start[7] = num;
                    }
                    if (pos[0] == 2 && pos[1] == 2) {
                        start[8] = num;
                    }
                });
                const min = Astarsearch(start).distance;
                setMinMoves(min);
            }
        }
    };

    const solver = () => {
        var start = new Array(9);
        pos.forEach((pos, num) => {
            num = num + 1;
            if (num == 9) num = 0;
            if (pos[0] == 0 && pos[1] == 0) {
                start[0] = num;
            }
            if (pos[0] == 0 && pos[1] == 1) {
                start[1] = num;
            }
            if (pos[0] == 0 && pos[1] == 2) {
                start[2] = num;
            }
            if (pos[0] == 1 && pos[1] == 0) {
                start[3] = num;
            }
            if (pos[0] == 1 && pos[1] == 1) {
                start[4] = num;
            }
            if (pos[0] == 1 && pos[1] == 2) {
                start[5] = num;
            }
            if (pos[0] == 2 && pos[1] == 0) {
                start[6] = num;
            }
            if (pos[0] == 2 && pos[1] == 1) {
                start[7] = num;
            }
            if (pos[0] == 2 && pos[1] == 2) {
                start[8] = num;
            }
        });
        var curr = Astarsearch(start);
        var state_arr = [];
        while (curr != null) {
            state_arr.push(curr);
            curr = curr.parent;
        }
        //setPos(state_arr[0])
        var idx = 0;
        var newPos = new Array(9);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (state_arr[0].state[idx] == 0) {
                    newPos[8] = [i, j];
                } else if (state_arr[0].state[idx] == 1) {
                    newPos[0] = [i, j];
                } else if (state_arr[0].state[idx] == 2) {
                    newPos[1] = [i, j];
                } else if (state_arr[0].state[idx] == 3) {
                    newPos[2] = [i, j];
                } else if (state_arr[0].state[idx] == 4) {
                    newPos[3] = [i, j];
                } else if (state_arr[0].state[idx] == 5) {
                    newPos[4] = [i, j];
                } else if (state_arr[0].state[idx] == 6) {
                    newPos[5] = [i, j];
                } else if (state_arr[0].state[idx] == 7) {
                    newPos[6] = [i, j];
                } else if (state_arr[0].state[idx] == 8) {
                    newPos[7] = [i, j];
                }
                idx++;
            }
        }
        var shortest_path = [];
        for (
            var idx_state = state_arr.length - 1;
            idx_state >= 0;
            idx_state--
        ) {
            var idx = 0;
            var newPos = new Array(9);
            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    if (state_arr[idx_state].state[idx] == 0) {
                        newPos[8] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 1) {
                        newPos[0] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 2) {
                        newPos[1] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 3) {
                        newPos[2] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 4) {
                        newPos[3] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 5) {
                        newPos[4] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 6) {
                        newPos[5] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 7) {
                        newPos[6] = [i, j];
                    } else if (state_arr[idx_state].state[idx] == 8) {
                        newPos[7] = [i, j];
                    }
                    idx++;
                }
            }
            shortest_path.push(newPos);
        }
        //setPos(shortest_path[shortest_path.length-1])
        setTimeout(() => {
            for (var i = 1; i < shortest_path.length; i++) {
                customTimeout(i, shortest_path[i]);
            }
        });
    };

    const customTimeout = (i, state) => {
        setTimeout(() => {
            setPos((prevPos) => {
                return state;
            });
        }, 500 * i);
    };

    if (location.state == null) {
        console.log('HEHREHREH');
        return <Redirect to='/app'></Redirect>;
    }

    const clickHandler = (i) => {
        if (i !== 8 && yourturn) {
            var copy = pos.slice();
            var prev_pos = copy[i];
            var manhattan =
                Math.abs(emptyPos[0] - pos[i][0]) +
                Math.abs(emptyPos[1] - pos[i][1]);
            if (manhattan == 1) {
                const newPos1 = produce(pos, (posCopy) => {
                    var xdiff = emptyPos[1] - pos[i][1];
                    var ydiff = emptyPos[0] - pos[i][0];
                    if (xdiff != 0) {
                        //horizontal movement
                        posCopy[i] = [posCopy[i][0], posCopy[i][1] + xdiff];
                    } else {
                        //vertical movement
                        posCopy[i] = [posCopy[i][0] + ydiff, posCopy[i][1]];
                    }
                    var idx = 0;
                    for (var m = 0; m < 9; m++) {
                        if (
                            pos[m][0] == emptyPos[0] &&
                            pos[m][1] == emptyPos[1]
                        ) {
                            idx = m;
                            break;
                        }
                    }
                    posCopy[idx] = prev_pos;
                    console.log(idx);
                    setEmptyPos(prev_pos);
                });
                setPos(newPos1);
                socket.emit('make move', newPos1);
                setTurn(false);
                if (
                    newPos1[0][0] == 0 &&
                    newPos1[0][1] == 0 &&
                    newPos1[1][0] == 0 &&
                    newPos1[1][1] == 1 &&
                    newPos1[2][0] == 0 &&
                    newPos1[2][1] == 2 &&
                    newPos1[3][0] == 1 &&
                    newPos1[3][1] == 0 &&
                    newPos1[4][0] == 1 &&
                    newPos1[4][1] == 1 &&
                    newPos1[5][0] == 1 &&
                    newPos1[5][1] == 2 &&
                    newPos1[6][0] == 2 &&
                    newPos1[6][1] == 0 &&
                    newPos1[7][0] == 2 &&
                    newPos1[7][1] == 1
                ) {
                    setTimeout(function () {
                        alert('SOLVED');
                    }, 250);
                    axios.post(
                        'https://eightpuzzlegame.onrender.com/api/post',
                        {
                            userId: firebase.auth().currentUser.email,
                            number_of_moves: moves - 1,
                            difficulty: chosenDifficulty,
                            lowest_possible: minMoves,
                            teammate: teammate,
                        }
                    );
                    setSolveVisibility('none');
                }
            } else {
                console.log('out of range');
            }
        }
    };

    const compareTwoArrays = (arr1, arr2) => {
        for (var j = 0; j < arr1.length; j++) {
            if (arr1[j] != arr2[j]) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = (e) => {
        console.log(e.target[0].value);
        setChosenDifficulty(e.target[0].value);
        randomize(e.target[0].value);
        e.preventDefault();
        setVisibility('none');
        setSolveVisibility('flex');
        randomize();
    };
    const testfunc = (i) => {
        if (i != 8) {
            return true;
        } else {
            return false;
        }
    };

    const submitText = (e) => {
        if (e.target[0].value.length > 0) {
            console.log(e.target[0].value);
            socket.emit('message', {
                name: location.state.params,
                message: e.target[0].value,
            });
        }
        e.target[0].value = '';
        e.preventDefault();
    };

    const chatRender = () => {
        return chat.map(({ name, message }, index) => (
            <div key={index}>
                <span style={{ color: 'blue' }}>{name}:</span>{' '}
                <span>{message}</span>
            </div>
        ));
    };

    return (
        <div>
            {foundGame ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {' '}
                    <div
                        style={{
                            position: 'absolute',
                            top: '0%',
                            left: '49%',
                            outline: '3px solid black',
                            transform:
                                'translateX(-195px) translateY(-200px) scale(1.3) ',
                        }}
                    >
                        {pos.map((rows, i) => (
                            <div
                                id={i}
                                ref={allRefs.current[i]}
                                onClick={() => clickHandler(i)}
                                style={{
                                    position: 'absolute',
                                    height: '100px',
                                    width: '100px',
                                    left: 0 + rows[1] * 100 + 'px',
                                    top: 300 + rows[0] * 100 + 'px',
                                    outline: testfunc(i)
                                        ? '1px solid black'
                                        : '0px solid black',
                                    padding: '0px',
                                    transition: 'left 0.25s, top 0.25s',
                                    display: testfunc(i) ? 'inline' : 'none',
                                }}
                                key={i}
                            >
                                {' '}
                                <img width='100px' src={imgarray[i]}></img>{' '}
                                {i == 8 && <div></div>}
                            </div>
                        ))}

                        <div style={{ textAlign: 'center' }}></div>
                    </div>{' '}
                    <div
                        style={{
                            margin: 'auto',
                            justifyContent: 'center',
                            width: '1px',
                        }}
                    >
                        <ul
                            id='test'
                            style={{ listStyle: 'none', margin: 'auto' }}
                        >
                            <li
                                style={{
                                    outline: '1px solid rgb(0,0,0,0.4)',
                                    width: '200px',
                                    marginLeft: '200px',
                                    marginTop: '135px',
                                    backgroundColor: yourturn
                                        ? '#01d9ff'
                                        : 'white',
                                    padding: '6px',
                                }}
                            >
                                {yourturn
                                    ? location.state.params +
                                      "'s turn. (your turn)"
                                    : location.state.params}
                            </li>
                            <li
                                style={{
                                    outline: '1px solid rgb(0,0,0,0.4)',
                                    width: '200px',
                                    marginLeft: '200px',
                                    marginTop: '1px',
                                    backgroundColor: !yourturn
                                        ? '#01d9ff'
                                        : 'white',
                                    padding: '6px',
                                }}
                            >
                                {!yourturn ? teammate + "'s turn." : teammate}
                            </li>
                        </ul>
                        <div
                            style={{
                                width: '200px',
                                marginLeft: '239px',
                                boxSizing: 'border-box',
                                overflowWrap: 'break-word',
                            }}
                        >
                            Chat
                        </div>
                        <div className='chatcontainer'>{chatRender()}</div>
                        <div
                            style={{
                                width: '250px',
                                marginLeft: '239px',
                                boxSizing: 'border-box',
                                overflowWrap: 'break-word',
                            }}
                        >
                            <form onSubmit={submitText}>
                                <label>
                                    <input
                                        style={{ padding: '2px' }}
                                        type='text'
                                        name='name'
                                        placeholder='Type message here..'
                                    />
                                </label>
                                <input type='submit' value='Send' />
                            </form>
                        </div>
                    </div>{' '}
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <br></br> Searching for Teammate..
                    <PuffLoader size='50px' color='lightblue'></PuffLoader>
                </div>
            )}
        </div>
    );
}
