export const parseTimestamp = (raw) => {
  if (!raw) return new Date();
  try {
    const parts = raw.trim().split(/\s+/);
    if (parts.length >= 2) {
      return new Date(`${parts[0]}T${parts[1]}Z`);
    }
    return new Date(raw);
  } catch (e) {
    return new Date();
  }
};

export const checkAllSameDay = (dates) => {
  if (dates.length <= 1) return true;
  const first = dates[0];
  return dates.every(
    (d) =>
      d.getFullYear() === first.getFullYear() &&
      d.getMonth() === first.getMonth() &&
      d.getDate() === first.getDate(),
  );
};

export const formatTimestampLabel = (date, allSameDay) => {
  const pad = (n) => String(n).padStart(2, "0");
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  if (allSameDay) {
    return `${hh}:${mm}`;
  }
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${month}/${day} ${hh}:${mm}`;
};

export const formatBytes = (bytes) => {
  if (bytes === null || bytes === undefined || isNaN(bytes)) return "0 B";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatNumber = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "0";
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return n.toString();
};

export const buildHitRate = (hits, misses) => {
  if (!hits || !misses) return [];
  return hits.map((hitPoint, i) => {
    const missPoint = misses[i];
    const hitVal = hitPoint.y || 0;
    const missVal = missPoint ? missPoint.y || 0 : 0;
    const total = hitVal + missVal;
    const rate = total > 0 ? (hitVal / total) * 100 : 0;
    return {
      x: hitPoint.x,
      y: parseFloat(rate.toFixed(1)),
    };
  });
};
