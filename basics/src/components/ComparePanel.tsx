type Props = {
  title: string;
  children: React.ReactNode;
  color?: "blue" | "green" | "gray";
};

const map = {
  blue: "bg-blue-50",
  green: "bg-green-50",
  gray: "bg-gray-50",
};

export default function ComparePanel({ title, children, color = "gray" }: Props) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="px-3 py-2 border-b text-sm font-medium text-gray-600">
        {title}
      </div>
      <div className={`p-3 min-h-[120px] space-y-2 ${map[color]}`}>
        {children}
      </div>
    </div>
  );
}