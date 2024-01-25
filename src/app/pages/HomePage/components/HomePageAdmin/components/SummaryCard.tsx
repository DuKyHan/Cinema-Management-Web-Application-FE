import { Card, CardContent, LinearProgress, Typography } from '@mui/material';
import _ from 'lodash';
import { ThisMonthPreviousMonthOutputDto } from 'types/analytics';
import { numberCompactFormatter } from 'utils/general';

export const SummaryCard = (props: {
  title: string;
  thisMonthPreviousMonth?: ThisMonthPreviousMonthOutputDto | null;
}) => {
  const { title, thisMonthPreviousMonth } = props;

  if (thisMonthPreviousMonth == null) {
    return (
      <Card sx={{ width: 210, height: 120, m: 1 }} elevation={3}>
        <CardContent>
          <Typography color="text.secondary">{title}</Typography>
          <LinearProgress sx={{ mt: 4 }} />
        </CardContent>
      </Card>
    );
  }

  const diff =
    (thisMonthPreviousMonth.totalThisMonth -
      thisMonthPreviousMonth.totalPreviousMonth) /
    _.max([
      thisMonthPreviousMonth.totalPreviousMonth,
      thisMonthPreviousMonth.totalThisMonth,
    ])!;
  const color = diff > 0 ? 'green' : 'red';

  return (
    <Card sx={{ width: 210, height: 120, m: 1 }} elevation={3}>
      <CardContent>
        <Typography color="text.secondary">{title}</Typography>
        <Typography variant="h4" fontWeight={'bold'}>
          {numberCompactFormatter.format(thisMonthPreviousMonth.total)}
        </Typography>
        <Typography color={color}>
          {` ${diff > 0 ? '+' : ''}${numberCompactFormatter.format(
            diff,
          )}% previous month`}
        </Typography>
      </CardContent>
    </Card>
  );
};
