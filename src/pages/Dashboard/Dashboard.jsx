import React from "react";
import FormsTable from "./FormsTable";
import LoggedinLayout from "../../components/LoggedinLayout";

const Dashboard = () => {

    return (
        <LoggedinLayout>
            <FormsTable />
        </LoggedinLayout>
    );
};

export default Dashboard;