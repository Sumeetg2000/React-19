import { useState } from "react";
import DemoSection from "../../components/DemoSection";

export default function ViewTransitionDemo() {
  const [toggle, setToggle] = useState(false);

  const handle = () => {
    if (!document.startViewTransition) {
      setToggle((t) => !t);
      return;
    }

    document.startViewTransition(() => {
      setToggle((t) => !t);
    });
  };

  return (
    <DemoSection
      title="View Transition"
      description="Smooth DOM transitions"
    >
      <button onClick={handle}>Toggle</button>

      <div
        className={`mt-4 ${
          toggle ? "w-40 h-40 bg-blue-400" : "w-20 h-20 bg-red-400"
        }`}
      />
    </DemoSection>
  );
}