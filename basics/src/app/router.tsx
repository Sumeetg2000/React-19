import { createBrowserRouter } from "react-router-dom";
import PageLayout from "../layout/PageLayout";

// import all feature pages
import EffectComparison from "../features/effects/EffectComparison";
import TransitionVsDeferred from "../features/concurrency/TransitionVsDeferred";
import TransitionOnly from "../features/concurrency/TransitionOnly";
import DeferredOnly from "../features/concurrency/DeferredOnly";
import Optimistic from "../features/async/Optimistic";
import FormActions from "../features/async/FormActions";
import UseAsync from "../features/async/UseAsync";
import ActivityDemo from "../features/ui/ActivityDemo";
import ViewTransitionDemo from "../features/ui/ViewTransitionDemo";
import FragmentRef from "../features/refs/FragmentRef";
import ImperativeHandle from "../features/refs/ImperativeHandle";
import OwnerStack from "../features/debug/OwnerStack";
import ErrorBoundaryDemo from "../features/errors/ErrorBoundaryDemo";
import EffectEventDemo from "../features/effects/EffectEvent";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      { path: "effects", element: <EffectComparison /> },
      { path: "transition-vs-deferred", element: <TransitionVsDeferred /> },
      { path: "transition", element: <TransitionOnly /> },
      { path: "deferred", element: <DeferredOnly /> },
      { path: "optimistic", element: <Optimistic /> },
      { path: "form-actions", element: <FormActions /> },
      { path: "use", element: <UseAsync /> },
      { path: "activity", element: <ActivityDemo /> },
      { path: "view-transition", element: <ViewTransitionDemo /> },
      { path: "fragment-ref", element: <FragmentRef /> },
      { path: "imperative", element: <ImperativeHandle /> },
      { path: "owner-stack", element: <OwnerStack /> },
      { path: "error-boundary", element: <ErrorBoundaryDemo /> },
      { path: "effect-event", element: <EffectEventDemo /> },
    ],
  },
]);
