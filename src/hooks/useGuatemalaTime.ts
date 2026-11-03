import { useEffect, useState } from "react";

const guatemalaClock = new Intl.DateTimeFormat("en-GB", {
  timeZone: "America/Guatemala",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const formatGuatemalaTime = () => guatemalaClock.format(new Date());

/** Current time in America/Guatemala, refreshed every 15 seconds. */
export const useGuatemalaTime = () => {
  const [time, setTime] = useState(formatGuatemalaTime);
  useEffect(() => {
    const id = window.setInterval(() => setTime(formatGuatemalaTime()), 15000);
    return () => window.clearInterval(id);
  }, []);
  return time;
};

export default useGuatemalaTime;