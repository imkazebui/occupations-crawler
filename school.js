const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const URL =
  "https://thongtintuyensinh.vn/Tim-truong-theo-cac-nhom-nganh-dao-tao-trinh-do-dai-hoc_C128_D14907.htm";

export const getSchoolData = () => {
  request(URL, function(err, res, body) {
    if (err) {
      console.log(err);
    } else {
      let $ = cheerio.load(body);
      let data = {};
      let listPromise = [];

      // get list group major

      // get list school

      // get school data
    }
  });
};
