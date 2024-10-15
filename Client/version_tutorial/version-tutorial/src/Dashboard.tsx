import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import TotalDonationsWidget from './Widgets/totalDonationsWidget';
import TotalDonorsWidget from './Widgets/totalDonorsWidget';
import CampaignStatsWidget from './Widgets/campainStatsWidget';
import imageLogo from './assets/logo.jpeg';

const Dashboard = () => {
  return (
    <Box 
      sx={{
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'var(--grey-background)',
        minHeight: '100vh',
        overflowX: 'hidden',
      }}
    >
      <Box 
        sx={{
          backgroundColor: 'var(--our-dark-blue)',
          borderRadius: 2,
          padding: 2,
          boxShadow: 2,
          textAlign: 'left', 
          width: '100%', 
          margin: 0,
          marginBottom: 3,
        }}
      >
        <Typography 
          variant="h3"
          sx={{ 
            color: 'White', 
            fontFamily: '"Nunito Sans", sans-serif', 
            fontWeight: 800,
            marginBottom: 1,
          }}
        >
          Fundación Sanders
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <img 
            src={imageLogo} 
            alt="Logo de la fundación Sanders" 
            style={{ 
              width: 'auto',  
              height: '100%', 
              maxHeight: '180px', 
              marginRight: '10px', 
            }}
          />
          <img 
            src="https://conecta.tec.mx/sites/default/files/inline-images/jenny-salomon-fundacion-sanders-poyecto-techo-hidalgo-2.jpg" 
            alt="Descripción de la primera imagen"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '180px', 
              marginRight: '10px',
            }}
          />
          <img 
            src="https://conecta.tec.mx/sites/default/files/styles/header_full/public/2024-07/jenny-salomon-en-comunidad-hidalguense-portada-conecta.jpg.webp?itok=pCXX0g0-" 
            alt="Descripción de la segunda imagen"
            style={{
              maxWidth: '100%',
              height: 'auto',
              maxHeight: '180px', 
              marginRight: '10px', 
            }}
          />
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCtB_5iVecF_sRyHwu1UiMwodefio-Dn7-sw&s" 
            alt="Descripción de la tercera imagen"
            style={{
              maxWidth: '100%', 
              height: 'auto', 
              maxHeight: '180px', 
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            boxShadow: 1, 
            borderRadius: 2,
            backgroundColor: '#f0f0f0',
          }}>
            <CardContent>
              <TotalDonorsWidget />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            boxShadow: 1, 
            borderRadius: 2,
            backgroundColor: '#f0f0f0',
          }}>
            <CardContent>
              <TotalDonationsWidget />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            boxShadow: 1, 
            borderRadius: 2,
            backgroundColor: '#f0f0f0',
          }}>
            <CardContent>
              <CampaignStatsWidget />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
