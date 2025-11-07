import { BanknoteArrowUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { InputWithCopyButton } from "./InputWithCopyButton";
import { Button } from "../ui/button";
import usePayments from "@/hooks/usePayment";

export default function PaymentCard() {
  const { paymentData, isLoading } = usePayments();

  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  return (
    <Card className="w-[400px]">
      <CardHeader>
        <BanknoteArrowUp color="purple" />
        <CardTitle className="text-[18px]">
          Оплатите сумму на реквезиты ниже
        </CardTitle>
        <CardDescription>
          Отправте деньги напрямую, после оплаты счёт автоматически пополнится
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <InputWithCopyButton
          label="Номер карты"
          value={paymentData?.cardNumber as string}
        />
        <InputWithCopyButton
          label="Сумма"
          value={String(paymentData?.amount)}
        />
      </CardContent>

      <CardFooter className="flex gap-2 ">
        <Button>Я оплатил</Button>
        <Button variant={"outline"}>Отмена</Button>
      </CardFooter>
    </Card>
  );
}
