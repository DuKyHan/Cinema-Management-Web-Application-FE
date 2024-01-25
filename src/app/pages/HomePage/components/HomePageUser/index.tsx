import { Grid, Typography } from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import { useAuth } from 'app/context/AuthContext';
import { useCurrentProfile } from 'app/context/ProfileContext';
import { AppRoute } from 'app/routes';
import { getFilmPremieres } from 'app/services/film';
import { getNews, newsIncludes } from 'app/services/news';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FilmPremiere } from 'types/film';
import { News } from 'types/news';
import { getProfileDisplayNameOrDefault } from 'utils/profile';
import { EventCalendar } from './EventCalendar';
import { FilmListWithTitle } from './FilmListWithTitle';
import { HomePageUserBreadcrumbs } from './HomePageUserBreadcrumbs';
import { NewsListWithTitle } from './NewsListWithTitle';

export const HomePageUser = () => {
  const navigate = useNavigate();
  const { accessToken, account } = useAuth();
  const { currentProfile } = useCurrentProfile();
  const [isFilmsInCinemaTodayLoading, setIsFilmsInCinemaTodayLoading] =
    useState(true);
  const [isUpcomingFilmsLoading, setIsUpcomingFilmsLoading] = useState(true);
  const [isNewsLoading, setIsNewsLoading] = useState(true);
  const [filmsInCinemaToday, setFilmsInCinemaToday] = useState<FilmPremiere[]>(
    [],
  );
  const [upcomingFilms, setUpcomingFilms] = useState<FilmPremiere[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    getFilmPremieres({
      startDate: new Date(),
      endDate: dayjs().endOf('day').toDate(),
      limit: 4,
    }).then(res => {
      setFilmsInCinemaToday(res.data.data);
      setIsFilmsInCinemaTodayLoading(false);
    });

    getFilmPremieres({
      limit: 4,
      startDate: new Date(),
    }).then(res => {
      setUpcomingFilms(res.data.data);
      setIsUpcomingFilmsLoading(false);
    });

    getNews({
      limit: 4,
      includes: newsIncludes,
    }).then(res => {
      setNews(res.data.data);
      setIsNewsLoading(false);
    });
  }, []);

  if (isFilmsInCinemaTodayLoading || isUpcomingFilmsLoading || isNewsLoading) {
    return <Loading />;
  }

  return (
    <>
      <Grid container columnSpacing={4}>
        <Grid item xs={accessToken ? 8 : 12} sx={{ backgroundColor: 'white' }}>
          <HomePageUserBreadcrumbs />
          <Typography variant={'h4'} sx={{ my: 1 }}>
            Welcome {getProfileDisplayNameOrDefault(currentProfile, 'back')}
          </Typography>
          <Typography sx={{ fontSize: 22, my: 1, mb: 12 }}>
            {dayjs().format('dddd, DD MMMM YYYY')}
          </Typography>
          <FilmListWithTitle
            title={'In cinema today'}
            films={filmsInCinemaToday}
            noFilmMessage={'No films in cinema today'}
            filmPerLine={accessToken ? 3 : 4}
            maxFilms={accessToken ? 3 : 4}
            onClickSeeMore={() => {
              navigate(AppRoute.FilmList);
            }}
          />
          <FilmListWithTitle
            title={'Upcoming films'}
            films={upcomingFilms}
            noFilmMessage={'No upcoming films'}
            filmPerLine={accessToken ? 3 : 4}
            maxFilms={accessToken ? 3 : 4}
            onClickSeeMore={() => {
              navigate(AppRoute.FilmList);
            }}
          />
          <NewsListWithTitle
            title={'News'}
            news={news}
            newsPerLine={accessToken ? 3 : 4}
            maxNews={accessToken ? 3 : 4}
            onClickSeeMore={() => {
              navigate(AppRoute.NewsList);
            }}
          />
        </Grid>
        {accessToken ? (
          <Grid item xs={4}>
            <EventCalendar />
          </Grid>
        ) : null}
      </Grid>
    </>
  );
};
