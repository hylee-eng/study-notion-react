"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import OfficeMap from "./OfficeMap";
import { filterOffices, type OfficePlace } from "@/lib/sharedOfficeModel";

/**
 * 공유 오피스 둘러보기: 지역 고르기 → 편의시설로 거르기 → 지도와 주소 목록.
 *
 * 전국 목록은 서버에서 한 번 받아 오고, 고르고 거르는 일은 브라우저에서 바로 합니다.
 * 버튼을 누를 때마다 서버에 다시 묻지 않으니 반응이 빠릅니다.
 */

const DEFAULT_SIDO = "서울특별시";
const DEFAULT_SIGUNGU = "강남구";
const PAGE_SIZE = 8;

/** 직장인이 공간을 고를 때 자주 따지는 편의시설만 거르기 버튼으로 둡니다 */
const FILTER_AMENITIES = ["24시 운영", "주차", "샤워실", "공용 주방", "개인 락커", "택배 발송"];

function countBy<T>(items: T[], key: (t: T) => string) {
  const m = new Map<string, number>();
  for (const it of items) m.set(key(it), (m.get(key(it)) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function won(fee: number | null, unit: string) {
  if (fee === null) return "요금 문의";
  return `${unit ? unit + " " : ""}${fee.toLocaleString("ko-KR")}원`;
}

/** 카드 안에 바로 보여줄 상품 수와 편의시설 수. 나머지는 개수만 알려줍니다 */
const LISTING_PREVIEW = 3;
const AMENITY_PREVIEW = 8;

/** 거르기로 고른 편의시설을 맨 앞으로. 나머지는 원래 순서(자주 따지는 것부터)를 지킵니다 */
function sortAmenities(list: readonly string[], picked: string[]) {
  return [...list.filter((a) => picked.includes(a)), ...list.filter((a) => !picked.includes(a))];
}

export default function SharedOfficeExplorer({ offices }: { offices: OfficePlace[] }) {
  const [sido, setSido] = useState(DEFAULT_SIDO);
  const [sigungu, setSigungu] = useState(DEFAULT_SIGUNGU);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE_SIZE);

  const sidoList = useMemo(() => countBy(offices, (o) => o.sido), [offices]);
  const inSido = useMemo(() => offices.filter((o) => o.sido === sido), [offices, sido]);
  const sigunguList = useMemo(() => countBy(inSido, (o) => o.sigungu), [inSido]);
  const list = useMemo(
    () => filterOffices(offices, { sido, sigungu: sigungu || undefined, amenities }),
    [offices, sido, sigungu, amenities],
  );

  const mapBox = useRef<HTMLDivElement>(null);
  const onSelect = useCallback((id: string) => setActiveId(id), []);

  /** 목록에서 고르면 지도로 이동합니다. 휴대폰에서는 지도가 목록 위에 있어 화면을 끌어올립니다 */
  function showOnMap(id: string) {
    setActiveId(id);
    mapBox.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function pickSido(next: string) {
    setSido(next);
    setSigungu("");
    setActiveId(null);
    setShown(PAGE_SIZE);
  }
  function pickSigungu(next: string) {
    setSigungu(next);
    setActiveId(null);
    setShown(PAGE_SIZE);
  }
  function toggleAmenity(a: string) {
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
    setActiveId(null);
    setShown(PAGE_SIZE);
  }

  const csvParams = new URLSearchParams({ format: "csv", sido });
  if (sigungu) csvParams.set("sigungu", sigungu);
  amenities.forEach((a) => csvParams.append("amenity", a));

  const place = sigungu ? `${sido} ${sigungu}` : sido;

  return (
    <div className="so mt-8">
      {/* 지역 고르기 */}
      <div className="so-controls">
        <label className="so-field">
          <span className="t-cap text-muted">시도</span>
          <select className="so-select" value={sido} onChange={(e) => pickSido(e.target.value)}>
            {sidoList.map(([name, n]) => (
              <option key={name} value={name}>
                {name} ({n})
              </option>
            ))}
          </select>
        </label>
        <label className="so-field">
          <span className="t-cap text-muted">시군구</span>
          <select className="so-select" value={sigungu} onChange={(e) => pickSigungu(e.target.value)}>
            <option value="">전체 ({inSido.length})</option>
            {sigunguList.map(([name, n]) => (
              <option key={name} value={name}>
                {name} ({n})
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* 편의시설로 거르기 */}
      <div className="so-chips" role="group" aria-label="편의시설로 거르기">
        {FILTER_AMENITIES.map((a) => (
          <button
            key={a}
            type="button"
            className="so-chip"
            aria-pressed={amenities.includes(a)}
            onClick={() => toggleAmenity(a)}
          >
            {amenities.includes(a) ? "✓ " : ""}
            {a}
          </button>
        ))}
      </div>

      <div className="so-summary">
        <p className="t-body text-ink">
          <strong>{place}</strong> 공유 오피스 <strong>{list.length}곳</strong>
          {amenities.length > 0 && <span className="text-muted"> · {amenities.join(", ")} 있는 곳</span>}
        </p>
        <a href={`/api/shared-offices?${csvParams}`} className="btn btn-secondary btn-sm" download>
          이 목록 CSV 받기
        </a>
      </div>

      <div className="so-body">
        <div ref={mapBox} className="so-map-box">
          <OfficeMap offices={list} activeId={activeId} onSelect={onSelect} />
        </div>

        <div className="so-list">
          {list.length === 0 && (
            <p className="t-body text-muted so-none">조건에 맞는 곳이 없습니다. 편의시설 거르기를 줄여 보세요.</p>
          )}
          {list.slice(0, shown).map((o) => (
            <article key={o.id} className={o.id === activeId ? "so-card so-card-on" : "so-card"}>
              <h3 className="t-card-title text-ink">{o.name}</h3>
              <p className="t-body text-bodytext so-addr">{o.address}</p>

              <dl className="so-meta">
                <div>
                  <dt>요금</dt>
                  <dd>{o.feeFrom ? `${won(o.feeFrom.fee, o.feeFrom.unit)}부터` : "요금 문의"}</dd>
                </div>
                <div>
                  <dt>상품</dt>
                  <dd>{o.listings.length}개</dd>
                </div>
                {o.hours && (
                  <div>
                    <dt>운영</dt>
                    <dd>{o.hours}</dd>
                  </div>
                )}
              </dl>

              {o.listings.length > 1 && (
                <ul className="so-listings">
                  {o.listings.slice(0, LISTING_PREVIEW).map((l, i) => (
                    <li key={i}>
                      <span className="so-l-name">{l.name}</span>
                      <span className="so-l-fee">{won(l.fee, l.feeUnit)}</span>
                    </li>
                  ))}
                  {o.listings.length > LISTING_PREVIEW && (
                    <li className="so-l-more">외 {o.listings.length - LISTING_PREVIEW}개 상품</li>
                  )}
                </ul>
              )}

              <ul className="so-amen" aria-label="편의시설 (상품에 따라 다를 수 있음)">
                {sortAmenities(o.amenities, amenities)
                  .slice(0, AMENITY_PREVIEW)
                  .map((a) => (
                    <li key={a} className={amenities.includes(a) ? "so-amen-on" : undefined}>
                      {a}
                    </li>
                  ))}
                {o.amenities.length > AMENITY_PREVIEW && (
                  <li className="so-amen-more">외 {o.amenities.length - AMENITY_PREVIEW}개</li>
                )}
              </ul>

              <div className="so-actions">
                <button type="button" className="so-link" onClick={() => showOnMap(o.id)}>
                  지도에서 보기
                </button>
                <a
                  className="so-link"
                  href={`https://map.kakao.com/link/search/${encodeURIComponent(o.address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  카카오맵 &rarr;
                </a>
              </div>
            </article>
          ))}

          {shown < list.length && (
            <button type="button" className="btn btn-secondary so-more" onClick={() => setShown((n) => n + PAGE_SIZE)}>
              더 보기 ({list.length - shown}곳 남음)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
