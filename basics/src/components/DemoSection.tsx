type Props = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function DemoSection({ title, description, children }: Props) {
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}