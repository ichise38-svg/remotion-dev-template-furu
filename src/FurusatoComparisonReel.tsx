import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/NotoSansJP';

const { fontFamily: jpFontFamily } = loadFont();

// ============================================================
// 「ふるさと納税 9月まで vs 10月から」比較表リール
// 尺: 12秒 / 360フレーム / 30fps / 1080x1920
// 背景: マゼンタ(#FF00FF) クロマキー方式(通信費見直しリールと同様)
// ナレーションなし・テロップのみで完結
// 構成(Sequenceで明確に分離):
//   Scene1 比較表シーン  0〜210f (7秒) … フック+比較表画像(マゼンタ背景)
//   Scene2 CTAシーン   210〜360f (5秒) … まとめ画像+SVG保存推奨ボタン(ネイビー背景)
// ============================================================

// SaveIcon(絵文字はLinuxレンダリング環境で文字化けするためSVGアイコンを使用)
const SaveIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 38,
  color = '#FFFFFF',
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M5 3h11l3 3v15l-7-4-7 4V3z"
      fill={color}
      stroke={color}
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
  </svg>
);

// ------------------------------------------------------------
// Scene1: 比較表シーン(フック + 比較表画像)
// ------------------------------------------------------------
const TableScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // フック(タイトル) 0〜25f
  const titleEnter = spring({ frame, fps, config: { damping: 14 } });
  const titleScale = interpolate(titleEnter, [0, 1], [0.8, 1]);
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const titleShrink = interpolate(frame, [15, 30], [1, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 比較表(画像) 20〜45f
  const tableEnter = spring({
    frame: frame - 20,
    fps,
    config: { damping: 16, mass: 0.6 },
  });
  const tableScale = interpolate(tableEnter, [0, 1], [0.9, 1]);
  const tableOpacity = interpolate(tableEnter, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#FF00FF' }}>
      <AbsoluteFill
        style={{
          padding: '44px 24px 30px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* フック / タイトル */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `scale(${titleScale * titleShrink})`,
            transformOrigin: 'top center',
            textAlign: 'center',
            marginBottom: 20,
          }}
        >
          <div
            style={{
              color: '#FFFFFF',
              fontFamily: jpFontFamily,
              fontWeight: 900,
              fontSize: 70,
              lineHeight: 1.15,
              textShadow: '0 4px 10px rgba(0,0,0,0.7)',
            }}
          >
            ふるさと納税
          </div>
          <div
            style={{
              color: '#FFE566',
              fontFamily: jpFontFamily,
              fontWeight: 900,
              fontSize: 46,
              marginTop: 6,
              textShadow: '0 4px 10px rgba(0,0,0,0.7)',
            }}
          >
            9月中にやらないと損するかも
          </div>
        </div>

        {/* 比較表(画像) */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${tableScale})`,
            opacity: tableOpacity,
          }}
        >
          <Img
            src={staticFile(
              'themes/sample-theme/images/furusato-comparison-table.png'
            )}
            style={{
              width: '100%',
              borderRadius: 16,
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// Scene2: CTAシーン(まとめ画像 + SVG保存推奨ボタン)
// 比較表シーンとは背景トーンを変えて区別する(ネイビー単色背景)
// ------------------------------------------------------------
const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // シーン全体のフェードイン 0〜15f
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // まとめ画像 5〜35f
  const imageEnter = spring({
    frame: frame - 5,
    fps,
    config: { damping: 16, mass: 0.6 },
  });
  const imageScale = interpolate(imageEnter, [0, 1], [0.9, 1]);
  const imageOpacity = interpolate(imageEnter, [0, 1], [0, 1]);

  // 保存推奨ボタン(SVG) 60〜85f
  const ctaEnter = spring({
    frame: frame - 60,
    fps,
    config: { damping: 16 },
  });
  const ctaOpacity = interpolate(ctaEnter, [0, 1], [0, 1]);
  const ctaY = interpolate(ctaEnter, [0, 1], [30, 0]);
  const ctaPulse = interpolate(
    Math.sin((frame - 60) / 10),
    [-1, 1],
    [1, 1.04],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0B1B3D',
        opacity: sceneOpacity,
      }}
    >
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '50px 40px 40px',
        }}
      >
        {/* まとめ画像 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${imageScale})`,
            opacity: imageOpacity,
          }}
        >
          <Img
            src={staticFile("themes/sample-theme/images/furusato-summary.png")}
            style={{
              width: "100%",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              scale: 0.774,
            }}
          />
        </div>

        {/* 保存推奨ボタン(SVG) */}
        <div
          style={{
            opacity: ctaOpacity,
            transform: `translateY(${ctaY}px) scale(${ctaPulse})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            backgroundColor: '#FFE566',
            borderRadius: 999,
            padding: '20px 40px',
            marginTop: 20,
          }}
        >
          <SaveIcon size={42} color="#0B1B3D" />
          <span
            style={{
              color: '#0B1B3D',
              fontFamily: jpFontFamily,
              fontWeight: 900,
              fontSize: 38,
            }}
          >
            今のうちに保存推奨
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------
// メインコンポーネント: Sequenceで2シーンを結合
// ------------------------------------------------------------
export const FurusatoComparisonReel: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={210}>
        <TableScene />
      </Sequence>
      <Sequence from={210} durationInFrames={150}>
        <CtaScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export default FurusatoComparisonReel;

// ------------------------------------------------------------
// Root.tsx側で登録する場合の例(既存プロジェクトに合わせて調整):
//
// import { Composition } from 'remotion';
// import { FurusatoComparisonReel } from './FurusatoComparisonReel';
//
// <Composition
//   id="FurusatoComparisonReel"
//   component={FurusatoComparisonReel}
//   durationInFrames={360}
//   fps={30}
//   width={1080}
//   height={1920}
// />
// ------------------------------------------------------------
