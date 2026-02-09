interface RuleItemProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function RuleItem({ title, description, icon }: RuleItemProps) {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-gray-900/50 rounded-xl transition-colors">
      {icon || <div className="mt-1 text-red-500">•</div>}
      <div className="flex-1">
        <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  );
}