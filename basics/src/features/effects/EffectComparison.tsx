import { useEffect, useLayoutEffect, useState, useRef } from "react";
import DemoSection from "../../components/DemoSection";
import ComparePanel from "../../components/ComparePanel";

function EffectBox() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current!.style.transform = "translateX(100px)";
  }, []);

  return <div ref={ref} className="w-20 h-20 bg-blue-400" />;
}

function LayoutBox() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    ref.current!.style.transform = "translateX(100px)";
  }, []);

  return <div ref={ref} className="w-20 h-20 bg-green-400" />;
}

export default function EffectComparison() {
  const [show, setShow] = useState(false);

  return (
    <DemoSection title="useEffect vs useLayoutEffect">
      <button className="px-3 py-1 bg-blue-500 text-white rounded pointer" onClick={() => setShow((s) => !s)}>Toggle</button>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <ComparePanel title="useEffect">
          {show && <EffectBox />}
        </ComparePanel>

        <ComparePanel title="useLayoutEffect">
          {show && <LayoutBox />}
        </ComparePanel>
      </div>
    </DemoSection>
  );
}