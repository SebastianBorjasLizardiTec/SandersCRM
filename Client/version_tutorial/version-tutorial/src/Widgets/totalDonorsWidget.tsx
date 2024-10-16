import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import '../styles/statsWidgetStyles.css';

const TotalDonorsWidget = () => {
    const dataProvider = useDataProvider();
    const [totalDonors, setTotalDonors] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false); // Controla el hover

    // Define una cifra objetivo de donadores
    const targetDonors = 100; // Cambia esto según tu objetivo

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const donorsResponse = await dataProvider.getList('donors', {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });

                setTotalDonors(donorsResponse.total ?? 0); // Usamos '??' para asignar 0 si total es undefined
            } catch (error) {
                console.error('Error fetching total donors:', error);
                setError('Error al cargar el total de donadores');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dataProvider]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography>{error}</Typography>;

    // Calcular el porcentaje de donadores alcanzados
    const percentageAchieved = totalDonors !== null ? ((totalDonors / targetDonors) * 100).toFixed(2) : 'N/A';

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
                <Typography variant="h5" className="widget-title">Donadores</Typography>
                <Typography variant="h4" className="widget-value">{totalDonors !== null ? totalDonors : 'N/A'}</Typography>

                {isHovered && (
                    <Typography variant="h6" className="widget-description">
                        Porcentaje de donadores alcanzados: {percentageAchieved}%
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default TotalDonorsWidget;
