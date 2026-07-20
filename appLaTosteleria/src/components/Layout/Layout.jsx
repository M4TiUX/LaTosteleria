// eslint-disable-next-line no-unused-vars
import React from 'react'; 
import PropTypes from 'prop-types'; 
import { Container } from '@mui/material'; 
import Header from './Header'; 
import { Footer } from './Footer'; 
import { Toaster } from 'react-hot-toast';
 
Layout.propTypes = { children: PropTypes.node.isRequired }; 
 
export function Layout({ children }) { 
  return ( 
    <> 
      <Header /> 
      <Container 
        maxWidth="xl" 
        component="main"
        sx={{
          position: 'relative',
          minHeight: 'calc(100vh - 8rem)',
          pt: { xs: 2, md: 3 },
          pb: { xs: 12, md: 14 },
        }} 
      > 
      <Toaster position='top-center' />
        {children} 
      </Container> 
      <Footer /> 
    </> 
  ); 
} 