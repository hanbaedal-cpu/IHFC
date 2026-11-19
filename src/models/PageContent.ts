import { Schema, models, model } from "mongoose";

const PageContentSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      enum: ["about", "facilities", "guide", "status", "location"],
    },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    body: { type: String, default: "" },
    extraJson: { type: String, default: "" },
  },
  { timestamps: true }
);

export const PageContent =
  models.PageContent || model("PageContent", PageContentSchema);

const defaults: Record<string, { title: string; subtitle: string; body: string }> = {
  about: {
    title: "공공의료기관의 신뢰로 정직하고 투명하게 모십니다",
    subtitle: "장례식장 안내",
    body: "근로복지공단 인천병원 장례식장은 합리적인 요금과 투명한 운영을 원칙으로 합니다. 유가족께서 오직 고인을 추모하는 일에만 마음을 쓰실 수 있도록 모든 절차를 세심하게 돕겠습니다.",
  },
  facilities: {
    title: "시설안내",
    subtitle: "빈소 4실과 편의시설",
    body: "빈소 4실과 입관실·안치실·샤워실·유족 휴게실·조리실을 갖추어 장례 전 과정을 한 곳에서 모십니다.",
  },
  guide: {
    title: "이용안내",
    subtitle: "임종부터 발인까지",
    body: "임종부터 발인까지, 처음 겪는 일이라도 순서대로 안내해 드립니다.",
  },
  status: {
    title: "빈소현황",
    subtitle: "실시간 안내",
    body: "빈소현황은 실시간으로 변경될 수 있으니 방문 전 전화로 확인해 주세요.",
  },
  location: {
    title: "오시는 길",
    subtitle: "인천 부평",
    body: "인천광역시 부평구 구산동에 위치한 근로복지공단 인천병원 장례식장입니다. 지하철·버스·자가용 모두 편리하게 이용하실 수 있습니다.",
  },
};

export async function getPageContent(key: keyof typeof defaults) {
  const existing = await PageContent.findOne({ key });
  if (existing) return existing;
  return PageContent.create({ key, ...defaults[key] });
}
