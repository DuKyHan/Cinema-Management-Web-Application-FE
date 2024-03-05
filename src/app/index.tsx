/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import { Box } from '@mui/material';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { EditMode } from 'types/edit-mode';
import { Role } from 'types/role';
import { GOOGLE_MAPS_API_KEY } from 'utils/config';
import { requireNonNull } from 'utils/general';
import { NavBar } from './components/NavBar/NavBar';
import {
  RequireAuthRoute,
  RequireRoleRoute,
} from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { GlobalDialogProvider } from './context/GlobalDialogContext';
import { GlobalSnackbarProvider } from './context/GlobalSnackbarContext';
import { CurrentProfileProvider } from './context/ProfileContext';
import { AdminAccountListPage } from './pages/AdminAccountListPage';
import { AdminCinemaListPage } from './pages/AdminCinemaListPage';
import { AdminFilmCreateEditPage } from './pages/AdminFilmCreateEditPage';
import { AdminFilmListPage } from './pages/AdminFilmListPage';
import { AdminFilmRevenueAnalyticsPage } from './pages/AdminFilmRevenueAnalyticsPage';
import { AdminNewsListPage } from './pages/AdminNewsListPage';
import { AdminReportListPage } from './pages/AdminReportListPage';
import { ChatPage } from './pages/Chat';
import { CinemaPage } from './pages/CinemaPage';
import { EmailVerificationPage } from './pages/EmailVerificationPage';
import { EnterForgetPasswordPage } from './pages/EnterForgetPasswordPage';
import { FilmListPage } from './pages/FilmListPage';
import { FilmPage } from './pages/FilmPage';
import { ForgetPasswordPage } from './pages/ForgetPasswordPage';
import { HomePage } from './pages/HomePage/Loadable';
import { Login } from './pages/Login';
import { ModBrandEditPage } from './pages/ModBrandEditPage';
import { ModBrandPage } from './pages/ModBrandPage';
import { ModCinemaCreateEditPage } from './pages/ModCinemaCreateEditPage';
import { ModCinemaFilmCreateEditPage } from './pages/ModCinemaFilmCreateEditPage';
import { ModCinemaFilmListPage } from './pages/ModCinemaFilmListPage';
import { ModCinemaListPage } from './pages/ModCinemaListPage';
import { ModFoodCreateEditPage } from './pages/ModFoodCreateEditPage';
import { ModFoodListPage } from './pages/ModFoodListPage/ModFoodListPage';
import { ModNewsCreateEditPage } from './pages/ModNewsCreateEditPage';
import { ModNewsListPage } from './pages/ModNewsListPage';
import { ModRoomCreateEditPage } from './pages/ModRoomCreateEditPage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsPage } from './pages/NewsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { NotificationPage } from './pages/NotificationPage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReportListPage } from './pages/ReportListPage';
import { SignUpPage } from './pages/SignUpPage';
import { TicketListPage } from './pages/TicketListPage';
import { TicketPage } from './pages/TicketPage';
import { AppRoute } from './routes';

export function App() {
  const { i18n } = useTranslation();

  return (
    <BrowserRouter>
      <GlobalSnackbarProvider>
        <GlobalDialogProvider>
          <AuthProvider>
            <CurrentProfileProvider>
              <APIProvider apiKey={requireNonNull(GOOGLE_MAPS_API_KEY)}>
                <Helmet
                  titleTemplate="%s - Cinema Web"
                  defaultTitle="Cinema Web"
                  htmlAttributes={{ lang: i18n.language }}
                >
                  <meta
                    name="description"
                    content="Cinema Web application for movie lovers"
                  />
                </Helmet>

                <Routes>
                  <Route path={AppRoute.Login} element={<Login />} />
                  <Route path={AppRoute.SignUp} element={<SignUpPage />} />
                  <Route
                    path={AppRoute.EmailVerification}
                    element={<EmailVerificationPage />}
                  />
                  <Route
                    path={AppRoute.ForgetPassword}
                    element={<ForgetPasswordPage />}
                  />
                  <Route
                    path={AppRoute.EnterForgetPassword}
                    element={<EnterForgetPasswordPage />}
                  />
                  <Route path="*" element={<MainLayout />} />
                </Routes>
              </APIProvider>
            </CurrentProfileProvider>
          </AuthProvider>
        </GlobalDialogProvider>
      </GlobalSnackbarProvider>
    </BrowserRouter>
  );
}

