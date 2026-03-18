import { Fragment, useRef, useEffect } from "react";
import DemoSection from "../../components/DemoSection";

export default function FragmentRef() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    console.log("Fragment ref:", ref.current);
  }, []);

  return (
    <DemoSection
      title="Fragment Ref"
      description="React 19 allows ref on Fragment"
    >
      {/* @ts-expect-error Fragment ref not typed yet */}
      <Fragment ref={ref}>
        <div className="p-4 bg-blue-100">Child 1</div>
        <div className="p-4 bg-green-100">Child 2</div>
      </Fragment>
    </DemoSection>
  );
}