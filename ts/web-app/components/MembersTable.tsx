// components/MembersTable.js
import React from 'react';
//@ts-ignore
import { Member } from 'util/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

const MembersTable = ({ members }: { members: Member[] }) => {
  console.log('members', members);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User Name</TableCell>
          <TableCell>Role</TableCell>
          <TableCell>Join Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {members?.map((member) => (
          <TableRow key={member.name}>
            <TableCell>{member.address}</TableCell>
            <TableCell>{member.weight}</TableCell>
            <TableCell>
              {new Date(member.joinDate).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MembersTable;
