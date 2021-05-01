import React, { useState, useRef }from 'react'
import './style.scss'

export default function TimeSettings({timeType}) {
    const inc = useRef(null);
    const dec = useRef(null);
    const type = timeType;
    const initialTime = parseInt(sessionStorage.getItem(type));
    const [newTime, setNewTime] = useState(initialTime ? initialTime : 25);
    const decrement = () => { dec.current = setInterval(() => setNewTime(newTime => newTime - 1), 100) };
    const increment = () => { inc.current = setInterval(() => setNewTime(newTime => newTime + 1), 100) };

    if (newTime <= 0) {
        clearInterval(dec.current);
    } else if (newTime >= 60) {
        clearInterval(inc.current);
    }

    function timeoutClear() {
        clearInterval(dec.current);
        clearInterval(inc.current);
    }

    function setTime(){
        setNewTime(newTime);
        sessionStorage.setItem(type, newTime); 
        timeoutClear(); 
    }

    return (
        <div className="option">
            <div className="setter">
                <button onClick={(e) => newTime > 0 && setNewTime(newTime - 1)} onMouseDown={(e) => newTime > 0 && decrement()} onMouseUp={setTime} onMouseLeave={setTime}>-</button>
                <p className="number">{newTime.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</p>
                <button onClick={(e) => newTime < 60 && setNewTime(newTime + 1)} onMouseDown={(e) => newTime < 60 && increment()} onMouseUp={setTime} onMouseLeave={setTime}>+</button>
            </div>
        </div>
    )
}