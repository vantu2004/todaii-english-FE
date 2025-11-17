import toast from "react-hot-toast";

export const logError = (error) => {
  console.log(error);

  const errors = error.response?.data?.errors;
  const errorMessage_01 = error.response?.data?.message;
  const errorMessage_02 = error.response?.data?.detail;

  if (errors && Array.isArray(errors) && errors.length > 0) {
    toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
  } else if (errorMessage_01) {
    toast.error(errorMessage_01);
  } else if (errorMessage_02) {
    toast.error(errorMessage_02);
  } else {
    toast.error("Internal server error");
  }
};
