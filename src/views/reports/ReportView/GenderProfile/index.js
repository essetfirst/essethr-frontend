import React from "react";

import PageView from "../../../../components/PageView";
import CardWithTitle from "../../../../components/CardWithTitle";
import TableComponent from "../../../../components/TableComponent";
import PieChartComponent from "../../../../components/PieChartComponent";

const COLOR_BY_GENDER = { m: "lightgreen", f: "red", u: "orange" };

const CompanyGenderRatio = ({ genderRatio }) => {
  return (
    <CardWithTitle title={"Company Male/Female Ratio"}>
      <PieChartComponent
        pies={genderRatio.map(({ gender, count, percentage }) => ({
          label: gender,
          datum: count || percentage,
          color: COLOR_BY_GENDER[gender[0].toLowerCase()],
        }))}
        height={200}
      />
    </CardWithTitle>
  );
};

const GenderRatioDetails = ({ genderRatio = [] }) => {
  return (
    <TableComponent
      size="small"
      columns={[
        { field: "gender", label: "Gender" },
        { field: "count", label: "Count" },
        {
          field: "percentage",
          label: "Percentage",
        },
      ]}
      data={genderRatio}
    />
  );
};

const GenderHeadcountByDepartment = ({ genderHeadcount }) => {
  return (
    <CardWithTitle title={"Male/Female Headcount by Department"}>
      {/* BarGraph inverted */}
    </CardWithTitle>
  );
};

const GenderHeadcountDetails = ({ genderHeadcount = [] }) => {
  return (
    <TableComponent
      columns={[
        { field: "department", label: "Department" },
        { field: "male", label: "Male" },
        { field: "female", label: "Female" },
        { field: "unspecified", label: "Unspecified" },
      ]}
      data={genderHeadcount}
    />
  );
};

const roundToOneFraction = (n) => {
  const [digits, fractions] = String(n).split(".");
  return parseFloat(digits + "." + fractions.slice(0, 3));
};

const GenderProfile = () => {
  //   const genderRatio = [
  //     { gender: "Male", count: 10, percentage: 0.5 },
  //     { gender: "Female", count: 40, percentage: 0.4 },
  //     { gender: "Unspecified", count: 10, percentage: 0.1 },
  //   ];

  const genderRatio = {
    male: 10,
    female: 6,
    unspecified: 10,
  };

  const totalCount = Object.keys(genderRatio).reduce(
    (sum, gender) => sum + genderRatio[gender],
    0
  );

  const genderRatioPieData = Object.keys(genderRatio).map((gender) => ({
    gender: gender[0].toUpperCase() + gender.slice(1),
    count: genderRatio[gender],
    percentage: `${
      100 * roundToOneFraction(genderRatio[gender] / totalCount)
    }%`,
  }));

  const genderRatioTableData = [
    ...genderRatioPieData,
    { gender: "Total", count: totalCount, percentage: 1 },
  ];

  return (
    <PageView title="Gender Profile">
      {/* Gender ratio (pie chart) */}
      <CompanyGenderRatio genderRatio={genderRatioPieData} />
      <GenderRatioDetails genderRatio={genderRatioTableData} />
      <GenderHeadcountByDepartment genderHeadcount={[]} />
      <GenderHeadcountDetails genderHeadcount={[]} />
    </PageView>
  );
};

export default GenderProfile;
