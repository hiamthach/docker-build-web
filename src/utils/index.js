import routerImg from "../assets/img/router.png";
import switchImg from "../assets/img/switch.png";
import endDeviceImg from "../assets/img/pc.png";

export const listType = [
  {
    key: "router",
    name: "Router",
    img: routerImg,
  },
  {
    key: "switch",
    name: "Switch",
    img: switchImg,
  },
  {
    key: "end-device",
    name: "End device",
    img: endDeviceImg,
  },
];

export const renderIcon = (key) => {
  switch (key) {
    case "router":
      return routerImg;
    case "switch":
      return switchImg;
    case "end-device":
      return endDeviceImg;
    default:
      return;
  }
};
