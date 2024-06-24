import React from "react";
import MasterLayout from "../../components/layouts/masterlayout";
import User from "../../components/layouts/users/userlist";

const UserList = () => {
    return (
        <MasterLayout>
            <User />  
        </MasterLayout>
    );
};
export default UserList;
