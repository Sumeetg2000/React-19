import { useState, useDeferredValue, useMemo } from "react";
import { heavyCompute } from "../../shared/utils/heavyCompute";
import DemoSection from "../../components/DemoSection";
import ComparePanel from "../../components/ComparePanel";
import DemoInput from "../../components/DemoInput";

export default function DeferredOnly() {
  const [input, setInput] = useState("");
  const deferred = useDeferredValue(input);

  const list = useMemo(() => heavyCompute(deferred), [deferred]);

  return (
    <DemoSection
      title="useDeferredValue"
      description="Keeps UI responsive by lagging value"
    >
      <div className="space-y-4">
        <DemoInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <ComparePanel title="Result" color="green">
          <p className="text-xs">
            Immediate: {input} | Deferred: {deferred}
          </p>
          {list.slice(0, 5).map((i) => (
            <div key={i}>{i}</div>
          ))}
        </ComparePanel>
      </div>
    </DemoSection>
  );
}