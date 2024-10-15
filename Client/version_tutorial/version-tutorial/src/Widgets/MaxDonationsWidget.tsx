import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import '../styles/statsWidgetStyles.css';

// Define un tipo para los datos de las donaciones máximas
interface MaxDonationsData {
    month: string;
    amount: number;
}

const MaxDonationsWidget = () => {
    const dataProvider = useDataProvider();
    const [donationsData, setDonationsData] = useState<MaxDonationsData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchMaxDonations = async () => {
            try {
                const donationsResponse = await dataProvider.getList('donations', {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'amount', order: 'DESC' }, // Ordena por la cantidad de donación
                    filter: {},
                });

                // Agrupa por mes y obtiene la mayor donación por mes
                const groupedData = donationsResponse.data.reduce((acc: Record<string, number>, donation) => {
                    const month = new Date(donation.date).toLocaleString('default', { month: 'long' });
                    acc[month] = Math.max(acc[month] || 0, donation.amount);
                    return acc;
                }, {});

                // Convierte a un array para Recharts
                const formattedData: MaxDonationsData[] = Object.keys(groupedData).map(key => ({
                    month: key,
                    amount: groupedData[key],
                }));

                setDonationsData(formattedData);
            } catch (error) {
                console.error('Error fetching max donations:', error);
                setError('Error al cargar las donaciones máximas');
            } finally {
                setLoading(false);
            }
        };

        fetchMaxDonations();
    }, [dataProvider]);

    if (loading) return <CircularProgress />;
    if (error) return <Typography>{error}</Typography>;

    return (
        <Card
            className="widget"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                transition: 'transform 0.3s, height 0.3s',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                height: isHovered ? 'auto' : '300px',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CardContent>
                <Typography variant="h5" className="widget-title">Máximas Donaciones por Mes</Typography>

                {/* Gráfica de barras */}
                <BarChart
                    width={400}
                    height={300}
                    data={donationsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="amount" fill="#82ca9d" />
                </BarChart>
            </CardContent>
        </Card>
    );
};

export default MaxDonationsWidget;
