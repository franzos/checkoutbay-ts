import { Button, NumberInput } from "@mantine/core";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js/pure";
import { RedirectToCheckoutClientOptions } from "@stripe/stripe-js";
import { Currency, DepositProvider, NewDepositHttp } from "@gofranz/common";
import { useRustyState } from "../../state";
import { STRIPE_PUBLIC_KEY } from "../../constants";

export interface NewDepositFormProps {
  onCancelCb: () => void;
}

export function NewDepositForm({ onCancelCb }: NewDepositFormProps) {
  const { api } = useRustyState.getState();
  const [isBusy, setIsBusy] = useState(false);
  const [amount, setAmount] = useState(15);

  const openStripe = async (sessionId: string, options?: RedirectToCheckoutClientOptions) => {
    if (!STRIPE_PUBLIC_KEY) {
      throw new Error('Stripe public key is not set');
    }
    const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
    if (!stripe) {
      throw new Error('Failed to load Stripe');
    }

    await stripe.redirectToCheckout({
      sessionId,
      ...options,
    });
  };

  const startDeposit = async () => {
    setIsBusy(true);
    try {
      const newDeposit: NewDepositHttp = {
        amount,
        currency: Currency.EUR,
        provider: DepositProvider.STRIPE,
      };
      const res = await api.newDeposit(newDeposit);
      if (!res) {
        throw new Error('Failed to start deposit: Could not get Stripe checkout session.');
      }
      openStripe(res.checkout_session_id);
    } catch (e) {
      console.error(e);
    }
    setIsBusy(false);
  };

  return (
    <>
      <NumberInput
        prefix="€"
        maw={300}
        mb="xs"
        allowNegative={false}
        allowLeadingZeros={false}
        allowDecimal={false}
        value={amount}
        onChange={(e) => setAmount(e as number)}
      />
      <Button loading={isBusy} onClick={startDeposit}>
        Pay with Stripe
      </Button>
      <Button ml="sm" variant="light" onClick={onCancelCb}>
        Cancel
      </Button>
    </>
  );
}
