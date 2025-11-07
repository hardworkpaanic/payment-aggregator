import { paymentApi } from "@/services/payments";
import type { IPaymentData } from "@/types/payments";
import { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function usePayments() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentData, setPaymentData] = useState<IPaymentData>();
  const location = useLocation();

  useLayoutEffect(() => {
    const fetchPayment = async () => {
      setIsLoading(true);

      try {
        const searchParams = new URLSearchParams(location.search);
        const paymentId = searchParams.get("paymentId");

        if (paymentId) {
          const payment = await paymentApi.getPayment(paymentId);
          setPaymentData(payment);
        }
      } catch (error) {
        console.error("Ошибка при загрузке платежа:", error);
        // Можно также установить состояние ошибки
        // setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [location.search]);

  return {
    isLoading,
    paymentData,
  };
}
