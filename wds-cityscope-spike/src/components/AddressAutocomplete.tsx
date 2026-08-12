import { useMemo, useRef, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import { mockAddresses, type MockAddress } from '../data/mockAddresses';

const DEBOUNCE_MS = 250;
export const ADDRESS_NOT_FOUND_MESSAGE = "We couldn't find that address — try Use advanced search";

export interface AddressAutocompleteProps {
  onAddressSelected: (address: string) => void;
}

// Built on MUI Autocomplete + TextField (AD-2). Filters the static
// mockAddresses dataset client-side (AD-3: no live API/fetch calls).
export default function AddressAutocomplete({ onAddressSelected }: AddressAutocompleteProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<MockAddress[]>([]);
  const [showError, setShowError] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleInputChange = (_event: React.SyntheticEvent, value: string) => {
    setInputValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!value) {
      setOptions([]);
      setShowError(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      const matches = mockAddresses.filter((addr) =>
        addr.fullAddress.toLowerCase().includes(value.toLowerCase()),
      );
      setOptions(matches);
      setShowError(matches.length === 0);
    }, DEBOUNCE_MS);
  };

  const handleSelect = (_event: React.SyntheticEvent, value: MockAddress | string | null) => {
    if (value && typeof value !== 'string') {
      setShowError(false);
      onAddressSelected(value.fullAddress);
    }
  };

  const optionLabels = useMemo(() => options, [options]);

  return (
    <Autocomplete
      freeSolo
      options={optionLabels}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.fullAddress)}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Enter Address"
          error={showError}
          helperText={showError ? ADDRESS_NOT_FOUND_MESSAGE : ' '}
          slotProps={{
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <Box
                      component="img"
                      src="/search-icon.svg"
                      alt=""
                      sx={{ width: '21px', height: '21px' }}
                    />
                  </InputAdornment>
                  {params.slotProps.input.startAdornment}
                </>
              ),
              sx: {
                height: '52px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                fontFamily: '"Source Sans Pro", sans-serif',
                fontSize: '17.7px',
                letterSpacing: '0.5px',
                color: 'rgba(17, 11, 28, 0.8)',
                '& fieldset': {
                  border: '1px solid rgba(0, 0, 0, 0.23)',
                },
              },
            },
          }}
        />
      )}
    />
  );
}
