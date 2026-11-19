import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { Room } from "@/models/Room";
import { maskName } from "@/lib/utils";
import { SiteHeader } from "@/components/home/SiteHeader";
import { ConsultationForm } from "@/components/home/ConsultationForm";

export const dynamic = "force-dynamic";

const facilities = [
  { name: "101호(특실)", size: "약 330㎡ (100평)", desc: "넓은 접객실과 독립 휴게실을 갖춘 프리미엄 빈소" },
  { name: "102호(일반실)", size: "약 165㎡ (50평)", desc: "유가족이 편안히 머무를 수 있는 단정한 빈소" },
  { name: "201호(VIP)", size: "약 330㎡ (100평)", desc: "독립 출입구와 전용 유족실을 갖춘 최상급 빈소" },
  { name: "202호(특실)", size: "약 200㎡ (60평)", desc: "채광이 좋은 접객실과 샤워실을 갖춘 특실 빈소" },
  { name: "입관실", size: "유가족 참관 가능", desc: "고인을 정성으로 씻기고 관에 모시는 정갈한 전용실" },
  { name: "안치실", size: "위생 냉장시설 완비", desc: "고인을 정중히 모시는 청결한 안치 전용 공간" },
  { name: "샤워실", size: "24시간 이용 가능", desc: "장례 기간 동안 씻고 정돈할 수 있는 위생 공간" },
  { name: "유족 휴게실", size: "빈소별 독립 공간", desc: "긴 장례 기간 편히 쉬실 수 있도록 마련한 전용 휴게실" },
  { name: "조리실", size: "유족 전용 조리 공간", desc: "조문객을 맞이할 음식을 준비할 수 있는 조리실" },
];

const steps = [
  {
    meta: "01 · 사전 상담",
    title: "장례식장 방문 및 사전 상담",
    items: [
      "전문 장례지도사와 장례 절차 전반에 대한 사전 상담을 진행합니다.",
      "빈소 규모와 조문객 예상 인원을 확인한 뒤 이용 가능한 빈소를 배정합니다.",
      "24시간 상담이 가능하며, 임종 전에도 미리 상담을 받아두실 수 있습니다.",
    ],
  },
  {
    meta: "02 · 사망 당일 · 1일차",
    title: "임종 및 고인 안치",
    items: [
      "의사로부터 사망진단서를 발급받습니다. 화장 예약과 사망신고를 위해 넉넉히 준비해 주세요.",
      "전용 운구차량으로 고인을 장례식장으로 모시고 안치실에 정중히 안치합니다.",
      "상주와 유가족은 장례지도사와 상의하여 장례 일정, 빈소, 상복, 도우미 등을 결정합니다.",
    ],
  },
  {
    meta: "03 · 2일차",
    title: "빈소 설치 및 입관",
    items: [
      "종교와 유가족의 예법에 맞추어 제단과 영정을 설치하고 빈소를 차립니다.",
      "부고를 알리고 상주·유가족이 상복을 갖춘 뒤 조문객을 맞이합니다.",
      "발인 전날에는 염습과 입관을 진행하며, 유가족이 참관하실 수 있습니다.",
    ],
  },
  {
    meta: "04 · 3일차",
    title: "발인 및 장지 이동",
    items: [
      "발인제를 지낸 뒤 영구를 운구차량에 모시고 장지로 출발합니다.",
      "발인제가 끝나면 영구를 장지 또는 화장시설까지 운반하는 절차가 이어집니다.",
      "장례지도사의 안내에 따라 순차적으로 진행하시면 됩니다.",
    ],
  },
  {
    meta: "05 · 장례 이후",
    title: "하관 · 화장 · 봉안",
    items: [
      "매장을 선택하신 경우 장지에서 영구를 광중에 내리는 하관(下棺)을 진행합니다.",
      "화장을 선택하신 경우 화장시설 방문 전 화장 예약을 먼저 확인해 주세요.",
      "화장 후에는 유골을 모셔 봉안당, 자연장 등 원하시는 방식으로 안치합니다.",
    ],
  },
];

