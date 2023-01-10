import React from "react";

import PageView from "../../../../components/PageView";
import CardWithTitle from "../../../../components/CardWithTitle";
import BarGraphComponent from "../../../../components/BarGraphComponent";

const AgeBreakdown = ({ ageByCategory = {} }) => {
  return (
    <CardWithTitle title={"Age profile"}>
      {/* Bar chart here */}
      <BarGraphComponent
        bars={Object.values(ageByCategory)}
        labels={Object.keys(ageByCategory)}
        height={200}
      />
    </CardWithTitle>
  );
};

// const AgeBreakdownByDepartment = () => {
//   return (
//     <CardWithTitle title={"Age breakdown by department"}>
//       {/* Bar graph here */}
//     </CardWithTitle>
//   );
// };

// const DepartmentAgeProfileList = () => {
//   return <TableComponent columns={[]} data={[]} />;
// };

const AgeProfile = () => {
  return (
    <PageView title="Age Profile">
      <div>Age Profile</div>
      {/* Age breakdown */}
      <AgeBreakdown
        ageByCategory={{
          "18-25": 17,
          "26-34": 29,
          "35-44": 15,
          "45-54": 6,
          "55-64": 2,
          "65+": 1,
        }}
      />
      {/* Age breakdown by department */}
      {/* employees ages */}
    </PageView>
  );
};

export default AgeProfile;
