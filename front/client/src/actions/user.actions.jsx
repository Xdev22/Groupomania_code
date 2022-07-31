import axios from "axios";

export const GET_USER = "GET_USER";
export const getUser = (uid) => {
  //dispatch est ce qu'on retourne au reducer
  return (dispatch) => {
    return axios({
      method: "get",
      url: `http://localhost:3000/api/user/${uid}`,
      withCredentials: true,
    })
      .then((res) => {
        console.log(res);
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};
