import { restaurantsIndex } from "../urls"
import axios from 'axios';

export const fetchResturants = () => {
  return axios.get(restaurantsIndex)
  .then(res => {
    return res.data
  })
  .catch((e) => console.error(e))
}