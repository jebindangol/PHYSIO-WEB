import React from "react";
import MasterLayout from "../../components/layouts/masterlayout";
import PatientDetail from "../../components/layouts/patient/detail";


const PatientDetailPage = () => {
    return (
        <MasterLayout>
            <PatientDetail />
        </MasterLayout>
    );
};
export default PatientDetailPage;