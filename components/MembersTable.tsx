import React, { useContext } from 'react';
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
import { GuildContext } from 'contexts/guildContext';
import MembersManager from './MembersManager';

const MembersTable = ({ members }: { members: Member[] }) => {
  const { walletAddress } = useSigningClient();
  const ctx = useContext(GuildContext);
  let admin = ctx?.guildAdmin;

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User name</TableCell>
            <TableCell>User wallet</TableCell>
            <TableCell>Join Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members?.map((member) => (
            <TableRow
              key={member.name}
              selected={member.addr === walletAddress}
            >
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.addr}</TableCell>
              <TableCell>{new Date().toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <MembersManager />
    </>
  );
};

export default MembersTable;
