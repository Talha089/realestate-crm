import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setCount, setStart } from '../../store/actions/Integration';

export default function App() {
    const dispatch = useDispatch();
    const [time, setTime] = useState("00:00");
    const { count, start } = useSelector(state => state['Integration']);

    let id, initTime = new Date();
    useEffect(() => {
        if (!start) return clearInterval(id);
        id = setInterval(() => {
            let left = count + (new Date() - initTime);
            showTimer(left);
            dispatch(setCount(left));
        }, 1);
        return () => clearInterval(id);
    }, [start]);

    const showTimer = (ms) => {
        const second = Math.floor((ms / 1000) % 60).toString().padStart(2, "0");
        const minute = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, "0");
        setTime(`${minute}:${second}`);
    };

    return (<>{time}</>);
}