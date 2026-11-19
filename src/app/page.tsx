import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { Room } from "@/models/Room";
import { maskName } from "@/lib/utils";
import { formatKstDate, formatKstMonthDayTime } from "@/lib/time";
import { FACILITIES, GUIDE_STEPS } from "@/lib/site-content";
import { PublicShell } from "@/components/home/PublicShell";
import { ConsultationForm } from "@/components/home/ConsultationForm";
import { FacilityGallery } from "@/components/home/FacilityGallery";
import { SiteFooter } from "@/components/home/SiteFooter";

export const dynamic = "force-dynamic";

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
      <PublicShell settings={settings}>
        <section className="hero">
          <div className="container hero-layout">
            <div className="hero-copy-block">
              <div className="eyebrow">{settings.heroEyebrow}</div>
              <h1>{settings.heroTitle}</h1>
              <p className="hero-copy">{settings.heroSubtitle}</p>
              <div className="hero-cta">
                <Link className="btn btn-primary" href="/status">
                  빈소 현황 확인 →
                </Link>
                <a className="btn btn-ghost" href={`tel:${tel}`}>
                  {phone}
                </a>
              </div>
              <div className="hero-points">
                <span>⏱ 24시간 연중무휴</span>
                <span>🚗 고인 이송 지원</span>
                <span>♥ 전문 장례지도사 상담</span>
              </div>
            </div>
            <ConsultationForm phone={phone} variant="hero" />
          </div>
        </section>

        <section className="section" id="about">
          <div className="container" style={{ textAlign: "center", maxWidth: 900 }}>
            <div className="section-label">ABOUT US</div>
            <h2>{settings.aboutTitle}</h2>
            <p className="section-lead" style={{ marginInline: "auto" }}>
              {settings.aboutBody}
            </p>
            <div className="stats" style={{ textAlign: "left" }}>
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
            <Link className="btn btn-ghost" href="/about" style={{ marginTop: "1.2rem" }}>
              장례식장 안내
            </Link>
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
            <FacilityGallery facilities={FACILITIES} />
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
              {GUIDE_STEPS.map((step) => (
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

        <section className="section" id="status" style={{ background: "#fff" }}>
          <div className="container">
            <div className="section-label">MEMORIAL STATUS</div>
            <h2>빈소현황</h2>
            <p className="section-lead">{formatKstDate(new Date())} 기준 (한국시간)</p>
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
                        {room.farewellAt ? formatKstMonthDayTime(room.farewellAt) : "-"}
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
            <Link className="btn btn-ghost" href="/status">
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
                  <Link className="btn btn-ghost" href="/location">
                    문의하기
                  </Link>
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

        <SiteFooter
          siteName={settings.siteName}
          address={settings.address}
          phone={settings.phone}
        />
      </PublicShell>
    </main>
  );
}
