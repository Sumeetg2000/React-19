import { useState, useTransition } from "react";
import { heavyCompute } from "../../shared/utils/heavyCompute";
import DemoSection from "../../components/DemoSection";
import ComparePanel from "../../components/ComparePanel";
import DemoInput from "../../components/DemoInput";

export default function TransitionOnly() {
  const [input, setInput] = useState("");

  const [list, setList] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  return (
    <DemoSection
      title="useTransition"
      description="Prevents UI blocking for heavy updates"
    >
      <div className="space-y-4">
        <DemoInput
          placeholder="Type fast..."
          value={input}
          onChange={(e) => {
            const val = e.target.value;
            setInput(val);

            startTransition(() => {
              setList(heavyCompute(val));
            });
          }}
        />

        <ComparePanel title="Result" color="blue">
          {pending && <p className="text-xs">Updating...</p>}
          {list.slice(0, 5).map((i) => (
            <div key={i}>{i}</div>
          ))}
        </ComparePanel>
      </div>
    </DemoSection>
  );
}