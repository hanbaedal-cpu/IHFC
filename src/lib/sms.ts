import { SolapiMessageService } from "solapi";
import { connectDB } from "@/lib/mongodb";
import { SmsLog } from "@/models/SmsLog";
import { normalizePhone } from "@/lib/utils";

export type SmsSendInput = {
  to: string[];
  text: string;
  sentBy: string;
  consultationIds?: string[];
};

export async function sendSms({ to, text, sentBy, consultationIds = [] }: SmsSendInput) {
  const uniqueRecipients = Array.from(
    new Set(to.map(normalizePhone).filter((p) => p.length >= 10))
  );

  if (!uniqueRecipients.length) {
    throw new Error("유효한 수신번호가 없습니다.");
  }
  if (!text.trim()) {
    throw new Error("메시지 내용을 입력해 주세요.");
  }

  const apiKey = process.env.SOLAPI_API_KEY;
  const apiSecret = process.env.SOLAPI_API_SECRET;
  const sender = process.env.SOLAPI_SENDER || "0325000444";
  const mockMode = !apiKey || !apiSecret;

  let status: "sent" | "failed" | "mocked" = "mocked";
  let providerMessage = "모의 발송(SOLAPI 키 미설정)";
  let successCount = 0;

  if (!mockMode) {
    try {
      const service = new SolapiMessageService(apiKey!, apiSecret!);
      await service.send(
        uniqueRecipients.map((phone) => ({
          to: phone,
          from: sender,
          text,
        }))
      );
      successCount = uniqueRecipients.length;
      status = "sent";
      providerMessage = "Solapi 발송 완료";
    } catch (error) {
      status = "failed";
      providerMessage = error instanceof Error ? error.message : "발송 실패";
      throw error;
    }
  } else {
    successCount = uniqueRecipients.length;
  }

  await connectDB();
  const log = await SmsLog.create({
    recipients: uniqueRecipients,
    text,
    sentBy,
    consultationIds,
    status,
    providerMessage,
    successCount,
  });

  return {
    mockMode,
    status,
    successCount,
    total: uniqueRecipients.length,
    logId: String(log._id),
    providerMessage,
  };
}
