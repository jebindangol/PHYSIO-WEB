import React from "react";
import MasterLayout from "../../components/layouts/masterlayout";
import PatientList from "../../components/layouts/patient/patientlist";

const PatientListPage = () => {
  return (
    <MasterLayout>
      <PatientList />
    </MasterLayout>
  );
};
export default PatientListPage;
