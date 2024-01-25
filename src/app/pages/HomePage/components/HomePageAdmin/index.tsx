import {
  NewspaperOutlined,
  ReportProblemOutlined,
  TheatersOutlined,
} from '@mui/icons-material';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { LineChart } from '@mui/x-charts';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useCurrentProfile } from 'app/context/ProfileContext';
import { AppRoute } from 'app/routes';
import {
  getAccountSummary,
  getCinemaFilmSummary,
  getProfit,
  getProfitSummary,
  getTicketSummary,
} from 'app/services/analytics';
import { countCinema } from 'app/services/cinema';
import { countNews } from 'app/services/news';
import { countReports } from 'app/services/report';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { DatePickerElement, FormContainer } from 'react-hook-form-mui';
import {
  ProfitOutputDto,
  ThisMonthPreviousMonthOutputDto,
} from 'types/analytics';
import { CinemaStatus } from 'types/cinema';
import { NewsStatus } from 'types/news';
import { ReportStatus } from 'types/report';
import { numberCompactFormatter } from 'utils/general';
import { getProfileDisplayNameOrDefault } from 'utils/profile';
import { AnalyticsCard } from './components/AnalyticsCard';
import { SummaryCard } from './components/SummaryCard';

class CountData {
  totalCinema: number | null;
  totalPendingCinema: number | null;
  totalNews: number | null;
  totalPendingNews: number | null;
  totalReport: number | null;
  totalPendingReport: number | null;
}

