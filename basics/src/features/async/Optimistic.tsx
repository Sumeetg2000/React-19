import { useState, useOptimistic } from "react";
import DemoSection from "../../components/DemoSection";
import ComparePanel from "../../components/ComparePanel";

export default function Optimistic() {
  const [server, setServer] = useState<string[]>([]);

  const [ui, add] = useOptimistic<string[], string>(
    server,
    (s, v) => [...s, v]
  );

  const handle = async () => {
    const val = "Item " + Date.now();
    add(val);

    await new Promise((r) => setTimeout(r, 1500));
    setServer((p) => [...p, val]);
  };

  return (
    <DemoSection
      title="useOptimistic"
      description="Instant UI before server response"
    >
      <button
        onClick={handle}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Add Item
      </button>

      <ComparePanel title="Items" color="blue">
        {ui.map((i) => (
          <div key={i}>{i}</div>
        ))}
      </ComparePanel>
    </DemoSection>
  );
}