import { useEffect } from "react";
import { Button, Box, Typography, TextField, MenuItem } from "@mui/material";
import { setFilters, resetFilters } from '../../redux/actions';
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";
import sx from './sx';

export default function Home() {
  const dispatch = useDispatch();
  const filtersState = useSelector((state) => state.FiltersReducer);
  const filtersStateDebounced = useDebounce(filtersState, 500);

  useEffect(() => {
    console.log(filtersState)
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

  return (
    <Box sx={sx.root}>
      <Typography variant="h5">React Table</Typography>
      {renderTableFilters()}
    </Box>
  )
}