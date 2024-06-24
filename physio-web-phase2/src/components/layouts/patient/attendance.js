import React, { useState } from "react";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { LuDot } from "react-icons/lu";
const data = [
    {
        "id": 1,
        "exercise_name": "exercise23",
        "reps": 10,
        "weight": 100,
        "session_log_id": 16
    },
    {
        "id": 2,
        "exercise_name": "exercise24",
        "reps": 12,
        "weight": 90,
        "session_log_id": 16
    }
]

export const Attendance = ({ patient }) => {

    const [activeButton, setActiveButton] = useState(null);

    const sessionsDoneCount = patient.Session.session_Log?.filter(session => session.action === "done").length;
    const totalSessions = patient.Session.total_session;

    const remainingSessions = totalSessions - sessionsDoneCount;

    // Create an array of remaining session numbers
    const sessionNumbers = Array.from({ length: remainingSessions }, (_, index) => index + sessionsDoneCount + 1);

    const handleButtonClick = (sessionNumber) => {
        setActiveButton(sessionNumber);
    };

    return(
        <div className="flex flex-row flex-wrap gap-10 color-gray">
            {sessionNumbers.map(sessionNumber => (
                <button 
                    onClick={() => handleButtonClick(sessionNumber)}
                    key={sessionNumber}
                    className={activeButton === sessionNumber ? 'border border-black text-black p-2 rounded-md':''}
                >
                    Session {sessionNumber}
                </button>
            ))}
        </div>
    )
}

export const Session = ({ patient }) => {

    const sessions = patient.Session.session_Log?.filter(session => session.action === "done");
    const [expandedSessions, setExpandedSessions] = useState([]);

    const toggleSession = (index) => {
        setExpandedSessions(prevState =>
            prevState.includes(index) ? prevState.filter(id => id !== index) : [...prevState, index]
        );
    };

    const getExercisesForSession = (sessionId) => {
        return data.filter(exercise => exercise.session_log_id === sessionId);
    };

    return(
        <div className="flex flex-col gap-10">
            {sessions && sessions.map((session, index) => (
                <div key={index} className="flex flex-col gap-2">
                    <div className="flex flex-row gap-10 items-start cursor-pointer" onClick={() => toggleSession(index)}>
                        {expandedSessions.includes(index) ? 
                            <MdKeyboardArrowDown style={{ fontSize: 28 }} /> : 
                            <MdKeyboardArrowRight style={{ fontSize: 28 }} />
                        }
                        <div> Session {index + 1} </div>
                        <div> {session.date.split("T")[0]} </div>
                        <div className="flex line-clamp-2"> {session.remarks} </div>
                        <div className="flex flex-col justify-start">
                            <span>{getExercisesForSession(session.id).length} Exercises</span>
                            {expandedSessions.includes(index) && (
                                <ul>
                                    {getExercisesForSession(session.id).map((exercise) => (
                                        <li key={exercise.id} className="flex flex-col">
                                            <span className="flex items-center px-2"><LuDot/>{exercise.exercise_name} | <span className="color-gray px-2">{exercise.weight} kg</span> | <span className="color-gray px-2">{exercise.reps} Reps</span> </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

