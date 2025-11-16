import toast from "react-hot-toast";

export const logError = (error) => {
  console.log(error);

  const errors = error.response?.data?.errors;
  const errorMessage = error.response?.data?.message;

  if (errors && Array.isArray(errors) && errors.length > 0) {
    toast.error(errors[0]); // chỉ hiển thị lỗi đầu tiên
  } else if (errorMessage) {
    toast.error(errorMessage);
  } else {
    toast.error("Internal server error");
  }
};
