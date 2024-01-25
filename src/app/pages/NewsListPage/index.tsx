import { Newspaper, Search } from '@mui/icons-material';
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { AppBreadcrumbs } from 'app/components/AppBreadcrumbs/AppBreadcrumbs';
import { AppRoute } from 'app/routes';
import { LatestNewsSection } from './components/LastestNewsSection';
import { PopularNewsSection } from './components/PopularNewsSection';

export function NewsListPage() {
  return (
    <>
      <AppBreadcrumbs
        templates={[
          {
            icon: <Newspaper sx={{ mr: 0.5 }} fontSize="inherit" />,
            href: AppRoute.NewsList,
            name: 'News',
          },
        ]}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">News</Typography>
        <TextField
          placeholder="Search news"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Grid container spacing={4} sx={{ mt: 4 }}>
        <PopularNewsSection />
        <LatestNewsSection />
      </Grid>
    </>
  );
}
