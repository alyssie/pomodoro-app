import React, { useState, useEffect }from 'react'
import TimeSettings from './TimeSettings';
import SettingsIcon from './img/settings.png';
import SettingsMode from './img/settings-mode.png';
import ReplayIcon  from './img/replay.png';
import './style.scss'

export default function Pomodoro() {
    const [type, setType] = useState('sessionTime');
    const [settings, setSettings] = useState(false);
    const [timeOut, setTimeOut] = useState(false);
    const [start, setStart] = useState(false);
    const db = parseInt(sessionStorage.getItem(type));
    const defaultMinutes = db ? db : 25;
    const [baseSeconds, setBaseSeconds] = useState(0);
    const [baseMinutes, setBaseMinutes] = useState(defaultMinutes);

    if (!db) {
        sessionStorage.setItem('sessionTime', '25');
        sessionStorage.setItem('shortTime', '5');
        sessionStorage.setItem('longTime', '10');
    }

    useEffect(() => {
        if (start) {
            const timer = (baseSeconds >= 0) && setInterval(() => setBaseSeconds(baseSeconds - 1), 1000);
            return () => clearInterval(timer);
        }
    }, [baseSeconds, start])

    useEffect(() => {
        if (baseMinutes !== defaultMinutes) {
            setBaseMinutes(defaultMinutes);
            setBaseSeconds(0);
        }
    }, [type, settings])

    if (baseSeconds === -1) {
        if (baseMinutes === 0) { 
            //Time is up
            setBaseSeconds(0);
            setTimeOut(true);
            setStart(false);
        } else { 
            //Seconds done
            setBaseSeconds(59);
            setBaseMinutes(baseMinutes - 1);
        }
    }

    function resetTime(){
        setBaseMinutes(defaultMinutes);
        setBaseSeconds(0);
        setTimeOut(false);
        setStart(true);
    }

    function startTime(){
        if (timeOut) {
            resetTime();
        } else { 
            //Start or Pause
            if (start) {
                setStart(false); 
            } else {
                setStart(true);
                setSettings(false);
            }
        }
    }

    function switchType(value){
        setType(value);
        setStart(false);
        setBaseSeconds(0);
    }

    function openSettings(value){
        setSettings(value);
        setStart(false);
    }

    return (
        <div id="pomodoro">
            <h1 className="title">Pomodoro</h1>
            <div className="block">
                {baseMinutes < defaultMinutes && <button className="replay-btn" onClick={resetTime}><img src={ReplayIcon} alt="Replay" /></button>}
                <div className={start ? 'bg one animate' : 'bg one'}></div>
                <div className={start ? 'bg two animate' : 'bg two'}></div>
                <div className={start ? 'bg three animate' : 'bg three'}></div>
                <div className={start ? 'bg four on' : 'bg four'} onClick={startTime}>
                    {settings ?
                        <img src={SettingsMode} alt="Settings Mode"/>
                        :
                        <>
                            <p className="timer">{baseMinutes.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}:{baseSeconds.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</p>
                            <p className="sub">{start ? 'Pause' : 'Start' }</p>
                        </>
                    }
                </div>
            </div>
            {!settings &&
                <div className="menu">
                    <button className={type === 'sessionTime' ? 'primary-btn active' : 'primary-btn'} onClick={(e) => switchType('sessionTime')} disabled={type === 'sessionTime' && 'disabled'}>Session</button>
                    <button className={type === 'shortTime' ? 'primary-btn active' : 'primary-btn'} onClick={(e) => switchType('shortTime')} disabled={type === 'shortTime' && 'disabled'}>Short</button>
                    <button className={type === 'longTime' ? 'primary-btn active' : 'primary-btn'} onClick={(e) => switchType('longTime')} disabled={type === 'longTime' && 'disabled'}>Long</button>
                </div>
            }
            <div className="footer">
                {settings ?
                    <>
                        <div className="settings">
                            <TimeSettings timeType={'sessionTime'}>
                            </TimeSettings>
                            <TimeSettings timeType={'shortTime'}>
                            </TimeSettings>
                            <TimeSettings timeType={'longTime'}>
                            </TimeSettings>
                        </div>
                        <button className="primary-btn" onClick={(e) => openSettings(false)}>Set timer</button>
                    </>
                    :
                    <button className="settings-btn" onClick={(e) => settings ? openSettings(false) : openSettings(true)}><span>Settings</span> <img src={SettingsIcon} alt="Settings" /></button>
                }
            </div>
            <p className="attribution">Podomoro app by <a href="#">Alyssie</a></p>
        </div>
    )
}
