import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

export const AnalyticsCard = (props: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  navigateTo: string;
}) => {
  const { title, value, subtitle, icon, iconBgColor, navigateTo } = props;

  return (
    <Link to={navigateTo} style={{ textDecoration: 'none' }}>
      <Card sx={{ width: '300px' }} elevation={12}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: iconBgColor }}>{icon}</Avatar>}
          title={title}
          subheader={value}
        />
        <CardContent sx={{ bgcolor: '#282828' }}>
          <Typography color="white">{subtitle}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};
