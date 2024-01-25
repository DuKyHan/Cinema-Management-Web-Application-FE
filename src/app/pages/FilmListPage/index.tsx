import { Movie, Search } from '@mui/icons-material';
import { Grid, InputAdornment, TextField } from '@mui/material';
import { AppBreadcrumbs } from 'app/components/AppBreadcrumbs/AppBreadcrumbs';
import { Loading } from 'app/components/Loading/Loading';
import { AppRoute } from 'app/routes';
import { getFilmPremieres } from 'app/services/film';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FilmPremiere } from 'types/film';
import { FilmCard } from './components/FilmCard';

export const FilmListPage = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<FilmPremiere[]>([]);
  const [search, setSearch] = useState((location.state as any)?.search ?? '');

  useEffect(() => {
    getFilmPremieres({
      search: search.trim().length > 0 ? search : undefined,
      startDate: new Date(),
    }).then(res => {
      setData(res.data.data);
      console.log(res.data.data);
      setIsLoading(false);
    });
  }, [search]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <AppBreadcrumbs
        templates={[
          {
            icon: <Movie sx={{ mr: 0.5 }} fontSize="inherit" />,
            href: AppRoute.FilmList,
            name: 'Film',
          },
        ]}
      />
      <TextField
        label="Search films..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{
          width: '400px',
          my: 2,
        }}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {data.map((news, i) => {
          return (
            <Grid key={i} item xs={3}>
              <FilmCard film={news} />
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
