export default function DemoInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
}