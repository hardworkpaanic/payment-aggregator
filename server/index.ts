// server.ts
import express, {
  type Request,
  type Response,
  type NextFunction,
  type Express,
} from "express";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 8080;

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.use(express.json());

app.use(cors()); // Разрешите все CORS-запросы

// Это типы для данных, которые мы ожидаем
interface PaymentDetails {
  cardNumber: string;
  amount: number;
  currency: string;
  providerName: string;
}

interface PaymentRequest {
  amount: number;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
}

// Функция для сохранения данных в Redis
async function savePaymentToRedis(
  paymentDetails: PaymentDetails
): Promise<string> {
  const paymentId = uuidv4();
  const key = `payment:${paymentId}`;

  // Сохраняем на 15 минут (900 секунд)
  await redis.setex(key, 900, JSON.stringify(paymentDetails));

  return paymentId;
}

// Функция для получения данных из Redis
async function getPaymentFromRedis(
  paymentId: string
): Promise<PaymentDetails | null> {
  const key = `payment:${paymentId}`;
  const data = await redis.get(key);

  if (data) {
    return JSON.parse(data) as PaymentDetails;
  }

  return null;
}

// Имитация запроса к одному платежному сервису
async function queryPaymentProvider(
  providerName: string,
  amount: number
): Promise<PaymentDetails | null> {
  console.log(`Запрос к провайдеру: ${providerName}`);

  // Имитация разного времени ответа и успешного/неуспешного исхода
  const mockDelay = Math.random() * 1000 + 500; // От 0.5 до 1.5 секунды
  await new Promise((resolve) => setTimeout(resolve, mockDelay));

  // Для примера, 5-й провайдер всегда "успешен", остальные часто "неудачны"
  if (providerName === "Provider_5") {
    return {
      cardNumber: "2200 1234 5678 9000", // Пример номера карты
      amount: amount,
      currency: "RUB",
      providerName: providerName,
    };
  }

  // Имитация случая, когда у провайдера нет доступных реквизитов
  if (Math.random() > 0.3) {
    // 70% вероятность отказа
    return null;
  }

  // Имитация успешного ответа от другого провайдера
  return {
    cardNumber: `2200 ${Math.floor(Math.random() * 10000)} ${Math.floor(
      Math.random() * 10000
    )} ${Math.floor(Math.random() * 10000)}`,
    amount: amount,
    currency: "RUB",
    providerName: providerName,
  };
}

// Основной обработчик для получения реквизитов
app.post(
  "/api/get-payment-details",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount }: PaymentRequest = req.body;

      if (!amount || amount <= 0) {
        res
          .status(400)
          .json({ error: "Неверная или отсутствующая сумма платежа" });
        return;
      }

      const providers = [
        "Provider_1",
        "Provider_2",
        "Provider_3",
        "Provider_4",
        "Provider_5",
        "Provider_6",
        "Provider_7",
        "Provider_8",
        "Provider_9",
        "Provider_10",
      ];

      let paymentDetails: PaymentDetails | null = null;

      // Последовательно опрашиваем провайдеров
      for (const provider of providers) {
        const result = await queryPaymentProvider(provider, amount);
        if (result) {
          paymentDetails = result;
          console.log(`Нашли реквизиты у провайдера: ${provider}`);
          break; // Прерываем цикл, как только нашли реквизиты
        }
      }

      if (paymentDetails) {
        // Сохраняем данные в Redis и получаем UUID
        const paymentId = await savePaymentToRedis(paymentDetails);

        const response: PaymentResponse = {
          success: true,
          paymentUrl: `http://localhost:5173/?paymentId=${paymentId}`,
        };

        res.status(200).json(response);
      } else {
        res.status(404).json({
          success: false,
          message: "Не удалось найти доступные реквизиты для оплаты",
        });
      }
    } catch (error: unknown) {
      next(new Error((error as Error).message));
    }
  }
);

// Новый обработчик для получения данных по UUID
app.get(
  "/api/payment/:paymentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentId } = req.params;

      if (!paymentId) {
        res.status(400).json({ error: "Неверный или отсутствующий paymentId" });
        return;
      }

      const paymentDetails = await getPaymentFromRedis(paymentId);

      if (paymentDetails) {
        res.status(200).json({
          success: true,
          message: "Данные платежа найдены",
          data: paymentDetails,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Данные платежа не найдены или истекли",
        });
      }
    } catch (error: unknown) {
      next(new Error((error as Error).message));
    }
  }
);

// Обработчик для подтверждения оплаты (обновленный)
app.post(
  "/api/confirm-payment",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentId } = req.body;

      if (!paymentId) {
        res.status(400).json({ error: "Неверный или отсутствующий paymentId" });
        return;
      }

      // Получаем данные из Redis
      const paymentDetails = await getPaymentFromRedis(paymentId);

      if (!paymentDetails) {
        res.status(404).json({
          success: false,
          message: "Данные платежа не найдены или истекли",
        });
        return;
      }

      // Здесь будет логика обработки подтверждения оплаты от пользователя
      // Например, проверка транзакции у провайдера, обновление статуса в БД и т.д.
      console.log("Пользователь подтвердил оплату", {
        paymentId,
        paymentDetails,
      });

      // Удаляем данные из Redis после подтверждения (опционально)
      await redis.del(`payment:${paymentId}`);

      res.status(200).json({
        success: true,
        message: "Оплата подтверждена и обрабатывается",
        data: paymentDetails,
      });
    } catch (error: unknown) {
      next(new Error((error as Error).message));
    }
  }
);

// Обработчик для отмены (обновленный)
app.post(
  "/api/cancel-payment",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { paymentId } = req.body;

      if (!paymentId) {
        res.status(400).json({ error: "Неверный или отсутствующий paymentId" });
        return;
      }

      // Логика отмены платежа
      console.log("Пользователь отменил платеж", { paymentId });

      // Удаляем данные из Redis при отмене
      await redis.del(`payment:${paymentId}`);

      res.status(200).json({
        success: true,
        message: "Платеж отменен",
      });
    } catch (error: unknown) {
      next(new Error((error as Error).message));
    }
  }
);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing Redis connection...");
  await redis.quit();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Closing Redis connection...");
  await redis.quit();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
