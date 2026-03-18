import { Suspense, use } from "react";
import DemoSection from "../../components/DemoSection";

const promise = new Promise<string>((res) =>
  setTimeout(() => res("Loaded data"), 1500)
);

function Content() {
  const data = use(promise);
  return <div>{data}</div>;
}

export default function UseAsync() {
  return (
    <DemoSection title="use()" description="Suspends rendering until data is ready">
      <Suspense fallback={<p>Loading...</p>}>
        <Content />
      </Suspense>
    </DemoSection>
  );
}