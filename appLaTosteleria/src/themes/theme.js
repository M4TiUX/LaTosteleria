import { createTheme } from '@mui/material/styles'; 
export const appTheme= createTheme  ({ 
  palette: { 
    mode: 'light', 
    primary: { 
      main: '#7E0F06', 
    }, 
    secondary: { 
      main: '#E8C38C', 
    }, 
    primaryLight: { 
        main: "#7E0F06", 
        contrastText: "#E8C38C"  
      } 
  }, 
});