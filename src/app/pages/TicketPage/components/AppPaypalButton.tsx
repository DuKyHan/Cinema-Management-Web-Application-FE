import { Box, CircularProgress } from '@mui/material';
import {
  OnApproveActions,
  OnApproveData,
  OnCancelledActions,
} from '@paypal/paypal-js/types/components/buttons';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

export const AppPaypalButton = (props: {
  totalPrice: number;
  onApprove?: (data: OnApproveData, actions: OnApproveActions) => Promise<void>;
  onCancel?: (
    data: Record<string, unknown>,
    actions: OnCancelledActions,
  ) => void;
  onError?: (err: Record<string, unknown>) => void;
}) => {
  const { totalPrice, onApprove, onCancel, onError } = props;

  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <Box sx={{ my: 2 }}>
      {isPending ? <CircularProgress /> : null}
      <PayPalButtons
        style={{ layout: 'horizontal', tagline: false }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: `${Math.trunc(totalPrice / 24520)}`,
                  currency_code: 'USD',
                },
              },
            ],
          });
        }}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onError}
      />
    </Box>
  );
};
