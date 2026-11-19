import { Schema, models, model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "main" },
    siteName: { type: String, default: "근로복지공단 인천병원 장례식장" },
    phone: { type: String, default: "032-500-0444" },
    hospitalPhone: { type: String, default: "032-500-0114" },
    address: {
      type: String,
      default: "인천광역시 부평구 무네미로 446 근로복지공단 인천병원 (구산동 47-3)",
    },
    heroEyebrow: { type: String, default: "마지막 순간까지 정성을 다합니다" },
    heroTitle: {
      type: String,
      default: "깊은 슬픔 곁에 따뜻한 위로가 되겠습니다",
    },
    heroSubtitle: {
      type: String,
      default:
        "유가족의 마음을 먼저 헤아리며, 장례의 모든 절차를 품격 있고 정성스럽게 함께하겠습니다.",
    },
    notice: {
      type: String,
      default: "근로복지공단 인천병원 장례식장은 24시간 상담 및 고인 이송을 지원합니다.",
    },
    aboutTitle: {
      type: String,
      default: "공공의료기관의 신뢰로 정직하고 투명하게 모십니다",
    },
    aboutBody: {
      type: String,
      default:
        "근로복지공단 인천병원 장례식장은 합리적인 요금과 투명한 운영을 원칙으로 합니다. 유가족께서 오직 고인을 추모하는 일에만 마음을 쓰실 수 있도록 모든 절차를 세심하게 돕겠습니다.",
    },
    facebookUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    naverBlogUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", SiteSettingsSchema);

export async function getSiteSettings() {
  const existing = await SiteSettings.findOne({ key: "main" });
  if (existing) return existing;
  return SiteSettings.create({ key: "main" });
}
