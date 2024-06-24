import React from "react";
import MasterLayout from "../../components/layouts/masterlayout";
import AppointmentDetail from "../../components/layouts/appointment/apptdetail";


const AppointmentDetailPage = () => {
  return (
    <MasterLayout>
      <AppointmentDetail/>
    </MasterLayout>
  );
};
export default AppointmentDetailPage;