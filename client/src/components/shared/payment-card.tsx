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

export default function PaymentCard() {
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
        <InputWithCopyButton label="Номер карты" value="2200 3230 2323 9387" />
        <InputWithCopyButton label="Сумма" value="2,200₽" />
      </CardContent>

      <CardFooter className="flex gap-2 ">
        <Button>Я оплатил</Button>
        <Button variant={"outline"}>Отмена</Button>
      </CardFooter>
    </Card>
  );
}
