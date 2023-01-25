import React, { useState, useRef } from 'react';
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
import { useHistory } from 'react-router-dom';
import './Game.css';

export default function Game(props) {
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
    const [formVisibility, setFormVisibility] = useState('none');
    const [puzzleVisibility, setPuzzleVisibility] = useState('inline');

    const history = useHistory();

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
            moves = 12;
        } else if (difficulty == 'hard') {
            moves = 25;
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
        setSolveVisibility('none');
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

        setTimeout(() => {
            window.location.reload();
        }, 500 * shortest_path.length + 250);
    };

    const customTimeout = (i, state) => {
        setTimeout(() => {
            setPos((prevPos) => {
                return state;
            });
        }, 500 * i);
    };

    const clickHandler = (i) => {
        if (i !== 8) {
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
                setMoves(moves + 1);
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
                        window.location.reload();
                    }, 250);
                    axios.post('/api/post', {
                        userId: firebase.auth().currentUser.email,
                        number_of_moves: moves + 1,
                        difficulty: chosenDifficulty,
                        lowest_possible: minMoves,
                    });
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

    const handleSubmit2 = (e) => {
        console.log(e.target[0].value);
        e.preventDefault();
        history.push('/app/gameonline', { params: e.target[0].value });
    };

    const testfunc = (i) => {
        if (i != 8) {
            return true;
        } else {
            return false;
        }
    };

    const playonline = () => {
        setPuzzleVisibility('none');
        setFormVisibility('flex');
    };

    return (
        <div>
            <div
                className='puzzlecontainer'
                style={{
                    position: 'absolute',
                    top: '0%',
                    left: '49%',
                    outline: '3px solid black',
                    display: puzzleVisibility,
                }}
            >
                {pos.map((indexPos, i) => (
                    <div
                        id={i}
                        onClick={() => clickHandler(i)}
                        style={{
                            position: 'absolute',
                            height: '100px',
                            width: '100px',
                            left: 0 + indexPos[1] * 100 + 'px',
                            top: 300 + indexPos[0] * 100 + 'px',
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
                <div
                    style={{
                        width: '300px',
                        height: '300px',
                        position: 'absolute',
                        display: visibility,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: '2',
                        top: '300px',
                        color: 'white',
                        left: '50%',
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <span>Choose difficulty</span>
                        <select>
                            <option value='easy'>Easy</option>
                            <option value='medium'>Medium</option>
                            <option value='hard'>Hard</option>
                        </select>
                        <br></br>
                        <input
                            style={{ cursor: 'pointer' }}
                            type='submit'
                            value='Play'
                        />
                    </form>
                    <button style={{ cursor: 'pointer' }} onClick={playonline}>
                        Play with others
                    </button>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    display: formVisibility,
                }}
            >
                <form onSubmit={handleSubmit2}>
                    <label>
                        <h1>Enter online ID: </h1>
                        <input
                            style={{
                                borderRadius: '2px',
                                fontSize: '16px',
                                border: '1px solid rgb(0,0,0,0.4)',
                            }}
                            type='text'
                            name='name'
                        />
                    </label>
                    <input
                        style={{
                            backgroundColor: 'black',
                            marginLeft: '10px',
                            fontSize: '14px',
                            color: 'white',
                            borderRadius: '4px',
                            padding: '4px',
                            fontWeight: 'bold',
                            border: '1px solid rgb(0,0,0,0.4)',
                        }}
                        type='submit'
                        value='Play online'
                    />
                </form>
            </div>

            <div style={{ textAlign: 'center' }}>
                <button
                    className='solvebutton'
                    style={{ display: visibilitySolve }}
                    onClick={solver}
                >
                    Solve
                </button>
            </div>
        </div>
    );
}
