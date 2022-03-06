import logo from './logo.svg';
import './App.css';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp, faPause, faPlay, faRefresh, faRetweet } from '@fortawesome/free-solid-svg-icons';


function App()
{
  // const [displayTime, setDisplayTime] = useState(5);
  // const [breakTime, setBreakTime] = useState(3);
  // const [sessionTime, setSessionTime] = useState(5);
  const [displayTime, setDisplayTime] = useState(25 * 60);
  const [breakTime, setBreakTime] = useState(5 * 60);
  const [sessionTime, setSessionTime] = useState(25 * 60);
  const [timerOn, setTimerOn] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [breakAudio, setBreakAudio] = useState(new Audio("./breakTime.mp3"));
  const audioSrc =
    "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";
  let player = useRef(null);

  const playBreakSound = () =>
  {
    // breakAudio.currentTime = 0;
    // breakAudio.play();
    player.currentTime = 0;
    player.play();
  }


  useEffect(() =>
  {
    if (displayTime <= 0)
    {
      setOnBreak(true);
      playBreakSound();
    } else if (!timerOn && displayTime === breakTime)
    {
      setOnBreak(false);
    }
    // console.log("test");
  }, [displayTime, onBreak, timerOn, breakTime, sessionTime]);

  const formatDisplayTime = (time) =>
  {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return (
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds)
    );
  };

  const formatTime = (time) =>
  {
    return time / 60;
  };

  const changeTime = (amount, type) =>
  {
    if (type === "break")
    {
      if (breakTime <= 60 && amount < 0 || breakTime >= 60 * 60)
      {
        return;
      }
      setBreakTime((prev) => prev + amount);
    }
    else
    {
      if (sessionTime <= 60 && amount < 0 || sessionTime >= 60 * 60)
      {
        return;
      }
      setSessionTime((prev) => prev + amount);
      if (!timerOn)
      {
        setDisplayTime(sessionTime + amount);
      }
    }
  }

  const controlTime = () =>
  {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;

    if (!timerOn)
    {
      let interval = setInterval(() =>
      {
        date = new Date().getTime();
        if (date > nextDate)
        {
          setDisplayTime((prev) =>
          {
            if (prev <= 0 && !onBreakVariable)
            {
              // playBreakSound();
              onBreakVariable = true;
              // setOnBreak(true);
              return breakTime;
            } else if (prev <= 0 && onBreakVariable)
            {
              // playBreakSound();
              onBreakVariable = false;
              setOnBreak(false);
              return sessionTime;
            }
            return prev - 1;
          });
          nextDate += second;
        }
      }, 30)
      localStorage.clear();
      localStorage.setItem("interval-id", interval);
    }

    if (timerOn)
    {
      clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
  }

  const resetTime = () =>
  {
    clearInterval(localStorage.getItem("interval-id"));
    setDisplayTime(25 * 60);
    setBreakTime(5 * 60);
    setSessionTime(25 * 60);
    // breakAudio.pause();
    // breakAudio.currentTime = 0;
    player.pause();
    player.currentTime = 0;
    setTimerOn(false);
    setOnBreak(false);
  }

  return (
    <div className="App">
      <div className="container">
        <h1 className="pomodoro-title">
          Pomodoro Clock
        </h1>
        <div className="adjustable-times">

          <div id="break-label">
            <Length
              title={"Break Length"}
              changeTime={changeTime}
              type={"break"}
              formatTime={formatTime}
              time={breakTime}
              formatDisplayTime={formatDisplayTime}
            />
          </div>
          <div id="session-label">
            <Length
              title={"Session Length"}
              changeTime={changeTime}
              type={"session"}
              formatTime={formatTime}
              time={sessionTime}
              formatDisplayTime={formatDisplayTime}
            />
          </div>
        </div>


        <div id="timer-label">
          <h3>{onBreak ? "Break" : "Session"}</h3>
          <div className="display-time" id="time-left">
            <h1>{formatDisplayTime(displayTime)}</h1>

            <div className="display-time-row">
              <button id="start_stop" className="buttons" onClick={controlTime}>
                {timerOn ? <FontAwesomeIcon className="icons" icon={faPause} /> : <FontAwesomeIcon className="icons" icon={faPlay} />}
              </button>
              <button id="reset" className="buttons" onClick={resetTime}>
                <FontAwesomeIcon className="icons" icon={faRefresh} />
              </button>
            </div>

          </div>
        </div>
      </div>
      <audio ref={(t) => (player = t)} src={audioSrc} id="beep" />
    </div>
  );
}

function Length({ title, changeTime, type, time, formatTime })
{
  return (
    <div>
      <h3>{title}</h3>
      <div className="time-sets">
        <button id={type === "break" ? "break-decrement" : "session-decrement"} onClick={() => changeTime(-60, type)} className="buttons">
          <FontAwesomeIcon className="icons" icon={faArrowDown} />
        </button>
        <div id={type === "break" ? "break-length" : "session-length"} className="margin-times">
          {formatTime(time)}
        </div>
        <button id={type === "break" ? "break-increment" : "session-increment"} onClick={() => changeTime(60, type)} className="buttons">
          <FontAwesomeIcon className="icons" icon={faArrowUp} />
        </button>
      </div>
    </div>
  );
}

export default App;
