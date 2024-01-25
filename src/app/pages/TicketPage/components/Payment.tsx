import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { CinemaFilm } from 'types/cinema-film';
import { CinemaFilmPremiere } from 'types/cinema-film-premiere';
import { alphabetNumberFromRowColumn } from 'utils/general';
import { SeatData } from '..';
import { AppPaypalButton } from './AppPaypalButton';
import { FilmInfo } from './FilmInfo';
import { FoodData } from './FoodSelector';

export const Payment = (props: {
  cinemaFilm: CinemaFilm;
  cinemaFilmPremiere: CinemaFilmPremiere;
  selectedSeat?: SeatData | null;
  foodDatum: FoodData[];
  onPaymentSuccess?: () => void;
}) => {
  const {
    cinemaFilm,
    cinemaFilmPremiere,
    selectedSeat,
    foodDatum,
    onPaymentSuccess,
  } = props;

  const { showDialog } = useGlobalDialogContext();

  if (selectedSeat == null) {
    return <></>;
  }

  const rows = [
    {
      item: `Seat ${alphabetNumberFromRowColumn(
        selectedSeat.seat.row,
        selectedSeat.seat.column,
      )}`,
      quantity: 1,
      price: selectedSeat.cinemaFilmSeat.price,
    },
    ...foodDatum.map(food => ({
      item: food.food.name,
      price: food.quantity * food.food.price,
      quantity: food.quantity,
    })),
  ];
  const foodPrice = foodDatum.reduce(
    (acc, food) => acc + food.quantity * food.food.price,
    0,
  );
  const totalPrice = rows.reduce((acc, row) => acc + row.price, 0);

  return (
    <Stack direction={'row'} gap={6} justifyContent="center" mt={6}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price (VND)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.item}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.item}
                </TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <FilmInfo
        cinemaFilm={props.cinemaFilm}
        cinemaFilmPremiere={props.cinemaFilmPremiere}
        seat={selectedSeat}
        trailingElement={
          <>
            <Typography fontWeight={'bold'}>
              Food price: {foodPrice} VND
            </Typography>
            <Typography fontWeight={'bold'}>
              Total price: {foodPrice + selectedSeat!.cinemaFilmSeat.price} VND
            </Typography>
            <PayPalScriptProvider
              options={{
                clientId:
                  'AdhLPz-qEE7jufi47b1e5Pcc38CAeOgeWQ0LPHEd8bTO8PyhIs8AtAoDqVmaMLW25luDaZS4P9Z0112J',
                components: 'buttons',
                currency: 'USD',
                buyerCountry: 'VN',
              }}
            >
              <AppPaypalButton
                totalPrice={totalPrice}
                onApprove={async (data, actions) => {
                  console.log(data);
                  actions.order?.capture().then(details => {
                    // showDialog({
                    //   title: 'Payment success',
                    //   description: 'Your payment is successful',
                    // });
                    onPaymentSuccess?.();
                  });
                }}
              />
            </PayPalScriptProvider>
          </>
        }
      />
    </Stack>
  );
};
