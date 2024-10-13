import * as React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { useTranslate } from "react-admin";
import '../styles/dashboard.css'

const Dashboard = () => {
  const translate = useTranslate();


  return (
    <div className="container">

      {/* Contenido principal */}
      <div className="content">
        {/* Tarjetas de estadísticas */}
        <div className="card-section">
          <Card sx={{ width: "100%", maxWidth: 400, marginBottom: 1 }}>
            <CardContent>
              <Typography className="title" color="textSecondary" gutterBottom>
                Current Donors
              </Typography>
              <Typography variant="h4">7</Typography>
            </CardContent>
          </Card>

          <Card sx={{ width: "100%", maxWidth: 400, marginBottom: 1 }}>
            <CardContent>
              <Typography className="title" color="textSecondary" gutterBottom>
                New Donors
              </Typography>
              <Typography variant="h4">75%</Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
