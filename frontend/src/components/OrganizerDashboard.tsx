// import { useEffect, useState } from 'react';
// import { Card, Spin, Alert, Divider } from 'antd';
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { StarFilled, UserOutlined, CalendarOutlined, MessageOutlined } from '@ant-design/icons';
//
// interface OrganizerStats {
//     organizerId: string;
//     eventsCreated: number;
//     reviewsReceived: number;
//     participantsCount: number;
//     averageReviewScore: number;
//     organizerEvents?: any[];
//     organizerReviews?: any[];
// }
//
// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
//
// const OrganizerDashboard = () => {
//     const [stats, setStats] = useState<OrganizerStats | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Здесь должен быть реальный запрос к вашему API
//                 // const response = await fetchOrganizerStats();
//                 // Для демонстрации используем мок-данные
//                 const mockData: OrganizerStats = {
//                     organizerId: "123",
//                     eventsCreated: 8,
//                     reviewsReceived: 24,
//                     participantsCount: 450,
//                     averageReviewScore: 4.3,
//                     organizerEvents: [
//                         { id: 1, title: "Конференция разработчиков", participants: 120, date: "2023-05-15" },
//                         { id: 2, title: "Воркшоп по дизайну", participants: 80, date: "2023-06-20" },
//                         // ... другие мероприятия
//                     ],
//                     organizerReviews: [
//                         { id: 1, eventId: 1, rating: 5, comment: "Отличное мероприятие!", author: "Алексей" },
//                         { id: 2, eventId: 1, rating: 4, comment: "Хорошая организация", author: "Мария" },
//                         // ... другие отзывы
//                     ]
//                 };
//
//                 setStats(mockData);
//             } catch (err) {
//                 setError('Ошибка загрузки данных');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchData();
//     }, []);
//
//     if (loading) return <Spin size="large" className="center-spinner" />;
//     if (error) return <Alert message={error} type="error" showIcon />;
//     if (!stats) return <Alert message="Данные не найдены" type="warning" showIcon />;
//
//     // Подготовка данных для графиков
//     const eventsData = [
//         { name: 'С отзывами', value: stats.reviewsReceived },
//         { name: 'Без отзывов', value: stats.eventsCreated - stats.reviewsReceived },
//     ];
//
//     const ratingDistribution = [
//         { name: '5 звезд', value: 10 },
//         { name: '4 звезды', value: 8 },
//         { name: '3 звезды', value: 4 },
//         { name: '2 звезды', value: 2 },
//         { name: '1 звезда', value: 0 },
//     ];
//
//     const participantsData = stats.organizerEvents?.map(event => ({
//         name: event.title,
//         participants: event.participants,
//     })) || [];
//
//     return (
//         <div className="dashboard-container">
//             <h1>Дашборд организатора</h1>
//
//             {/* Основные метрики */}
//             <div className="metrics-row">
//                 <MetricCard
//                     icon={<CalendarOutlined />}
//                     title="Мероприятий"
//                     value={stats.eventsCreated}
//                     color="#1890ff"
//                 />
//                 <MetricCard
//                     icon={<UserOutlined />}
//                     title="Участников"
//                     value={stats.participantsCount}
//                     color="#52c41a"
//                 />
//                 <MetricCard
//                     icon={<MessageOutlined />}
//                     title="Отзывов"
//                     value={stats.reviewsReceived}
//                     color="#faad14"
//                 />
//                 <MetricCard
//                     icon={<StarFilled />}
//                     title="Средний рейтинг"
//                     value={stats.averageReviewScore.toFixed(1)}
//                     color="#f5222d"
//                     isRating
//                 />
//             </div>
//
//             <Divider />
//
//             {/* Графики */}
//             <div className="charts-row">
//                 <div className="chart-container">
//                     <h3>Распределение отзывов</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <PieChart>
//                             <Pie
//                                 data={eventsData}
//                                 cx="50%"
//                                 cy="50%"
//                                 labelLine={false}
//                                 outerRadius={80}
//                                 fill="#8884d8"
//                                 dataKey="value"
//                                 label={({ name, percent }) => ${name}: ${(percent * 100).toFixed(0)}%}
//                             >
//                                 {eventsData.map((entry, index) => (
//                                     <Cell key={cell-${index}} fill={COLORS[index % COLORS.length]} />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//
//                 <div className="chart-container">
//                     <h3>Участники по мероприятиям</h3>
//                     <ResponsiveContainer width="100%" height={300}>
//                         <BarChart data={participantsData}>
//                             <XAxis dataKey="name" />
//                             <YAxis />
//                             <Tooltip />
//                             <Legend />
//                             <Bar dataKey="participants" fill="#8884d8" />
//                         </BarChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//
//             <Divider />
//
//             {/* Последние отзывы */}
//             <div className="reviews-section">
//                 <h2>Последние отзывы</h2>
//                 <div className="reviews-grid">
//                     {stats.organizerReviews?.slice(0, 4).map(review => (
//                         <ReviewCard key={review.id} review={review} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// // Компонент карточки метрики
// const MetricCard = ({ icon, title, value, color, isRating = false }: any) => (
//     <Card className="metric-card">
//         <div className="metric-content">
//             <div className="metric-icon" style={{ backgroundColor: color }}>
//                 {icon}
//             </div>
//             <div className="metric-text">
//                 <h3>{title}</h3>
//                 <p className="metric-value">
//                     {isRating ? (
//                         <>
//                             {value} <StarFilled style={{ color: '#ffc107' }} />
//                         </>
//                     ) : (
//                         value
//                     )}
//                 </p>
//             </div>
//         </div>
//     </Card>
// );
//
// // Компонент карточки отзыва
// const ReviewCard = ({ review }: any) => (
//     <Card className="review-card">
//         <div className="review-header">
//       <span className="review-rating">
//         {Array.from({ length: 5 }).map((_, i) => (
//             <StarFilled key={i} className={i < review.rating ? 'star-filled' : 'star-empty'} />
//         ))}
//       </span>
//             <span className="review-author">{review.author}</span>
//         </div>
//         <p className="review-comment">"{review.comment}"</p>
//     </Card>
// );
//
// // Стили (можно вынести в отдельный CSS файл)
// const styles = `
//   .dashboard-container {
//     padding: 20px;
//     max-width: 1200px;
//     margin: 0 auto;
//   }
//
//   .metrics-row {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//     gap: 16px;
//     margin-bottom: 24px;
//   }
//
//   .metric-card {
//     border-radius: 8px;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   }
//
//   .metric-content {
//     display: flex;
//     align-items: center;
//     gap: 16px;
//   }
//
//   .metric-icon {
//     width: 48px;
//     height: 48px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 20px;
//   }
//
//   .metric-value {
//     font-size: 24px;
//     font-weight: bold;
//     margin: 0;
//   }
//
//   .charts-row {
//     display: grid;
//     grid-template-columns: 1fr 1fr;
//     gap: 24px;
//     margin-bottom: 24px;
//   }
//
//   .chart-container {
//     background: white;
//     padding: 16px;
//     border-radius: 8px;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   }
//
//   .reviews-grid {
//     display: grid;
//     grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//     gap: 16px;
//   }
//
//   .review-card {
//     border-radius: 8px;
//     box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   }
//
//   .review-header {
//     display: flex;
//     justify-content: space-between;
//     margin-bottom: 8px;
//   }
//
//   .review-rating .star-filled {
//     color: #ffc107;
//   }
//
//   .review-rating .star-empty {
//     color: #e0e0e0;
//   }
//
//   .review-comment {
//     font-style: italic;
//     color: #555;
//   }
//
//   .center-spinner {
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     height: 200px;
//   }
// `;
//
// // Добавляем стили в документ
// const styleElement = document.createElement('style');
// styleElement.innerHTML = styles;
// document.head.appendChild(styleElement);
//
// export default OrganizerDashboard;