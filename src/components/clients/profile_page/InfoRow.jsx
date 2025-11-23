const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <div className="flex items-center gap-2 text-neutral-500">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-medium text-neutral-900">{value || "---"}</span>
  </div>
);

export default InfoRow;
