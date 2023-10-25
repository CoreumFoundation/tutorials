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
import { useSigningClient } from 'contexts/client';

const MembersTable = ({ members }: { members: Member[] }) => {
  const { walletAddress } = useSigningClient();

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>User name</TableCell>
          <TableCell>User wallet</TableCell>
          {/* <TableCell>Role</TableCell> */}
          <TableCell>Join Date</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {members?.map((member) => (
          <TableRow key={member.name} selected={member.addr === walletAddress}>
            <TableCell>{member.name}</TableCell>
            <TableCell>{member.addr}</TableCell>
            {/* <TableCell>{member.role === 1 ? 'Admin' : 'Member'}</TableCell> */}
            <TableCell>{new Date().toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default MembersTable;
