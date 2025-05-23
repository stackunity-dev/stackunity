import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

let paypalClient: checkoutNodeJssdk.core.PayPalHttpClient | null = null;

export async function getPayPalClient(): Promise<checkoutNodeJssdk.core.PayPalHttpClient> {
  if (paypalClient) {
    return paypalClient;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  const environment = new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)

  paypalClient = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
  return paypalClient;
}

export async function getOrder(orderId: string) {
  const client = await getPayPalClient();
  const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);
  const order = await client.execute(request);
  return order.result;
}

export async function capturePayment(orderId: string) {
  const client = await getPayPalClient();
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.prefer("return=representation");
  const capture = await client.execute(request);
  return capture.result;
}

export async function authorizePayment(orderId: string) {
  const client = await getPayPalClient();
  const request = new checkoutNodeJssdk.orders.OrdersAuthorizeRequest(orderId);
  request.prefer("return=representation");
  const authorization = await client.execute(request);
  return authorization.result;
} 