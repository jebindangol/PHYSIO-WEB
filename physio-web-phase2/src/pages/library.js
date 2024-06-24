import React from "react";
import MasterLayout from "../components/Masterlayout/masterlayout";
import ExcerciseLibrary from "../components/Library/ExcerciseLibrary";
import ExcerciseDetails from "../components/Library/ExcercsieDetails";

const Library = () => {
  return (
    <MasterLayout>
      <ExcerciseLibrary>
        <ExcerciseDetails />
      </ExcerciseLibrary>
    </MasterLayout>
  );
};

export default Library;
