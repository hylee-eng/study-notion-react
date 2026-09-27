import UiFrame from "../UiFrame";
import { Mark } from "./Mark";

/**
 * 공유 오피스 STEP 3-② · 노션 지도 보기.
 * 핀은 실제 좌표를 이 상자 크기에 맞춰 옮겨 찍은 것이라, 라이브 데모 지도와 같은 모양으로 흩어집니다.
 */
export default function MapViewScreen({ points }: { points: { lat: number; lng: number }[] }) {
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const pos = (p: { lat: number; lng: number }) => ({
    left: `${8 + ((p.lng - minLng) / (maxLng - minLng || 1)) * 84}%`,
    top: `${8 + ((maxLat - p.lat) / (maxLat - minLat || 1)) * 80}%`,
  });

  return (
    <UiFrame path="내 업무 홈 / 강남 공유오피스">
      <div className="ui-views">
        <span className="ui-view">표</span>
        <span className="ui-view ui-view-on">지도</span>
        <span className="ui-view">＋</span>
        <span className="ui-tool push-right">
          레이아웃 · 지도 기준: 주소 <Mark n={3} />
        </span>
      </div>

      <div className="ui-mapbox" aria-hidden="true">
        {points.map((p, i) => (
          <span key={i} className="ui-pin" style={pos(p)} />
        ))}
      </div>
    </UiFrame>
  );
}
