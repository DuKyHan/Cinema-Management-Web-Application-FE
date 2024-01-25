import { Typography } from '@mui/material';
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
import { FilmListWithTitle } from '../HomePageUser/FilmListWithTitle';
import { NewsListWithTitle } from '../HomePageUser/NewsListWithTitle';
import { HomePageUserBreadcrumbs } from './HomePageUserBreadcrumbs';

export const HomePageMod = () => {
  const navigate = useNavigate();
  const { account } = useAuth();
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
      ownerId: account?.id,
    }).then(res => {
      setFilmsInCinemaToday(res.data.data);
      setIsFilmsInCinemaTodayLoading(false);
    });

    getFilmPremieres({
      limit: 4,
      startDate: new Date(),
      ownerId: account?.id,
    }).then(res => {
      setUpcomingFilms(res.data.data);
      setIsUpcomingFilmsLoading(false);
    });

    getNews({
      limit: 4,
      authorId: account?.id,
      includes: newsIncludes,
    }).then(res => {
      setNews(res.data.data);
      setIsNewsLoading(false);
    });
  }, [account?.id]);

  if (isFilmsInCinemaTodayLoading || isUpcomingFilmsLoading || isNewsLoading) {
    return <Loading />;
  }

  return (
    <>
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
        filmPerLine={4}
        onClickSeeMore={() => {
          navigate(AppRoute.ModCinemaFilmList);
        }}
      />
      <FilmListWithTitle
        title={'Upcoming films'}
        films={upcomingFilms}
        noFilmMessage={'No upcoming films'}
        filmPerLine={4}
        onClickSeeMore={() => {
          navigate(AppRoute.ModCinemaFilmList);
        }}
      />
      <NewsListWithTitle
        title={'News'}
        news={news}
        newsPerLine={4}
        onClickSeeMore={() => {
          navigate(AppRoute.ModNewsList);
        }}
      />
    </>
  );
};
