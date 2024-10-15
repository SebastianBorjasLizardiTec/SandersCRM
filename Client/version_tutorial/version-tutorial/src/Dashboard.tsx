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
        flexDirection: 'column', // Cambia la dirección a columna
        alignItems: 'center', // Centra el contenido horizontalmente
      }}
    >
      {/* Encabezado */}
      <Typography variant="h4" sx={{ marginBottom: 2 , color: 'var(--our-dark-blue)', fontFamily: '"Nunito Sans", sans-serif' }}>
        Fundación Sanders
      </Typography>
      
      {/* Imagen en la parte superior */}
      <img 
        src={imageLogo} 
        alt="Logo de la fundación Sanders" 
        style={{ width: '25%', height: 'auto', maxWidth: '800px', marginBottom: '20px' }} // Ajusta el tamaño y el margen
      />
      
      {/* Cuadrícula para los widgets */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TotalDonorsWidget />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TotalDonationsWidget />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <CampaignStatsWidget />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;