export const HomePageAdmin = () => {
  const { currentProfile } = useCurrentProfile();
  const [countData, setCountData] = useState<CountData>(new CountData());

  const { showDialog } = useGlobalDialogContext();

  const [isLoadingProfit, setIsLoadingProfit] = useState<boolean>(true);
  const [profitData, setProfitData] = useState<ProfitOutputDto[]>([]);
  const [startTime, setStartTime] = useState<Date>(
    dayjs().subtract(1, 'month').toDate(),
  );
  const [endTime, setEndTime] = useState<Date>(new Date());

  const [ticketSummary, setTicketSummary] =
    useState<ThisMonthPreviousMonthOutputDto | null>(null);
  const [ticketSummaryLoading, setTicketSummaryLoading] =
    useState<boolean>(true);
  const [accountSummary, setAccountSummary] =
    useState<ThisMonthPreviousMonthOutputDto | null>(null);
  const [accountSummaryLoading, setAccountSummaryLoading] =
    useState<boolean>(true);
  const [cinemaFilmSummary, setCinemaFilmSummary] =
    useState<ThisMonthPreviousMonthOutputDto | null>(null);
  const [cinemaSummaryLoading, setCinemaSummaryLoading] =
    useState<boolean>(true);
  const [revenueSummary, setRevenueSummary] =
    useState<ThisMonthPreviousMonthOutputDto | null>(null);
  const [revenueSummaryLoading, setRevenueSummaryLoading] =
    useState<boolean>(true);

  useEffect(() => {
    const cinemaCount = countCinema({ status: CinemaStatus.Pending });
    const reportCount = countReports({ status: [ReportStatus.Pending] });
    const newsCount = countNews({ status: NewsStatus.Pending });
    Promise.all([cinemaCount, reportCount, newsCount]).then(
      ([cinemaCount, reportCount, newsCount]) => {
        setCountData({
          totalCinema: cinemaCount.data.data.total,
          totalPendingCinema: cinemaCount.data.data.count,
          totalNews: newsCount.data.data.total,
          totalPendingNews: newsCount.data.data.count,
          totalReport: reportCount.data.data.total,
          totalPendingReport: reportCount.data.data.count,
        });
      },
    );

    getProfitSummary()
      .then(res => {
        setRevenueSummary(res.data.data);
      })
      .finally(() => {
        setRevenueSummaryLoading(false);
      });

    getTicketSummary()
      .then(res => {
        setTicketSummary(res.data.data);
      })
      .finally(() => {
        setTicketSummaryLoading(false);
      });

    getAccountSummary()
      .then(res => {
        console.log(res.data.data);
        setAccountSummary(res.data.data);
      })
      .finally(() => {
        setAccountSummaryLoading(false);
      });

    getCinemaFilmSummary()
      .then(res => {
        setCinemaFilmSummary(res.data.data);
      })
      .finally(() => {
        setCinemaSummaryLoading(false);
      });
  }, []);

  useEffect(() => {
    getProfit({
      startTime: startTime,
      endTime: endTime,
    })
      .then(res => {
        setProfitData(res.data.data);
      })
      .finally(() => {
        setIsLoadingProfit(false);
      });
  }, [startTime, endTime]);

  if (
    countData.totalCinema == null ||
    countData.totalPendingCinema == null ||
    countData.totalNews == null ||
    countData.totalPendingNews == null ||
    countData.totalReport == null ||
    countData.totalPendingReport == null ||
    isLoadingProfit
  ) {
    return <Loading />;
  }

  return (
    <>
      <Typography variant={'h4'} sx={{ my: 1 }}>
        Welcome {getProfileDisplayNameOrDefault(currentProfile, 'back')}
      </Typography>
      <Typography sx={{ fontSize: 22, my: 1, mb: 12 }}>
        {dayjs().format('dddd, DD MMMM YYYY')}
      </Typography>
      <Stack direction="row" spacing={12} justifyContent="center">
        <AnalyticsCard
          title="Total cinemas"
          value={countData.totalCinema}
          subtitle={`${countData.totalPendingCinema} need review`}
          icon={<TheatersOutlined />}
          iconBgColor="green"
          navigateTo={AppRoute.AdminCinemaList}
        />
        <AnalyticsCard
          title="Total news"
          value={countData.totalNews}
          subtitle={`${countData.totalPendingNews} need review`}
          icon={<NewspaperOutlined />}
          iconBgColor="blue"
          navigateTo={AppRoute.AdminNewsList}
        />
        <AnalyticsCard
          title="Total reports"
          value={countData.totalReport}
          subtitle={`${countData.totalPendingReport} need review`}
          icon={<ReportProblemOutlined />}
          iconBgColor="red"
          navigateTo={AppRoute.AdminReportList}
        />
      </Stack>

      <Typography variant={'h6'} sx={{ mt: 12, mb: 2 }} fontWeight="bold">
        Summary
      </Typography>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={8}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <FormContainer
              defaultValues={{
                startTime: dayjs().subtract(1, 'month'),
                endTime: dayjs(),
              }}
              onSuccess={data => {
                const st = data.startTime;
                const et = data.endTime;
                console.log(st.toDate(), et.toDate());
                console.log(et.isAfter(st));
                if (st && et && et.isBefore(st)) {
                  showDialog({
                    title: 'Error',
                    description: 'Start time must be before end time',
                  });
                  return;
                }
                setStartTime(data.startTime.toDate());
                setEndTime(data.endTime.toDate());
              }}
            >
              <Stack direction="row" alignItems={'center'}>
                <DatePickerElement
                  name="startTime"
                  label="Start time"
                  sx={{ mr: 2 }}
                  defaultValue={dayjs().subtract(1, 'month')}
                  format="DD/MM/YYYY"
                />
                <DatePickerElement
                  name="endTime"
                  label="End time"
                  sx={{ mr: 2 }}
                  defaultValue={dayjs()}
                  format="DD/MM/YYYY"
                />
                <Button type="submit" variant="contained">
                  Apply
                </Button>
              </Stack>
            </FormContainer>
          </LocalizationProvider>
          <LineChart
            xAxis={[
              {
                scaleType: 'point',
                data: profitData.map(p => dayjs(p.week).format('DD/MM/YYYY')),
                label: 'Revenue chart',
              },
            ]}
            series={[
              {
                curve: 'linear',
                data: profitData.map(p => p.profit),
              },
            ]}
            yAxis={[
              {
                scaleType: 'linear',
                valueFormatter: v => numberCompactFormatter.format(v),
              },
            ]}
            height={300}
          />
        </Grid>
        <Grid item xs={4}>
          <Stack direction={'row'}>
            <SummaryCard
              title="Tickets"
              thisMonthPreviousMonth={ticketSummary}
            />
            <SummaryCard
              title="Cinema films"
              thisMonthPreviousMonth={cinemaFilmSummary}
            />
          </Stack>
          <Stack direction={'row'}>
            <SummaryCard
              title="Accounts"
              thisMonthPreviousMonth={accountSummary}
            />
            <SummaryCard
              title="Revenue"
              thisMonthPreviousMonth={revenueSummary}
            />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};
