import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import '../styles/statsWidgetStyles.css';

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
                    { Agua: 0, Nutricion: 0 }
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

    return (
        <Card
            className="widget" // Aplicar clase para estilos
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transition: 'transform 0.3s, height 0.3s',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Agranda ligeramente el widget al hacer hover
                height: isHovered ? 'auto' : '150px', // Expande la altura si está en hover
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CardContent>
                <Typography variant="h5" className="widget-title">Donaciones por Campaña</Typography>
                {campaignStats ? (
                    <ul className="widget-list">
                        <li>Agua: {typeof campaignStats.Agua === 'number' ? campaignStats.Agua : 'N/A'}</li>
                        <li>Nutricion: {typeof campaignStats.Nutricion === 'number' ? campaignStats.Nutricion : 'N/A'}</li>
                    </ul>
                ) : (
                    <Typography>No hay estadísticas disponibles</Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default CampaignStatsWidget;
