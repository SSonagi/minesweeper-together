import { useEffect, useState } from "react";
import './countdown.css';

const CountDown = ({
    onCountDownEnd
}) => {
    const [ counter, setCounter ] = useState(3);        

    useEffect(() => {
        let timer = null;
        if (counter === 0) {
            onCountDownEnd();
        } else {
            timer = setInterval(() => {
                setCounter((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [counter, onCountDownEnd]);

    return (
        <div className="CountDownBarrier">
            <h1 className="Countdown">
                {counter}
            </h1>
        </div>
    )
}

export default CountDown;