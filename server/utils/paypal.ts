import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

let paypalClient: checkoutNodeJssdk.core.PayPalHttpClient | null = null;

export async function getPayPalClient(): Promise<checkoutNodeJssdk.core.PayPalHttpClient> {
  if (paypalClient) {
    return paypalClient;
  }

  const clientId = 'ASBf0oA-RI0eCLn5QRyo9GHGLe9KgfdfrkAHT6SAqk0m8AWPzVvIUbbxazk4fjZfGEiWVnucG9dtHMLf';
  const clientSecret = 'ED3O7Bl9MU-pBGtVv9QI2Zmv_YH93wSPNkpZMtDDBFIZba5DBozM7kp5NXdVaNju7Xx_7RoQayRTQCWr';

  const environment = process.env.NODE_ENV === 'production'
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);

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