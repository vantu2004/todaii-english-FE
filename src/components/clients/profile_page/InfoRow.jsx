const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-medium text-neutral-900 dark:text-white">{value || "---"}</span>
  </div>
);

export default InfoRow;
