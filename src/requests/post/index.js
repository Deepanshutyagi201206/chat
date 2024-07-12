import axios from "axios";
import toast from "react-hot-toast";

const postRequest = async ({ url, body }) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API_URL}` + url,
      body
    );

    return Promise.resolve(res);
  } catch (err) {
    toast.error(err?.response?.data?.msg);
    return Promise.reject(err);
  }
};

export default postRequest;
