import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDataProvider } from 'react-admin';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'; // Importa componentes de Recharts
import '../styles/statsWidgetStyles.css';

// Define un tipo para los datos de las donaciones
interface DonationData {
    frecuencia: string;
    cantidad: number;
}

const TotalDonationsWidget = () => {
    const dataProvider = useDataProvider();
    const [donationData, setDonationData] = useState<DonationData[]>([]); // Inicializa el estado con el tipo correcto
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

                // Agrupa donaciones por frecuencia
                const groupedData = donationsResponse.data.reduce((acc: Record<string, number>, donation) => {
                    const frequency = donation.frecuencia; // Suponiendo que el tipo de frecuencia está en 'frecuencia'
                    acc[frequency] = (acc[frequency] || 0) + 1;
                    return acc;
                }, {});

                // Convierte a un array para Recharts
                const formattedData: DonationData[] = Object.keys(groupedData).map(key => ({
                    frecuencia: key,
                    cantidad: groupedData[key],
                }));

                setDonationData(formattedData);
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
                height: isHovered ? 'auto' : '300px', // Aumenta la altura para la gráfica
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            <CardContent>
                <Typography variant="h5" className="widget-title">Donaciones por Frecuencia</Typography>

                {/* Gráfica de barras */}
                <BarChart
                    width={300} // Ajusta el tamaño según tus necesidades
                    height={200}
                    data={donationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="frecuencia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#deae3e" />
                </BarChart>
            </CardContent>
        </Card>
    );
};

export default TotalDonationsWidget;
