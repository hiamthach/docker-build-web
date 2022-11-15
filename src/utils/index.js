import routerImg from "../assets/img/router.png";
import endDeviceImg from "../assets/img/pc.png";

//Danh sách các loại object
export const listType = [
  {
    key: "router",
    name: "Router",
    img: routerImg,
  },
  // {
  //   key: "switch",
  //   name: "Switch",
  //   img: switchImg,
  // },
  {
    key: "end-device",
    name: "End device",
    img: endDeviceImg,
  },
];

//Hiển thị icon theo object type
export const renderIcon = (key) => {
  switch (key) {
    case "router":
      return routerImg;
    // case "switch":
    //   return switchImg;
    case "end-device":
      return endDeviceImg;
    default:
      return;
  }
};
// Tạo 1 template sẵn của dockerfile
export const dockerfileTemplate = (object) => {
  const renderServices = () => {
    //Object để tương ứng vs loại service đã chọn
    const serviceObj = {
      MySQL: "mysql-server",

      HTTP: "apache2",

      DNS: "dnsutils",

      FTP: "vsftpd",
    };
    // Render theo list service vd MySQL --> mysql-server
    const newList = object.configure?.services.map((value) => {
      return `RUN apt-get install -y ${serviceObj[value]}`;
    });

    return newList.join("\n");
  };

  //Template sẵn chỉ render thêm các dòng
  const template = `
FROM ubuntu:latest

USER root
  
LABEL maintainer="hoannguyen@gmail.com.vn"
LABEL version="1.0"
  
RUN DEBIAN_FRONTEND=noninteractive
  
RUN apt-get update &&\\ 
    apt-get install net-tools -y &&\\ 
    apt-get install -y iputils-ping &&\\ 
    apt-get install -y bind9 &&\\ 
    apt-get install -y systemd
${renderServices()}  
  `;

  return template;
};
// Tạo 1 template sẵn về service.txt
export const serviceTemplate = (data, index) => {
  const template = `
  # PC${index}
 VPC_${index}:
  image: ${data.configure.os}
  build: 
   context: ./
   dockerfile: dockerfile
  networks:
   my_network:
    ipv4_address: ${data.configure.IP?.join(".")}
  tty: true 
  stdin_open: true
  container_name: ${data.name}
  `;

  return template;
};
// Render file service
export const renderServiceTxt = (objects) => {
  const newObject = objects
    //Filter ra các end device và truyền data vào template có sẵn để render
    .filter((object) => object.type === "end-device")
    .map((object, index) => {
      return serviceTemplate(object, index + 1);
    });

  return `
version: '2.2'
services:   
${newObject.join("\n")} 
    `;
};
