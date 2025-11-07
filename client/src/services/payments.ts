import type { IGetPaymentResponse } from "@/types/payments";

class PaymentApi {
  API_URL = "http://localhost:8080/api";

  async getPayment(id: string) {
    try {
      const res = await fetch(`${this.API_URL}/payment/${id}`);
      const data = (await res.json()) as IGetPaymentResponse;

      return data.data;
    } catch (err) {
      console.log(err);
    }
  }
}

export const paymentApi = new PaymentApi();
