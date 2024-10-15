import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import '../styles/statsWidgetStyles.css';

interface DonorsByStateData {
    estado: string;
    cantidad: number;
}

const DonorsByStateWidget = () => {
    const dataProvider = useDataProvider();
    const [donorsData, setDonorsData] = useState<DonorsByStateData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const donorsResponse = await dataProvider.getList('donors', {
                    pagination: { page: 1, perPage: 1000 },
                    sort: { field: 'id', order: 'ASC' },
                    filter: {},
                });

                // Agrupa donadores por estado
                const groupedData = donorsResponse.data.reduce((acc: Record<string, number>, donor) => {
                    const state = donor.estado; 
                    acc[state] = (acc[state] || 0) + 1;
                    return acc;
                }, {});

                // Convierte a un array para Recharts y ordena por cantidad de donaciones
                const formattedData: DonorsByStateData[] = Object.keys(groupedData)
                    .map(key => ({
                        estado: key,
                        cantidad: groupedData[key],
                    }))
                    .sort((a, b) => b.cantidad - a.cantidad) // Ordena por cantidad descendente
                    .slice(0, 3); // Toma los primeros 3

                setDonorsData(formattedData);
            } catch (error) {
                console.error('Error fetching donors by state:', error);
                setError('Error al cargar los donadores por estado');
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
                <Typography variant="h5" className="widget-title">Top 3 Estados con más Donaciones</Typography>

                {/* Gráfica de barras */}
                <BarChart
                    width={400}
                    height={300}
                    data={donorsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#8884d8" />
                </BarChart>
            </CardContent>
        </Card>
    );
};

export default DonorsByStateWidget;
