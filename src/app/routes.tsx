export enum AppRoute {
  Home = '/',
  Login = '/login',
  SignUp = '/signup',
  EmailVerification = '/email-verification',
  ForgetPassword = '/forget-password',
  EnterForgetPassword = '/forget-password2',
  ModViews = '/mod/viewNews',
  Profile = '/profile',
  ProfileEdit = '/profile/edit',
  Chat = '/chat',
  NewsList = '/news',
  News = '/news/:newsId',
  Cinema = '/cinema/:cinemaId',
  FilmList = '/films',
  Film = '/films/:filmId',
  TicketList = '/tickets',
  Ticket = '/ticket/:cinemaFilmId/:premiereId',
  Reports = '/reports',
  Notification = '/notifications',

  ModBrand = '/mod/brand',
  ModBrandEdit = '/mod/brand/edit',
  ModCinemaList = '/mod/cinemas',
  ModCinemaCreate = '/mod/cinemas/create',
  ModCinemaEdit = '/mod/cinemas/edit/:cinemaId',
  ModRoomCreate = '/mod/cinemas/:cinemaId/rooms/create',
  ModRoomEdit = '/mod/cinemas/:cinemaId/rooms/edit/:roomId',
  ModCinemaFilmList = '/mod/cinema-films',
  ModCinemaFilmCreate = '/mod/cinema-films/create',
  ModCinemaFilmEdit = '/mod/cinema-films/edit/:cinemaFilmId',
  ModFoodList = '/mod/foods',
  ModFoodCreate = '/mod/foods/create',
  ModFoodEdit = '/mod/foods/edit/:foodId',
  ModNewsList = '/mod/news',
  ModNewsCreate = '/mod/news/create',
  ModNewsEdit = '/mod/news/edit/:newsId',
  AdminAccountList = '/admin/accounts',
  AdminFilmList = '/admin/films',
  AdminFilmCreate = '/admin/films/create',
  AdminFilmEdit = '/admin/films/edit/:filmId',
  AdminCinemaList = '/admin/cinemas',
  AdminFoodList = '/admin/foods',
  AdminNewsList = '/admin/news',
  AdminReportList = '/admin/reports',
  NotFound = '*',
}

export const replaceRouteParams = (
  route: string,
  params: Record<string, string>,
) => {
  let result = route;
  Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, params[key]);
  });
  return result;
};
