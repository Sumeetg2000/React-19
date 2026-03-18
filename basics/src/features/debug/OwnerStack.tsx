import { captureOwnerStack } from "react";
import DemoSection from "../../components/DemoSection";

export default function OwnerStack() {
  return (
    <DemoSection
      title="captureOwnerStack"
      description="Logs React component stack"
    >
      <button
        onClick={() => console.log(captureOwnerStack())}
        className="px-3 py-1 bg-blue-500 text-white rounded"
      >
        Log Stack
      </button>
    </DemoSection>
  );
}