import { Box, Button, Tooltip, Typography } from '@mui/material';
import {
  DateCalendar,
  LocalizationProvider,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useAuth } from 'app/context/AuthContext';
import { AppRoute } from 'app/routes';
import { getTickets } from 'app/services/ticket';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, TicketSort } from 'types/ticket';
import { CalendarNotification } from './CalendarNotification';

const CalendarDay = (
  props: PickersDayProps<Dayjs> & { tickets?: Ticket[] },
) => {
  const { tickets = [], day, outsideCurrentMonth, ...other } = props;

  const ticket = tickets.find(
    t => dayjs(t.premiere).date() === props.day.date(),
  );
  const isSelected = !props.outsideCurrentMonth && ticket != null;

  if (!ticket)
    return (
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        selected={false}
      />
    );

  return (
    <Tooltip
      title={
        <>
          <Typography sx={{ fontWeight: 'bold' }}>
            {ticket.film!.name}
          </Typography>
          <Typography>Cinema: {ticket.cinema!.name}</Typography>
        </>
      }
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        selected={isSelected}
      />
    </Tooltip>
  );
};

export const EventCalendar = () => {
  const { accessToken, account } = useAuth();
  const navigate = useNavigate();

  const [thisWeekTickets, setThisWeekTickets] = useState<Ticket[]>([]);

  const [isViewingTicketsLoading, setIsViewingTicketsLoading] = useState(true);
  const [viewingTickets, setViewingTickets] = useState<Ticket[]>([]);
  const [viewDate, setViewDate] = useState(dayjs());

  useEffect(() => {
    if (accessToken == null) return;
    getTickets({
      //accountId: account!.id,
      startPremiereDate: dayjs().startOf('day').toDate(),
      endPremiereDate: dayjs().add(1, 'week').toDate(),
      sort: TicketSort.PremiereDateAsc,
    }).then(res => {
      setThisWeekTickets(res.data.data);
    });
  }, [accessToken, account]);

  useEffect(() => {
    if (accessToken == null) return;
    setIsViewingTicketsLoading(true);
    getTickets({
      //accountId: account!.id,
      startPremiereDate: viewDate.startOf('month').toDate(),
      endPremiereDate: viewDate.endOf('month').toDate(),
      sort: TicketSort.PremiereDateAsc,
    })
      .then(res => {
        setViewingTickets(res.data.data);
      })
      .finally(() => {
        setIsViewingTicketsLoading(false);
      });
  }, [accessToken, account, viewDate]);

  if (!accessToken) return <></>;

  const notificationTicket = thisWeekTickets[0];

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          my: 1,
        }}
      >
        <Typography variant={'h5'} sx={{ my: 1, fontWeight: 'bold' }}>
          Event calendar
        </Typography>
        <Button
          onClick={() => {
            navigate(AppRoute.TicketList);
          }}
        >
          See tickets
        </Button>
      </Box>
      {notificationTicket ? (
        <CalendarNotification ticket={notificationTicket} />
      ) : null}

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          loading={isViewingTicketsLoading}
          onChange={value => {
            if (value == null) return;
            setViewDate(value);
          }}
          onMonthChange={value => {
            if (value == null) return;
            setViewDate(value);
            console.log(value);
          }}
          onYearChange={value => {
            if (value == null) return;
            setViewDate(value);
          }}
          readOnly
          slots={{
            day: CalendarDay,
          }}
          slotProps={{
            day: {
              tickets: viewingTickets,
            } as any,
          }}
          sx={{ my: 2, backgroundColor: '#EEE8F4', borderRadius: 4 }}
        />
      </LocalizationProvider>
    </Box>
  );
};
