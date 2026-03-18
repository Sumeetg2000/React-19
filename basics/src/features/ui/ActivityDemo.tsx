import { useState, Suspense } from "react";
import { Activity } from "react";

// Simulates async loading
function createSlowComponent(label: string) {
  let loaded = false;

  return function Slow() {
    if (!loaded) {
      throw new Promise<void>((res) => {
        setTimeout(() => {
          loaded = true;
          res();
        }, 1500);
      });
    }

    return <div className="p-4 border">{label} Loaded</div>;
  };
}

const SlowA = createSlowComponent("Without Activity");
const SlowB = createSlowComponent("With Activity");

export default function ActivityDemo() {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Activity vs Normal Suspense</h2>

      <button onClick={() => setShow((s) => !s)} className="border px-3 py-1">
        Toggle Async Load
      </button>

      <div className="grid grid-cols-2 gap-6">
        {/* WITHOUT Activity */}
        <div>
          <h3 className="font-medium">Without Activity</h3>

          <Suspense fallback={<p>Loading...</p>}>{show && <SlowA />}</Suspense>
        </div>

        {/* WITH Activity */}
        <div>
          <h3 className="font-medium">With Activity (mode="visible")</h3>

          <Suspense fallback={<p>Loading...</p>}>
            <Activity mode="visible">{show && <SlowB />}</Activity>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
