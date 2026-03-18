import { useRef, useImperativeHandle } from "react";
import DemoSection from "../../components/DemoSection";

type API = { focus: () => void };

function Input({ ref }: { ref?: React.Ref<API> }) {
  const inner = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inner.current?.focus(),
  }));

  return <input ref={inner} className="border px-2 py-1" />;
}

export default function ImperativeHandleDemo() {
  const ref = useRef<API>(null);

  return (
    <DemoSection
      title="useImperativeHandle"
      description="Expose custom methods to parent"
    >
      <Input ref={ref} />

      <button
        onClick={() => ref.current?.focus()}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
      >
        Focus Input
      </button>
    </DemoSection>
  );
}