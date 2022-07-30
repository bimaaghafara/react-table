import { useEffect, useState } from "react";
import { Button, Box, Typography, TextField, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { setFilters, resetFilters } from '../../redux/filters/actions';
import { setPagination } from '../../redux/pagination/actions';
import { setRows } from '../../redux/table/actions';
import { setSort } from '../../redux/sort/actions';
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import axios from 'axios';
import sx from './sx';

export default function Home() {
  const dispatch = useDispatch();
  const filtersState = useSelector((state) => state.filtersReducer);
  const { rows, rowCount } = useSelector((state) => state.tableReducer);
  const paginationState = useSelector((state) => state.paginationReducer);
  const sortState = useSelector((state) => state.sortReducer);
  const filtersStateDebounced = useDebounce(filtersState, 500);
  const [loading, setLoading] = useState(false);

  const getSortValue = () => {
    if (sortState.key && sortState.value) {
      const sortKey = ['sortKey', sortState.key].join('=');
      const sortValue = ['sortValue', sortState.value].join('=');
      return [sortKey, sortValue].join('&')
    }
    return '';
  }

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
    return Object.keys(paginationState)
      .map(key => {
        if (key === 'rowCount') return '';
        if (key === 'page') return `${key}=${Number(paginationState[key])+1}`;
        if (key === 'pageSize') return `results=${paginationState[key]}`;
        return `${key}=${paginationState[key]}`;
      })
      .filter(e => e)
      .join('&');
  }

  const handleGetData = () => {
    setLoading(true);
    const urlParams = [getFiltersValue(), getPaginationsValue(), getSortValue()].filter(e => e).join('&');
    const url = `https://randomuser.me/api/?${urlParams}`;
    axios.get(url)
      .then(res => {
        setLoading(false);
        const _rows = res.data.results.map((e, i) => ({
          ...e,
          no: i+1,
          id: [i, e.id.value, e.id.value].join('_')
        }));
        dispatch(setRows(_rows));
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      })
  }

  useEffect(() => {
    if (paginationState.page === 0) {
      handleGetData();
    } else {
      dispatch(setPagination({ page: 0 }))
    }
  }, [filtersStateDebounced, sortState]);

  useEffect(() => {
    handleGetData();
  }, [paginationState]);
  
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
          sortingOrder={['asc', 'desc']}
          onSortModelChange={(e) => dispatch(setSort({ key: e[0].field, value: e[0].sort }))}
          paginationMode="server"
          page={paginationState.page}
          pageSize={paginationState.pageSize}
          rowsPerPageOptions={[10, 25, 50, 100]}
          rowCount={rowCount}
          onPageChange={(e) => dispatch(setPagination({ page: e }))}
          onPageSizeChange={(e) => dispatch(setPagination({ page: 0, pageSize: e }))}
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