const MainLayout = props => {
  return (
    <>
      <NavBar />
      <Box sx={{ m: 3 }}>
        <Routes>
          <Route path={AppRoute.Home} element={<HomePage />} />
          <Route path={AppRoute.FilmList} element={<FilmListPage />} />
          <Route path={AppRoute.Film} element={<FilmPage />} />
          <Route path={AppRoute.NewsList} element={<NewsListPage />} />
          <Route element={<RequireAuthRoute />}>
            <Route path={AppRoute.Profile} element={<ProfilePage />} />
            <Route path={AppRoute.ProfileEdit} element={<ProfileEditPage />} />
            <Route path={AppRoute.Chat} element={<ChatPage />} />

            <Route path={AppRoute.News} element={<NewsPage />} />
            <Route path={AppRoute.Cinema} element={<CinemaPage />} />
            <Route
              path={AppRoute.Notification}
              element={<NotificationPage />}
            />
            <Route path={AppRoute.Reports} element={<ReportListPage />} />
            <Route element={<RequireRoleRoute role={Role.User} />}>
              <Route path={AppRoute.TicketList} element={<TicketListPage />} />
              <Route path={AppRoute.Ticket} element={<TicketPage />} />
            </Route>
            <Route element={<RequireRoleRoute role={Role.Moderator} />}>
              <Route
                path={AppRoute.ModCinemaList}
                element={<ModCinemaListPage />}
              />
              <Route
                path={AppRoute.ModCinemaCreate}
                element={<ModCinemaCreateEditPage mode={EditMode.Create} />}
              />
              <Route
                path={AppRoute.ModCinemaEdit}
                element={<ModCinemaCreateEditPage mode={EditMode.Edit} />}
              />
              <Route path={AppRoute.ModBrand} element={<ModBrandPage />} />
              <Route
                path={AppRoute.ModBrandEdit}
                element={<ModBrandEditPage />}
              />
              <Route
                path={AppRoute.ModRoomCreate}
                element={<ModRoomCreateEditPage editMode={EditMode.Create} />}
              />
              <Route
                path={AppRoute.ModRoomEdit}
                element={<ModRoomCreateEditPage editMode={EditMode.Edit} />}
              />
              <Route
                path={AppRoute.ModCinemaFilmList}
                element={<ModCinemaFilmListPage />}
              />
              <Route
                path={AppRoute.ModCinemaFilmCreate}
                element={<ModCinemaFilmCreateEditPage mode={EditMode.Create} />}
              />
              <Route
                path={AppRoute.ModCinemaFilmEdit}
                element={<ModCinemaFilmCreateEditPage mode={EditMode.Edit} />}
              />
              <Route
                path={AppRoute.ModFoodList}
                element={<ModFoodListPage />}
              />
              <Route
                path={AppRoute.ModFoodCreate}
                element={<ModFoodCreateEditPage mode={EditMode.Create} />}
              />
              <Route
                path={AppRoute.ModFoodEdit}
                element={<ModFoodCreateEditPage mode={EditMode.Edit} />}
              />
              <Route
                path={AppRoute.ModNewsList}
                element={<ModNewsListPage />}
              />
              <Route
                path={AppRoute.ModNewsCreate}
                element={<ModNewsCreateEditPage mode={EditMode.Create} />}
              />
              <Route
                path={AppRoute.ModNewsEdit}
                element={<ModNewsCreateEditPage mode={EditMode.Edit} />}
              />
            </Route>
            <Route element={<RequireRoleRoute role={Role.Admin} />}>
              <Route
                path={AppRoute.AdminAccountList}
                element={<AdminAccountListPage />}
              />
              <Route
                path={AppRoute.AdminFilmList}
                element={<AdminFilmListPage />}
              />
              <Route
                path={AppRoute.AdminFilmCreate}
                element={<AdminFilmCreateEditPage mode={EditMode.Create} />}
              />
              <Route
                path={AppRoute.AdminFilmEdit}
                element={<AdminFilmCreateEditPage mode={EditMode.Edit} />}
              />
              <Route
                path={AppRoute.AdminFilmRevenueAnalytics}
                element={<AdminFilmRevenueAnalyticsPage />}
              />
              <Route
                path={AppRoute.AdminCinemaList}
                element={<AdminCinemaListPage />}
              />
              <Route
                path={AppRoute.AdminNewsList}
                element={<AdminNewsListPage />}
              />
              <Route
                path={AppRoute.AdminFoodList}
                element={<ModFoodListPage />}
              />
              <Route
                path={AppRoute.AdminReportList}
                element={<AdminReportListPage />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </>
  );
};
