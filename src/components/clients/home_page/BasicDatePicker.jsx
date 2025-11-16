import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const BasicDatePicker = ({ selectedDate, setSelectedDate }) => {
  const [value, setValue] = useState(dayjs(selectedDate));

  useEffect(() => {
    setValue(dayjs(selectedDate));
  }, [selectedDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Chọn ngày"
        format="DD/MM/YYYY"
        value={value}
        onChange={(newValue) => {
          if (newValue) {
            setValue(newValue);
            setSelectedDate(newValue.toDate());
          }
        }}
        maxDate={dayjs()} // Prevent future dates
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
