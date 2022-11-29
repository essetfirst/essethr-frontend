import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";

const UserRequestListView = () => {
  const [userRequests, setUserRequests] = React.useState([]);

  React.useEffect(() => {
    setUserRequests([
      {
        id: 1,
        name: "Abraham Gebrekidan",
        email: "abrahamgk2396@gmail.com",
        phone: "(+251)-961-011-689",
        date: "2021-02-06",
        status: "PENDING",
      },
    ]);
  }, []);

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>NAME</TableCell>
              <TableCell>EMAIL</TableCell>
              <TableCell>PHONE</TableCell>
              <TableCell>DATE</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>ACTION</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userRequests.map(({ name, email, phone, date, status }) => (
              <TableRow key={email || phone}>
                <TableCell>{name}</TableCell>
                <TableCell>{email}</TableCell>
                <TableCell>{phone}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{status}</TableCell>
                <TableCell>DO SOMETHING</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserRequestListView;
