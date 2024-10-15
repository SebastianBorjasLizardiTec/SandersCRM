import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';

const StatsWidget = () => {
    const dataProvider = useDataProvider();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [donorsResponse, donationsResponse] = await Promise.all([
                    dataProvider.getList('donors', {
                        pagination: { page: 1, perPage: 1000 }, // Ajustar el número según la cantidad esperada de usuarios
                        sort: { field: 'id', order: 'ASC' },
                        filter: {},
                    }),
                    dataProvider.getList('donations', {
                        pagination: { page: 1, perPage: 1000 }, // Ajustar el número según la cantidad esperada de donaciones
                        sort: { field: 'id', order: 'ASC' },
                        filter: {},
                    }),
                ]);

                const totalDonors = donorsResponse.total;
                const totalDonations = donationsResponse.total;
                const totalAmount = donationsResponse.data.reduce(
                    (acc, donation) => acc + donation.monto,
                    0
                );

                const frequencyStats = donationsResponse.data.reduce(
                    (acc, donation) => {
                        acc[donation.frecuencia] = (acc[donation.frecuencia] || 0) + 1;
                        return acc;
                    },
                    { Unica: 0, Mensual: 0, Anual: 0 }
                );

                const paymentMethodStats = donationsResponse.data.reduce(
                    (acc, donation) => {
                        acc[donation.metodoPago] = (acc[donation.metodoPago] || 0) + 1;
                        return acc;
                    },
                    { Tarjeta: 0, Transferencia: 0, Efectivo: 0 }
                );

                const campaignStats = donationsResponse.data.reduce(
                    (acc, donation) => {
                        acc[donation.campana] = (acc[donation.campana] || 0) + 1;
                        return acc;
                    },
                    { Agua: 0, Nutricion: 0}
                );

                setStats({
                    totalDonors,
                    totalDonations,
                    totalAmount,
                    frequencyStats,
                    paymentMethodStats,
                    campaignStats,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
                setError('Error al cargar las estadísticas');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [dataProvider]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography>{error}</Typography>;

    return (
        <Card>
            <CardContent>
    <Typography variant="h5">Estadísticas de Donaciones</Typography>
    <Typography variant="h6">Total de Donadores: {typeof stats.totalDonors === 'number' ? stats.totalDonors : 'N/A'}</Typography>
    <Typography variant="h6">Total de Donaciones: {typeof stats.totalDonations === 'number' ? stats.totalDonations : 'N/A'}</Typography>
    <Typography variant="h6">Monto Total Recaudado: ${typeof stats.totalAmount === 'number' ? stats.totalAmount : 'N/A'}</Typography>

    <Typography variant="h6">Frecuencia de Donaciones:</Typography>
    <ul>
        <li>Única: {typeof stats.frequencyStats.Unica === 'number' ? stats.frequencyStats.Unica : 'N/A'}</li>
        <li>Mensual: {typeof stats.frequencyStats.Mensual === 'number' ? stats.frequencyStats.Mensual : 'N/A'}</li>
        <li>Anual: {typeof stats.frequencyStats.Anual === 'number' ? stats.frequencyStats.Anual : 'N/A'}</li>
    </ul>

    <Typography variant="h6">Métodos de Pago:</Typography>
    <ul>
        <li>Tarjeta: {typeof stats.paymentMethodStats.Tarjeta === 'number' ? stats.paymentMethodStats.Tarjeta : 'N/A'}</li>
        <li>Transferencia: {typeof stats.paymentMethodStats.Transferencia === 'number' ? stats.paymentMethodStats.Transferencia : 'N/A'}</li>
        <li>Efectivo: {typeof stats.paymentMethodStats.Efectivo === 'number' ? stats.paymentMethodStats.Efectivo : 'N/A'}</li>
    </ul>

    <Typography variant="h6">Donaciones por Campaña:</Typography>
    <ul>
        <li>Agua: {typeof stats.campaignStats.Agua === 'number' ? stats.campaignStats.Agua : 'N/A'}</li>
        <li>Nutricion: {typeof stats.campaignStats.Nutricion === 'number' ? stats.campaignStats.Nutricion : 'N/A'}</li>
    </ul>
</CardContent>
        </Card>
    );
};

export default StatsWidget;
