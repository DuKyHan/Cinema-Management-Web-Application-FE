import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material';
import { useState } from 'react';

export const ChipTextField = (props: {
  onChange?: (values: string[]) => void;
}) => {
  const { onChange } = props;

  const [values, setValues] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');

  const handleKeyUp = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      const newValues = [...values, e.target.value];
      setValues(newValues);
      setCurrentInput('');
      onChange?.(newValues);
    }
  };

  const handleDelete = (item: string, index: number) => {
    let arr = [...values];
    arr.splice(index, 1);
    console.log(item);
    setValues(arr);
  };

  return (
    <Box sx={{ p: 1, border: 1, borderRadius: 4, borderColor: 'lightgray' }}>
      <FormControl sx={{ my: 2 }} fullWidth>
        <InputLabel id="demo-multiple-chip-label" htmlFor="demo-multiple-chip">
          Actors
        </InputLabel>
        <OutlinedInput
          label={'Actors'}
          onChange={e => {
            setCurrentInput(e.target.value);
          }}
          onKeyDown={handleKeyUp}
          value={currentInput}
        />
      </FormControl>
      <Stack direction={'row'} useFlexGap flexWrap="wrap" spacing={1}>
        {values.map((value, index) => (
          <Chip
            size="medium"
            key={index}
            label={value}
            onDelete={() => handleDelete(value, index)}
          />
        ))}
      </Stack>
    </Box>
  );
};