export default async function HomePage() {
  await connectDB();
  const settings = await getSiteSettings();
  const rooms = await Room.find({ status: { $in: ["preparing", "active"] } })
    .sort({ startAt: 1 })
    .lean();

  const phone = settings.phone || "032-500-0444";
  const tel = phone.replace(/\D/g, "");

  return (
    <main id="top">
      <div className="top-banner">{settings.notice}</div>
      <SiteHeader siteName={settings.siteName} />

      <section className="hero">
        <div className="container hero-inner">
          <div className="eyebrow">{settings.heroEyebrow}</div>
          <h1>{settings.heroTitle}</h1>
          <p className="hero-copy">{settings.heroSubtitle}</p>
          <div className="hero-cta">
            <a className="btn btn-primary" href="#rooms">
              빈소 현황 확인 →
            </a>
            <a className="btn btn-ghost" href={`tel:${tel}`}>
              {phone}
            </a>
          </div>
          <div className="hero-points">
            <span>24시간 연중무휴</span>
            <span>고인 이송 지원</span>
            <span>전문 장례지도사 상담</span>
          </div>
        </div>
      </section>

      <ConsultationForm />

      <section className="section" id="about">
        <div className="container">
          <div className="section-label">ABOUT US</div>
          <h2>{settings.aboutTitle}</h2>
          <p className="section-lead">{settings.aboutBody}</p>
          <div className="stats">
            <div className="stat">
              <strong>24h</strong>
              <span>상담·이송</span>
            </div>
            <div className="stat">
              <strong>4</strong>
              <span>빈소 운영</span>
            </div>
            <div className="stat">
              <strong>100%</strong>
              <span>요금 공개</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="facilities" style={{ background: "#fff" }}>
        <div className="container">
          <div className="section-label">FACILITIES</div>
          <h2>시설안내</h2>
          <p className="section-lead">
            빈소 4실과 입관실·안치실·샤워실·유족 휴게실·조리실을 갖추어 장례 전 과정을 한 곳에서
            모십니다.
          </p>
          <div className="facility-grid">
            {facilities.map((item) => (
              <article key={item.name} className="facility-card">
                <div className="thumb">{item.size}</div>
                <div className="body">
                  <h3>{item.name}</h3>
                  <p>{item.desc}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="guide">
        <div className="container">
          <div className="section-label">GUIDE</div>
          <h2>이용안내</h2>
          <p className="section-lead">
            임종부터 발인까지, 처음 겪는 일이라도 순서대로 안내해 드립니다.
          </p>
          <div className="steps">
            {steps.map((step) => (
              <article key={step.title} className="step-card">
                <div className="meta">{step.meta}</div>
                <h3 style={{ margin: 0 }}>{step.title}</h3>
                <ul>
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div className="panel" style={{ marginTop: "1.5rem", textAlign: "center" }}>
            <p style={{ marginTop: 0 }}>장례 절차와 빈소 이용이 궁금하실 때</p>
            <h3 style={{ marginTop: 0 }}>24시간 전문 장례지도사가 안내해 드립니다</h3>
            <a className="btn btn-primary" href={`tel:${tel}`}>
              {phone}
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="rooms" style={{ background: "#fff" }}>
        <div className="container">
          <div className="section-label">MEMORIAL STATUS</div>
          <h2>빈소현황</h2>
          <p className="section-lead">
            {format(new Date(), "yyyy년 M월 d일", { locale: ko })} 기준
          </p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>빈소</th>
                  <th>고인</th>
                  <th>상주</th>
                  <th>발인일시</th>
                  <th>장지</th>
                  <th>추모글</th>
                </tr>
              </thead>
              <tbody>
                {rooms.length === 0 && (
                  <tr>
                    <td colSpan={6}>현재 안내 중인 빈소가 없습니다.</td>
                  </tr>
                )}
                {rooms.map((room) => (
                  <tr key={String(room._id)}>
                    <td>{room.roomName}</td>
                    <td>故 {maskName(room.deceasedName)}</td>
                    <td>상주 {maskName(room.hostName)}</td>
                    <td>
                      {room.farewellAt
                        ? format(new Date(room.farewellAt), "M월 d일 HH:mm", { locale: ko })
                        : "-"}
                    </td>
                    <td>{room.burialPlace || "-"}</td>
                    <td>
                      {room.allowPublicMemorial ? (
                        <Link href={`/rooms/${String(room._id)}/memorial`}>남기기</Link>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            빈소현황은 실시간으로 변경될 수 있으니 방문 전 전화로 확인해 주세요.
          </p>
          <Link className="btn btn-ghost" href="/rooms">
            전체 빈소·추모글 보기
          </Link>
        </div>
      </section>

      <section className="section" id="location">
        <div className="container">
          <div className="section-label">LOCATION</div>
          <h2>오시는 길</h2>
          <p className="section-lead">
            인천광역시 부평구 구산동에 위치한 근로복지공단 인천병원 장례식장입니다. 지하철·버스·자가용
            모두 편리하게 이용하실 수 있습니다.
          </p>
          <div className="location-grid">
            <div className="info-card">
              <div className="section-label">ADDRESS</div>
              <h3 style={{ marginTop: 0 }}>{settings.siteName}</h3>
              <p>{settings.address}</p>
              <p>
                장례식장 {settings.phone}
                <br />
                병원 대표전화 {settings.hospitalPhone}
              </p>
              <div className="inline-actions">
                <a className="btn btn-primary" href={`tel:${tel}`}>
                  전화 연결
                </a>
                <a className="btn btn-ghost" href="#top">
                  문의하기
                </a>
              </div>
            </div>
            <div className="info-card">
              <h3 style={{ marginTop: 0 }}>교통 안내</h3>
              <p>
                <strong>지하철</strong>
                <br />
                인천 1호선 갈산역 하차 → 병원 방면 버스 환승
                <br />
                7호선 송내역 남부광장 하차 → 시내버스 또는 병원 순환버스
              </p>
              <p>
                <strong>버스</strong>
                <br />
                시내버스 8 · 11 · 16-1 · 20 · 30번 / 좌석버스 103 · 103-1번
                <br />
                「근로복지공단인천병원(장수초등학교)」 정류장 하차
              </p>
              <p>
                <strong>주차</strong>
                <br />
                병원 내 주차장 약 400대 규모 · 조문객 주차는 안내데스크 문의
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <strong>{settings.siteName}</strong>
          <p>
            {settings.address} · 대표전화 {settings.phone}
          </p>
          <p style={{ opacity: 0.75, fontSize: "0.9rem" }}>
            © {new Date().getFullYear()} KCOMWEL Incheon Hospital Funeral Center.
          </p>
        </div>
      </footer>

      <div className="floating-call">
        <a href={`tel:${tel}`}>24시간 상담 {phone}</a>
        <Link href="/guest/login">유가족 추모글</Link>
      </div>
    </main>
  );
}
