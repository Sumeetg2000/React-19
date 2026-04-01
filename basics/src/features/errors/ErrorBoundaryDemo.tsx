import { Component, useState, type ReactNode } from "react";
import DemoSection from "../../components/DemoSection";
import ComparePanel from "../../components/ComparePanel";

/* ---------- ERROR BOUNDARY ---------- */

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-3 bg-red-100 text-red-600 rounded text-sm">
          Something went wrong.
        </div>
      );
    }

    return this.props.children;
  }
}

/* ---------- CRASH COMPONENT ---------- */

function Crash() {
  const [crash, setCrash] = useState(false);

  if (crash) {
    throw new Error("Crash!");
  }

  return (
    <>
      <h3>Clicking the button will break the page</h3>
      <div className="pt-4">
        <button
          onClick={() => setCrash(true)}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Trigger Error
        </button>
      </div>
    </>
  );
}

/* ---------- MAIN ---------- */

export default function ErrorBoundaryDemo() {
  return (
    <DemoSection
      title="Error Boundary"
      description="Prevents app from crashing on runtime errors"
    >
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* WITHOUT */}
        <ComparePanel title="Without Error Boundary">
          <Crash />
        </ComparePanel>

        {/* WITH */}
        <ComparePanel title="With Error Boundary" color="green">
          <ErrorBoundary>
            <Crash />
          </ErrorBoundary>
        </ComparePanel>
      </div>
    </DemoSection>
  );
}
