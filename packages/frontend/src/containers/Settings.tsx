import { useEffect } from "react";
import config from "../config";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  redirect,
  useFetcher,
} from "react-router";
import { requireAuth } from "../lib/authLib";
import { loadStripe, StripeElements } from "@stripe/stripe-js";
import Form from "react-bootstrap/cjs/Form";
import Stack from "react-bootstrap/cjs/Stack";
import LoaderButton from "../components/LoaderButton";
import "./Settings.css";

let stripe: Awaited<ReturnType<typeof loadStripe>>;
let elements: StripeElements;

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  await requireAuth(request);

  stripe = await loadStripe(config.STRIPE_KEY);
  if (!stripe) throw new Error("Stripe failed to load");
  elements = stripe.elements({
    fonts: [{ cssSrc: "https://fonts.googleapis.com/css?family=Open+Sans" }],
  });

  return null;
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  if (!stripe || !elements) throw new Error("Stripe is not loaded");

  const storage = (await request.formData()).get("storage");
  const cardElement = elements.getElement("card");
  if (!cardElement) throw new Error("Card element not found");

  const { token, error } = await stripe.createToken(cardElement);
  if (error) {
    onError(error);
    return null;
  }

  try {
    await API.post("notes", "/billing", {
      body: { storage, source: token.id },
    });
    alert("Your card has been charged successfully!");
    return redirect("/");
  } catch (e) {
    onError(e);
    return null;
  }
}

export default function Settings() {
  const fetcher = useFetcher<typeof clientAction>();
  const isLoading = fetcher.state !== "idle";

  return (
    <div className="Settings">
      <fetcher.Form className="BillingForm" method="post">
        <Form.Group controlId="storage">
          <Form.Label>Storage</Form.Label>
          <Form.Control min="0" size="lg" type="number" name="storage" />
        </Form.Group>
        <hr />
        <Stack gap={3}>
          <Form.Group controlId="name">
            <Form.Label>Cardholder&apos;s name</Form.Label>
            <Form.Control
              size="lg"
              type="text"
              placeholder="Name on the card"
            />
          </Form.Group>
          <div>
            <Form.Label>Credit Card Info</Form.Label>
            <StripeCardField />
          </div>
          <LoaderButton size="lg" type="submit" isLoading={isLoading}>
            Purchase
          </LoaderButton>
        </Stack>
      </fetcher.Form>
    </div>
  );
}

function StripeCardField() {
  useEffect(() => {
    const card = elements.create("card", {
      style: {
        base: {
          fontSize: "16px",
          fontWeight: "400",
          color: "#495057",
          fontFamily: "'Open Sans', sans-serif",
        },
      },
    });
    card.mount("#card");
  }, []);

  return <div id="card" className="card-field" />;
}
