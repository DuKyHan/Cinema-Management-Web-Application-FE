import { Button } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';

export class NavItemProps {
  constructor(
    public name: string,
    public icon?: JSX.Element,
    public onClick?: (navigate: NavigateFunction) => void,
  ) {}
}

export const NavItem = (props: NavItemProps) => {
  const navigate = useNavigate();
  const { name, icon, onClick } = props;

  return (
    <Button
      onClick={onClick ? () => onClick(navigate) : undefined}
      startIcon={icon}
      sx={{
        my: 2,
        mx: 1,
        color: '#002D6E',
        display: 'line',
        textTransform: 'none',
        fontWeight: '600',
      }}
    >
      {name}
    </Button>
  );
};
