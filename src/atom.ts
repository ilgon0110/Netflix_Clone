import { atom } from "recoil";

export const boxOpenState = atom<boolean>({
  key: "boxOpen",
  default: false,
});
