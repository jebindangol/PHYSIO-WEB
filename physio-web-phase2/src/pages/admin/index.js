import React from "react";
import MasterLayout from "../../components/layouts/masterlayout";
import Dashboard from "../../components/layouts/dashboard";

export default function Admin() {
  return (
    <MasterLayout>
      <Dashboard />
    </MasterLayout>
  );
}

