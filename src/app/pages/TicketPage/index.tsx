import { Check, Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import { AppRoute } from 'app/routes';
import { getCinemaFilmById } from 'app/services/cinema-film';
import { createTicket } from 'app/services/ticket';
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CinemaFilm, cinemaFilmIncludes } from 'types/cinema-film';
import { CinemaFilmSeat } from 'types/cinema-film-seat';
import { Seat } from 'types/seat';
import { FoodData, FoodSelector } from './components/FoodSelector';
import { Payment } from './components/Payment';
import { SeatSelector } from './components/SeatSelector';

const steps = ['Choose your seat', 'Foods and beverages', 'Payment'];
export class SeatData {
  cinemaFilmSeat: CinemaFilmSeat;
  seat: Seat;
}

export const TicketPage = () => {
  const { cinemaFilmId, premiereId } = useParams();
  const navigate = useNavigate();

  const [isCinemaFilmLoading, setIsCinemaFilmLoading] = useState(true);
  const [cinemaFilm, setCinemaFilm] = useState<CinemaFilm | null>(null);

  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(null);
  const [foodData, setFoodData] = useState<FoodData[]>([]);

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

  useEffect(() => {
    if (cinemaFilmId != null) {
      getCinemaFilmById(cinemaFilmId, {
        includes: cinemaFilmIncludes,
      }).then(res => {
        setCinemaFilm(res.data.data);
        setIsCinemaFilmLoading(false);
      });
    } else {
      setIsCinemaFilmLoading(false);
    }
  }, [cinemaFilmId]);

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (isCinemaFilmLoading) {
    return <Loading />;
  }

  if (cinemaFilm == null || premiereId == null) {
    return <Navigate to={AppRoute.NotFound} />;
  }

  const cinemaFilmPremiere = cinemaFilm.premieres!.find(
    p => p.id === parseInt(premiereId),
  );

  const components = [
    {
      element: (
        <SeatSelector
          cinemaFilm={cinemaFilm}
          cinemaFilmPremiere={cinemaFilmPremiere!}
          purchasedSeats={cinemaFilm.purchasedSeats!}
          selectedSeat={selectedSeat}
          setSelectedSeat={setSelectedSeat}
        />
      ),
      canNext: () => {
        return selectedSeat != null;
      },
      showNext: true,
      showBack: false,
    },
    {
      element: (
        <FoodSelector
          cinemaFilm={cinemaFilm}
          cinemaFilmPremiere={cinemaFilmPremiere!}
          selectedSeat={selectedSeat}
          defaultFoodData={foodData}
          onFoodDataChange={setFoodData}
        />
      ),
      canNext: () => {
        return true;
      },
      showNext: true,
      showBack: true,
    },
    {
      element: (
        <Payment
          cinemaFilm={cinemaFilm}
          cinemaFilmPremiere={cinemaFilmPremiere!}
          selectedSeat={selectedSeat}
          foodDatum={foodData}
          onPaymentSuccess={() => {
            createTicket({
              premiereId: cinemaFilmPremiere!.id,
              seatId: selectedSeat!.cinemaFilmSeat.seatId,
              foodBeverages: foodData.map(f => ({
                id: f.food.id,
                quantity: f.quantity,
              })),
            })
              .then(res => {
                setPaymentSuccessful(true);
              })
              .finally(() => {
                setActiveStep(prevActiveStep => prevActiveStep + 1);
              });
          }}
        />
      ),
      canNext: () => {
        return true;
      },
      showNext: false,
      showBack: true,
      handleNext: () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
      },
    },
  ];

  const currentPage = components[activeStep];

  return (
    <>
      <Typography variant={'h4'}>Ticket</Typography>
      <Typography variant={'h6'}>Choose your screen and seat</Typography>
      <Stepper activeStep={activeStep} sx={{ my: 2 }}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <>
          <Stack justifyContent={'center'} alignItems="center" sx={{ my: 4 }}>
            <Box
              sx={{
                display: 'flex',
                borderRadius: '50%',
                border: 1,
                height: '50px',
                width: '50px',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: paymentSuccessful ? 'success.main' : 'error.main',
                color: 'white',
                mb: 2,
              }}
            >
              {paymentSuccessful ? (
                <Check fontSize="large" />
              ) : (
                <Close fontSize="large" />
              )}
            </Box>
            <Typography variant="h5">
              {paymentSuccessful
                ? 'Thank you for your payment!'
                : 'Payment failed'}
            </Typography>
            <Stack direction="row" sx={{ my: 4 }} gap={2}>
              <Button
                onClick={() => {
                  navigate(AppRoute.Home);
                }}
              >
                Back to Home
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  navigate(AppRoute.TicketList);
                }}
              >
                Tickets
              </Button>
            </Stack>
          </Stack>
        </>
      ) : (
        <>
          {currentPage.element}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            {currentPage.showBack ? (
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
            ) : null}
            <Box sx={{ flex: '1 1 auto' }} />
            {currentPage.showNext ? (
              <Button
                variant="contained"
                disabled={!currentPage.canNext()}
                onClick={currentPage.handleNext ?? handleNext}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            ) : null}
          </Box>
        </>
      )}
    </>
  );
};
