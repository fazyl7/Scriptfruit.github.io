import { createTheme } from '@mui/material';
import type { PaletteMode } from '@mui/material';
export const makeTheme = (mode: PaletteMode) =>
  createTheme({
    palette: { mode, primary: { main: '#1976d2' } },
    shape: { borderRadius: 12 },
  });
