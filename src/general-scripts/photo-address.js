import { SERVER_IP } from "@/constants/api";
import { getImageURL } from "./get-image-url";

export function photoAddress(photo, altPath, altName){
  if (!photo){
    return getImageURL(altPath, altName);
  }
  else {
    if (photo.slice(0, 7) == "http://") {
      return photo;
    }
    return SERVER_IP + photo;
  }
}