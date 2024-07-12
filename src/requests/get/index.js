import axios from "axios";
import toast from "react-hot-toast";

const getRequest = async ({ url }) => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}` + url);

    return Promise.resolve(res);
  } catch (err) {
    toast.error(err?.response?.data?.msg);
    return Promise.reject(err);
  }
};

export default getRequest;
