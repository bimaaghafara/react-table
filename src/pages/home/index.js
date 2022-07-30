import { useEffect, useState } from "react";
import { Button, Box, Typography, TextField, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { setFilters, resetFilters, setRows, setPaginations } from '../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import axios from 'axios';
import sx from './sx';

export default function Home() {
  const dispatch = useDispatch();
  const filtersState = useSelector((state) => state.filtersReducer);
  const { rows, paginations } = useSelector((state) => state.tableReducer);
  const filtersStateDebounced = useDebounce(filtersState, 500);
  const [loading, setLoading] = useState(false);

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

  const getPaginationsValue = () => {
    return Object.keys(paginations)
      .map(key => {
        if (key === 'rowCount') return '';
        if (key === 'page') return `${key}=${Number(paginations[key])+1}`;
        if (key === 'pageSize') return `results=${paginations[key]}`;
        return `${key}=${paginations[key]}`;
      })
      .filter(e => e)
      .join('&');
  }

  const handleGetData = () => {
    const urlParams = [getFiltersValue(), getPaginationsValue()].filter(e => e).join('&');
    const url = `https://randomuser.me/api/?${urlParams}`;
    axios.get(url)
      .then(res => {
        setLoading(false);
        const _rows = res.data.results.map((e, i) => ({
          ...e,
          no: i+1,
          id: [i, e.id.value, e.id.value].join('_')
        }));
        dispatch(setRows(_rows))
        dispatch(setPaginations({
          ...paginations,
          rowCount: 999
        }))
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      })
  }

  useEffect(() => {
    if (paginations.page === 0) {
      handleGetData();
    } else {
      dispatch(setPaginations({ page: 0 }))
    }
  }, [filtersStateDebounced]);

  useEffect(() => {
    handleGetData();
  }, [paginations.pageSize, paginations.page]);
  
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
        width: 50,
        field: "no",
        headerName: "No.",
      },
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
          page={paginations.page}
          pageSize={paginations.pageSize}
          rowsPerPageOptions={[10, 25, 50, 100]}
          rowCount={paginations.rowCount}
          onPageChange={(e) => dispatch(setPaginations({ page: e }))}
          onPageSizeChange={(e) => dispatch(setPaginations({ page: 0, pageSize: e }))}
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