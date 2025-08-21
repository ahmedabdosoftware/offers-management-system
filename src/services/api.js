import instance from "@/plugins/axios";

export const httpRequest = (url, options = { method: "GET" }) =>
  instance(url, options);
