import { useState, useEffect, useEffectEvent } from "react";
import DemoSection from "../../components/DemoSection";
import ComparePanel from "../../components/ComparePanel";

export default function EffectEventDemo() {
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"no-cleanup" | "cleanup">("no-cleanup");

  const log = useEffectEvent(() => {
    console.log("Latest count:", count);
  });

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      log();
    }, 1000);

    // ❌ simulate missing cleanup
    if (mode === "no-cleanup") return;

    // ✅ correct cleanup
    return () => {
      clearInterval(id);
      console.log("Cleanup previous interval");
    };
  }, [running, mode]);

  return (
    <DemoSection
      title="Cleanup in useEffect"
      description="Prevents duplicate subscriptions / memory leaks"
    >
      <div className="space-y-4">
        {/* Controls */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCount((c) => c + 1)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Increment ({count})
          </button>

          <button
            onClick={() => setRunning((r) => !r)}
            className={`px-3 py-1 text-white rounded ${
              running ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {running ? "Stop" : "Start"}
          </button>

          <button
            onClick={() =>
              setMode((m) =>
                m === "cleanup" ? "no-cleanup" : "cleanup"
              )
            }
            className="px-3 py-1 bg-gray-800 text-white rounded"
          >
            Mode: {mode}
          </button>
        </div>

        {/* Explanation */}
        <div className="text-xs text-gray-500">
          Toggle mode and restart interval → observe console behavior
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ComparePanel title="Without Cleanup" color="gray">
            <p className="text-xs">
              Multiple intervals stack → logs multiply
            </p>
          </ComparePanel>

          <ComparePanel title="With Cleanup" color="green">
            <p className="text-xs">
              Old interval removed → single stable log
            </p>
          </ComparePanel>
        </div>
      </div>
    </DemoSection>
  );
}