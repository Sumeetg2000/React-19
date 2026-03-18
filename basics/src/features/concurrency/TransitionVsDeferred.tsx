import {
  useState,
  useTransition,
  useDeferredValue,
  useMemo,
} from "react";
import { heavyCompute } from "../../shared/utils/heavyCompute";
import ComparePanel from "../../components/ComparePanel";
import DemoInput from "../../components/DemoInput";
import DemoSection from "../../components/DemoSection";

export default function TransitionVsDeferred() {
  const [input, setInput] = useState("");

  const [list, setList] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();

  const deferred = useDeferredValue(input);

  const deferredList = useMemo(() => {
    return heavyCompute(deferred);
  }, [deferred]);

  return (
    <DemoSection
      title="useTransition vs useDeferredValue"
      description="Same input → different rendering strategies"
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

        <div className="grid grid-cols-2 gap-4">
          <ComparePanel title="useTransition" color="blue">
            {pending && (
              <p className="text-xs text-blue-600">Updating...</p>
            )}
            {list.slice(0, 5).map((i) => (
              <div key={i}>{i}</div>
            ))}
          </ComparePanel>

          <ComparePanel title="useDeferredValue" color="green">
            <p className="text-xs">
              Immediate: {input} | Deferred: {deferred}
            </p>
            {deferredList.slice(0, 5).map((i) => (
              <div key={i}>{i}</div>
            ))}
          </ComparePanel>
        </div>
      </div>
    </DemoSection>
  );
}