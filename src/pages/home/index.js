import { useEffect, useState } from "react";
import { Button, Box, Typography, TextField, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { setFilters, resetFilters } from '../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import axios from 'axios';
import sx from './sx';

export default function Home() {
  const dispatch = useDispatch();
  const filtersState = useSelector((state) => state.FiltersReducer);
  const filtersStateDebounced = useDebounce(filtersState, 500);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const getFiltersValue = () => {
    const _filters = {
      ...filtersState,
      gender: filtersState.gender === 'all' ? '' : filtersState.gender
    }
    const params = Object.keys(_filters)
      .map(key => {
        return _filters[key] ? `${key}=${_filters[key]}` : ''
      })
      .filter(e => e)
      .join('&');
    return params;
  }

  useEffect(() => {
    setLoading(true);
    let url = `https://randomuser.me/api/?${getFiltersValue()}&page=1&pageSize=10&results=10`;
    axios.get(url)
      .then(res => {
        setLoading(false);
        setRows(res.data.results.map((e, i) => ({
          ...e, id: [i, e.id.value, e.id.value].join('_')
        })));
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      })
  }, [filtersStateDebounced]);
  
  const renderTableFilters = () => {
    const genders = [
      { value: 'all', label: 'All' },
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ];

    return (
      <Box sx={sx.tableFiltersContainer}>
        <TextField
          id="filter-search"
          label="Search"
          size="small"
          sx={sx.filter}
          value={filtersState.search}
          onChange={(e) => {
            dispatch(setFilters({ search: e.target.value }))
          }}
        />
        <TextField
          id="filter-gender"
          select
          label="Gender"
          size="small"
          sx={sx.filter}
          value={filtersState.gender}
          onChange={(e) => {
            dispatch(setFilters({ gender: e.target.value }))
          }}
        >
          {genders.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Button
          sx={sx.filter}
          variant="outlined"
          onClick={() => dispatch(resetFilters())}
        >
          Reset Filter
        </Button>
      </Box>
    );
  }

  const renderTable = () => {
    const columns = [
      {
        width: 150,
        field: "username",
        headerName: "Username",
        valueGetter: ({ row }) => row.login.username,
      },
      {
        width: 200,
        field: "name",
        headerName: "Name",
        valueGetter: ({ row }) => [row.name.first, row.name.last].join(' ')
      },
      {
        width: 250,
        field: "email",
        headerName: "Email",
      },
      {
        width: 150,
        field: "gender",
        headerName: "Gender",
      },
      {
        width: 250,
        field: "registeredDate",
        headerName: "Registered Date",
        valueGetter: ({ row }) => new Date(row.registered.date).toLocaleString()
      },
    ]

    return (
      <Box sx={{ height: "580px", width: "100%", mt: 2 }}>
        <DataGrid
          loading={loading}
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          disableColumnMenu
          sortingMode="server"
          onSortModelChange={(e, details) => console.log(e, details)}
          paginationMode="server"
          page={0}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50, 100]}
          rowCount={999}
          onPageChange={(e) => console.log(e)}
          onPageSizeChange={(e) => console.log(e)}
        />
      </Box>
    );
  }

  return (
    <Box sx={sx.root}>
      <Typography variant="h5">React Table</Typography>
      {renderTableFilters()}
      {renderTable()}
    </Box>
  )
}