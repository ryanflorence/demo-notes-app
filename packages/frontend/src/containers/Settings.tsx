import config from "../config";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import {
  ClientActionFunctionArgs,
  ClientLoaderFunctionArgs,
  redirect,
  useFetcher,
} from "@remix-run/react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BillingForm, BillingFormType } from "../components/BillingForm";
import { requireAuth } from "../lib/authLib";
import "./Settings.css";

const stripePromise = loadStripe(config.STRIPE_KEY);

export async function clientLoader({ request }: ClientLoaderFunctionArgs) {
  return await requireAuth(request);
}

export async function clientAction({ request }: ClientActionFunctionArgs) {
  try {
    await API.post("notes", "/billing", {
      body: await request.json(),
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

  const handleFormSubmit: BillingFormType["onSubmit"] = async (
    storage,
    info,
  ) => {
    if (info.error) {
      onError(info.error);
      return;
    }
    fetcher.submit(
      { storage, source: info.token?.id || null },
      { method: "post", encType: "application/json" },
    );
  };

  return (
    <div className="Settings">
      <Elements
        stripe={stripePromise}
        options={{
          fonts: [
            {
              cssSrc:
                "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800",
            },
          ],
        }}
      >
        <BillingForm isLoading={!!fetcher.json} onSubmit={handleFormSubmit} />
      </Elements>
    </div>
  );
}
