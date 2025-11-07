export interface IPaymentData {
  cardNumber: string;
  amount: number;
  currency: "RUB";
  providerName: string;
}

export interface IGetPaymentResponse {
  success: boolean;
  message: string;
  data: IPaymentData;
}
