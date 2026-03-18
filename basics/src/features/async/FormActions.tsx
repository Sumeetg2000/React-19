import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import DemoSection from "../../components/DemoSection";

async function save(_: string | null, formData: FormData) {
  await new Promise((r) => setTimeout(r, 1500));
  return formData.get("name")?.toString() ?? null;
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="px-3 py-1 bg-blue-500 text-white rounded"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export default function FormActions() {
  const [state, action] = useActionState(save, null);

  return (
    <DemoSection title="useActionState" description="Handles async form state">
      <form action={action} className="space-y-2">
        <input name="name" className="border px-2 py-1 rounded w-full" />
        <Submit />
        <p>{state}</p>
      </form>
    </DemoSection>
  );
}