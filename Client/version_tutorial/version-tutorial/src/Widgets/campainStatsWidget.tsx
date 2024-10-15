import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { Pie } from 'react-chartjs-2'; // Importar el gráfico de pastel
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/statsWidgetStyles.css';

Chart.register(ArcElement, Tooltip, Legend); // Registrar los elementos necesarios de Chart.js

const CampaignStatsWidget = () => {
    const dataProvider = useDataProvider();
    const [campaignStats, setCampaignStats] = useState<{ [key: string]: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false); // Controla el hover

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const donationsResponse = await dataProvider.getList('donations', {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });

                const campaignData = donationsResponse.data.reduce(
                    (acc, donation) => {
                        acc[donation.campana] = (acc[donation.campana] || 0) + 1;
                        return acc;
                    },
                    { Agua: 0, Nutricion: 0, Otra: 0 }
                );

                setCampaignStats(campaignData);
            } catch (error) {
                console.error('Error fetching campaign stats:', error);
                setError('Error al cargar las estadísticas de campañas');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dataProvider]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography>{error}</Typography>;

    // Preparar datos para el gráfico, asegurándose de no pasar null
    const data = {
        labels: Object.keys(campaignStats || {}), // Usa un objeto vacío si campaignStats es null
        datasets: [
            {
                data: Object.values(campaignStats || {}), // Usa un objeto vacío si campaignStats es null
                backgroundColor: ['#36A2EB','#FF6384', '#39f7a8'], // Colores de las secciones del gráfico
                hoverBackgroundColor: ['#36A2EB','#FF6384', '#39f7a8'],
            },
        ],
    };

    return (
        <Card
            className="widget" // Aplicar clase para estilos
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transition: 'transform 0.3s, height 0.3s',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Agranda ligeramente el widget al hacer hover
                height: isHovered ? 'auto' : '300px', // Ajustar la altura para el gráfico
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CardContent>
                <Typography variant="h5" className="widget-title">Donaciones por Campaña</Typography>
                {campaignStats && Object.keys(campaignStats).length > 0 ? (
                    <div style={{ height: '200px' }}>
                        <Pie data={data} />
                    </div>
                ) : (
                    <Typography>No hay estadísticas disponibles</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default CampaignStatsWidget;
