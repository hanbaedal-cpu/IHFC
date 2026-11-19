import { connectDB } from "@/lib/mongodb";
import { requireSupervisor } from "@/lib/auth";
import { VisitLog } from "@/models/VisitLog";
import { Consultation } from "@/models/Consultation";
import { Room } from "@/models/Room";
import { Memorial } from "@/models/Memorial";
import { ThankYou } from "@/models/ThankYou";
import { Popup } from "@/models/Popup";
import { Gallery } from "@/models/Gallery";
import { PageContent } from "@/models/PageContent";
import { SiteSettings } from "@/models/SiteSettings";
import { SmsLog } from "@/models/SmsLog";
import { User } from "@/models/User";
import { jsonError } from "@/lib/utils";

export async function GET() {
  const supervisor = await requireSupervisor();
  if (!supervisor) return jsonError("슈퍼바이저만 조회할 수 있습니다.", 401);

  await connectDB();
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [
    visitsByType,
    recentVisits,
    dbCounts,
    smsStats,
    smsRecent,
  ] = await Promise.all([
    VisitLog.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: "$visitorType", count: { $sum: 1 } } },
    ]),
    VisitLog.countDocuments({ createdAt: { $gte: since } }),
    Promise.all([
      Consultation.countDocuments(),
      Room.countDocuments(),
      Memorial.countDocuments(),
      ThankYou.countDocuments(),
      Popup.countDocuments(),
      Gallery.countDocuments(),
      PageContent.countDocuments(),
      SiteSettings.countDocuments(),
      SmsLog.countDocuments(),
      User.countDocuments(),
      VisitLog.countDocuments(),
    ]),
    SmsLog.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          successCount: { $sum: "$successCount" },
        },
      },
    ]),
    SmsLog.find().sort({ createdAt: -1 }).limit(20).lean(),
  ]);

  const visitMap = Object.fromEntries(
    visitsByType.map((row: { _id: string; count: number }) => [row._id, row.count])
  );

  const [
    consultations,
    rooms,
    memorials,
    thankYous,
    popups,
    gallery,
    pages,
    settings,
    smsLogs,
    users,
    visits,
  ] = dbCounts;

  return Response.json({
    visits: {
      last30Days: recentVisits,
      guest: visitMap.guest || 0,
      host: visitMap.host || 0,
      admin: visitMap.admin || 0,
      anonymous: visitMap.anonymous || 0,
    },
    database: {
      consultations,
      rooms,
      memorials,
      thankYous,
      popups,
      gallery,
      pages,
      settings,
      smsLogs,
      users,
      visits,
      total:
        consultations +
        rooms +
        memorials +
        thankYous +
        popups +
        gallery +
        pages +
        settings +
        smsLogs +
        users +
        visits,
    },
    solapi: {
      byStatus: smsStats,
      recent: smsRecent,
    },
  });
}
