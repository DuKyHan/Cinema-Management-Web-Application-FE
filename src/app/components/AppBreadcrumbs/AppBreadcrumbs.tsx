import { Home, NavigateNext } from '@mui/icons-material';
import { Breadcrumbs, Link } from '@mui/material';
import { AppRoute } from 'app/routes';

export class AppBreadcrumbTemplate {
  constructor(
    public icon?: JSX.Element,
    public href?: string,
    public name?: string,
  ) {}
}

export const AppBreadcrumbs = (props: {
  templates: AppBreadcrumbTemplate[];
}) => {
  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href={AppRoute.Home}
      >
        <Home sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
      {props.templates.map((template, index) => {
        return (
          <Link
            key={index}
            underline="hover"
            sx={{ display: 'flex', alignItems: 'center' }}
            color="inherit"
            href={template.href}
          >
            {template.icon}
            {template.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
