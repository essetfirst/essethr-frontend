import React from "react";
import EmptyTableIcon from "../assets/icons/empty_table.png";

const EmptyTable = () => {
  return (
    <img
      src={EmptyTableIcon}
      style={{ width: 32, height: 32, color: "#fff" }}
      alt="empty table"
    />
  );
};

export default EmptyTable;
