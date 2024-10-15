import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import '../styles/statsWidgetStyles.css';

const TotalDonationsWidget = () => {
    const dataProvider = useDataProvider();
    const [totalDonations, setTotalDonations] = useState<number | null>(null);
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
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

                setTotalDonations(donationsResponse.total ?? 0);
                setTotalAmount(
                    donationsResponse.data.reduce((acc, donation) => acc + donation.monto, 0)
                );
            } catch (error) {
                console.error('Error fetching total donations:', error);
                setError('Error al cargar las donaciones');
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
                <Typography variant="h5" className="widget-title">Donaciones</Typography>
                <Typography variant="h6" className="widget-value">{totalDonations !== null ? totalDonations : 'N/A'}</Typography>

                {isHovered && (
                    <Typography variant="h6" className="widget-description">
                        Monto Total Recaudado: ${totalAmount !== null ? totalAmount : 'N/A'}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default TotalDonationsWidget;
