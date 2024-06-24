import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useRouter } from 'next/router';
import { PiClockCounterClockwiseBold } from "react-icons/pi";
import { IconContext } from 'react-icons';
import { Attendance, Session } from './attendance';


const ActivityPage = ({ patient }) => {
    const router = useRouter();
    const [showTable, setShowTable] = useState(false);
    const [activeButton, setActiveButton] = useState('current');
    const [activeState, setActiveState] = useState('attendance');

    const handleCurrentActivityClick = () => {
        setActiveButton('current');
        setShowTable(true);
    };
    
    const handleHistoryClick = () => {
        setActiveButton('history');
        setShowTable(false);
    };
    const handleAttendanceClick= () => {
        setActiveState('attendance');
    }
    const handleSessionClick = () => {
        setActiveState('session')
    }
    const handlePaymentClick = () => {
        setActiveState('payment')
    }

    return (
        <div>
            <div className="flex gap-10 pb-5">
                <Button
                label={`Current Activity | ${"Test Program"}`}
                onClick={handleCurrentActivityClick}
                className={activeButton === 'current' ? 'p-button-primary light-blue px-4 py-2 rounded-md color-blue' : 'p-button-secondary'}
                />
                <Button
                onClick={handleHistoryClick}
                className={activeButton === 'history' ? 'p-button-primary light-blue px-4 py-2 rounded-md color-blue' : 'p-button-secondary'}
                >
                    <IconContext.Provider value={{ style: { marginRight: '8px' } }}>
                        <PiClockCounterClockwiseBold /> History
                    </IconContext.Provider>
                </Button>
            </div>
            {showTable && (
                <div className='border border-color1 pointer-cursor'>
                    <div className='flex justify-between border-b px-4 py-2'>
                        <div className='flex gap-5'>
                            <button
                            onClick={handleAttendanceClick}
                            className={activeState === 'attendance' ? 'color-blue' : 'color-gray'}
                            > 
                                Attendance 
                            </button>
                            <button
                            onClick={handleSessionClick}
                            className={activeState === 'session' ? 'color-blue' : 'color-gray'}
                            >
                                Session Completed
                            </button>
                            <button
                            onClick={handlePaymentClick}
                            className={activeState === 'payment' ? 'color-blue' : 'color-gray'}
                            >
                                Payment
                            </button>
                        </div>


                        <div className='flex flex-row gap-5'>
                            <div className="text-base color-gray"> Start Date: </div>
                            <div className="text-sm font-medium">
                                {patient.Session && patient.Session.started_date
                                    ? patient.Session.started_date.split("T")[0]
                                    : "Not Set"}
                            </div>

                            <div className="text-base color-gray">Sessions Req.:</div>
                            <div className="text-base font-medium">
                                {patient.Session && patient.Session.total_session
                                    ? patient.Session.total_session
                                    : "0"}
                            </div>

                            {patient.Session && Object.keys(patient.Session).length > 0 ? (
                                <div className='flex flex-row gap-5'>
                                    <div className="text-base">Sessions Done: </div>
                                    <div className="text-base font-medium">
                                    {patient.Session.session_Log &&
                                    patient.Session.session_Log.filter(
                                        (session) => session.action === "done"
                                    ).length > 0
                                        ? patient.Session.session_Log.filter(
                                            (session) => session.action === "done"
                                        ).length
                                        : "0"}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* body part of the header div above */}
                    <div className="px-4 py-2">
                        {activeState === 'attendance' && (
                            <div>
                                <Attendance patient={patient} />
                            </div>
                        )}
                        {activeState === 'session' && (
                            <div>
                                <Session patient={patient} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActivityPage;
