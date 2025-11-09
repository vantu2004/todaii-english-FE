import { format, parseISO, isValid } from "date-fns";

export const formatDate = (isoString) => {
  if (!isoString) return "-";

  const date = parseISO(isoString);
  if (!isValid(date)) return "-";

  return format(date, "dd/MM/yyyy HH:mm");
};




