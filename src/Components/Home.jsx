import React, { useState, useContext, useMemo } from 'react';
import { dataContext } from '../Context/DbContext';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Graph from './Graph';
import { Autocomplete, Box, TextField } from '@mui/material';
import { TableVirtuoso } from 'react-virtuoso';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const columns = [
  { width: 200, label: 'Customer Name', dataKey: 'name' },
  { width: 120, label: 'Customer ID', dataKey: 'customerId', numeric: true },
  { width: 120, label: 'Transaction ID', dataKey: 'transactionId', numeric: true },
  { width: 120, label: 'Transaction Date', dataKey: 'date', numeric: true },
  { width: 120, label: 'Amount', dataKey: 'amount', numeric: true },
];

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <div {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef((props, ref) => (
    <TableHead {...props} ref={ref} />
  )),
  TableRow,
  TableBody: React.forwardRef((props, ref) => (
    <TableBody {...props} ref={ref} />
  )),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </>
  );
}

export default function Home() {
  const { allData } = useContext(dataContext);
  const [searchQuery, setSearchQuery] = useState('');

  const rows = useMemo(() => {
    return allData.flatMap(customer =>
      customer.transactions.map(transaction => ({
        name: customer.name,
        customerId: customer.id,
        transactionId: transaction.id,
        date: transaction.date,
        amount: transaction.amount
      }))
    );
  }, [allData]);

  const filteredRows = useMemo(() => {
    if (!searchQuery) return rows;

    const lowerCaseQuery = searchQuery.toLowerCase();
    return rows.filter(row =>
      row.name.toLowerCase().includes(lowerCaseQuery) ||
      row.amount.toString().includes(lowerCaseQuery)
    );
  }, [rows, searchQuery]);

  return (
    <>
      <Box className='navbar'>
        <Typography variant="h4" component="h1" >
          SUMMIT 20<span>24</span>
        </Typography>
      </Box>

      <Container sx={{ width: '80%' }} >
        <Typography variant="h5" component="h2" gutterBottom className='header'>
          Customers and Transactions
        </Typography>
        <Autocomplete
          sx={{ width: '45%', paddingBottom: '10px' }}
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={allData.map((customer) => customer.name)}
          value={searchQuery}
          onChange={(event, newValue) => setSearchQuery(newValue)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by Name or Amount"
              InputProps={{
                ...params.InputProps,
                type: 'search',
              }}
            />
          )}
        />
        <Paper style={{ height: 400, width: '100%' }}>
          <TableVirtuoso
            data={filteredRows}
            components={VirtuosoTableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />
        </Paper>
      </Container>
      <Container>
        <Graph />
      </Container>
    </>
  );
}
