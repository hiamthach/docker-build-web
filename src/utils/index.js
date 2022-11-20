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

//Hiển thị địa chỉ IP thay số cuối tùy theo param truyền vào nếu không có thì hiện hết
export const renderIP = (IPList, last) => {
  if (last) {
    return IPList?.slice(0, 3).join(".") + last;
  } else {
    return IPList?.join(".");
  }
};

// Tạo 1 template sẵn của Ubuntu dockerfile
export const dockerfileUbuntuTemplate = (object) => {
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

// Tạo 1 template sẵn của Kali dockerfile
export const dockerfileKaliTemplate = (object) => {
  const renderServices = () => {
    //Object để tương ứng vs loại service đã chọn
    const serviceObj = {
      MySQL: "default-mysql-server",

      HTTP: "apache2",

      DNS: "dnsutils",

      FTP: "vsftpd",
    };
    // Render theo list service vd MySQL --> mysql-server
    const newList = object.configure?.services.map((value) => {
      // Xử lý chỗ DNS render ra 2 dòng
      if (value === "DNS") {
        return `RUN apt-get install -y bind9 &&\\
    apt-get install -y dnsutils`;
      }
      return `RUN apt-get install -y ${serviceObj[value]}`;
    });

    return newList.join("\n");
  };

  //Template sẵn chỉ render thêm các dòng
  const template = `
FROM kalilinux/kali-rolling

WORKDIR /root
  
RUN apt -y update && DEBIAN_FRONTEND=noninteractive apt -y dist-upgrade && apt -y autoremove && apt clean
  
RUN apt -y install curl wget vim git net-tools whois netcat-traditional pciutils usbutils
  
RUN DEBIAN_FRONTEND=noninteractive apt -y install kali-tools-top10 exploitdb man-db dirb nikto wpscan uniscan lsof apktool dex2jar ltrace strace binwalk
RUN apt-get -y update &&\\
    apt-get install -y ftp
${renderServices()}  
  `;

  return template;
};

// Tạo 1 template sẵn của Alpine dockerfile
export const dockerfileAlpineTemplate = (object) => {
  const renderServices = () => {
    //Object để tương ứng vs loại service đã chọn
    const serviceObj = {
      MySQL: "mysql mysql-client",

      HTTP: "apache2",

      DNS: "nsd",

      FTP: "vsftpd",
    };
    // Render theo list service vd MySQL --> mysql-server
    const newList = object.configure?.services.map((value, index) => {
      return `RUN apk add ${serviceObj[value]} ${
        index !== object.configure.services.length - 1 ? "&&\\" : "" // Nếu là phần tử cuối cùng thì ko có dấu &&\
      }`;
    });

    return newList.join("\n");
  };

  //Template sẵn chỉ render thêm các dòng
  const template = `
FROM alpine:latest

USER root
  
LABEL maintainer="hoannguyen@gmail.com.vn"
LABEL version="1.0"
  
RUN DEBIAN_FRONTEND=noninteractive  
  
RUN apk update &&\\
    apk upgrade &&\\
    apk add iputils &&\\
    apk add openrc &&\\
    apk add lftp &&\\
${renderServices()}  
  `;

  return template;
};

// Tạo 1 template sẵn của Router
export const dockerfileRouterTemplate = () => {
  const template = `
FROM ubuntu:latest

USER root

LABEL maintainer="hoannguyen@gmail.com.vn"
LABEL version="1.0"

RUN DEBIAN_FRONTEND=noninteractive     
RUN apt-get update && \\
    apt-get install net-tools -y &&\\
    apt-get install -y iputils-ping &&\\
    apt-get install -y systemd   
  `;
  return template;
};

// Tạo 1 PC template sẵn về service.txt
export const servicePCTemplate = (data, index) => {
  const template = `# PC${index}
VPC_${index}:
image: ${data.name}
build: 
  context: ./
  dockerfile: ${data.name}/dockerfile
networks:
${renderIP(data.configure.IP, ".x")}:
  ipv4_address: ${renderIP(data.configure.IP)}
cap_add:
  - NET_ADMIN
tty: true 
stdin_open: true
`;

  return template;
};

//Tạo 1 Router template sẵn về service file
export const serviceRouterTemplate = (data, index) => {
  const template = `Router-${index}:
image: ${data.name}
build: 
  context: ./
  dockerfile: ${data.name}/dockerfile
networks:
${
  data.configure.left.status
    ? `net_${renderIP(data.configure.left.IP, ".x")}:
  ipv4_address: ${renderIP(data.configure.left.IP)}`
    : ""
}
${
  data.configure.right.status
    ? `net_${renderIP(data.configure.right.IP, ".x")}:
  ipv4_address: ${renderIP(data.configure.right.IP)}`
    : ""
}
tty: true 
stdin_open: true
cap_add:
  - NET_ADMIN
tty: true 
stdin_open: true
`;

  return template;
};
//Tạo 1 Network template sẵn về service file
export const serviceNetworkTemplate = (object) => {
  const template = `net_${renderIP(object.IP, ".x")}: 
  driver: bridge
  ipam:
   config:
     - subnet: ${renderIP(object.IP, ".0/24")} 
       gateway: ${renderIP(object.IP, ".1")}`;
  return template;
};

// Render file service
export const renderServiceTxt = (objects) => {
  const PCServiceRender = objects
    //Filter ra các end device và truyền data vào template có sẵn để render
    .filter((object) => object.type === "end-device")
    .map((object, index) => {
      return servicePCTemplate(object, index + 1);
    });

  const RouterServiceRender = objects
    //Filter ra các end device và truyền data vào template có sẵn để render
    .filter((object) => object.type === "router")
    .map((object, index) => {
      return serviceRouterTemplate(object, index + 1);
    });

  const NetworkRender = objects
    //Filter ra router để lấy các configure bên trái và bên phải để render ra router
    .filter((object) => object.type === "router")
    .map((object) => {
      const listNetwork = [];
      if (object.configure.left.status) {
        listNetwork.push(serviceNetworkTemplate(object.configure.left));
      }
      if (object.configure.right.status) {
        listNetwork.push(serviceNetworkTemplate(object.configure.right));
      }
      return listNetwork.join("\n");
    });

  return `
version: '2.2'
services:   
${PCServiceRender.join("\n")}
${RouterServiceRender.join("\n")}
networks: 
${NetworkRender.join("\n")}
    `;
};
