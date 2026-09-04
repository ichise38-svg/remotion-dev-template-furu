import { Composition } from "remotion";
import { FurusatoComparisonReel } from "./FurusatoComparisonReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="FurusatoComparisonReel"
        component={FurusatoComparisonReel}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
