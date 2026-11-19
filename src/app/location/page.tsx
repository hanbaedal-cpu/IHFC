import { connectDB } from "@/lib/mongodb";
import { getSiteSettings } from "@/models/SiteSettings";
import { getPageContent } from "@/models/PageContent";
import { PublicShell } from "@/components/home/PublicShell";
import { SiteFooter } from "@/components/home/SiteFooter";

export const dynamic = "force-dynamic";

export default async function LocationPage() {
  await connectDB();
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageContent("location"),
  ]);
  const phone = settings.phone || "032-500-0444";
  const tel = phone.replace(/\D/g, "");

  return (
    <main>
      <PublicShell settings={settings} activePath="/location">
        <section className="section">
          <div className="container">
            <div className="section-label">LOCATION</div>
            <h1 style={{ fontFamily: "var(--font-display), serif", color: "var(--green-900)" }}>
              {page.title}
            </h1>
            <p className="section-lead">{page.body}</p>
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
                  <a className="btn btn-ghost" href="/">
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
        <SiteFooter
          siteName={settings.siteName}
          address={settings.address}
          phone={settings.phone}
        />
      </PublicShell>
    </main>
  );
}
