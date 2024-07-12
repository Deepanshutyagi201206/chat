import getRequest from "../requests/get";

export const getUsers = async () => {
  try {
    const res = await getRequest({ url: "/connected-users" });

    return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};
