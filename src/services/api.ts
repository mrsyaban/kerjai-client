import { Axios } from "./http";

export async function userLogin() {
  await Axios.get(`/login`);
}
