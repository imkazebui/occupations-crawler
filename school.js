const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

// get list school
const getListSchool = url => {
  request(url, function(err, res, body) {
    if (err) {
      console.log(err);
    } else {
      let $ = cheerio.load(body);

      let listMajor = [];
      let listSchool = [];

      const length = $(".MsoNormalTable").length;
      console.log("length", length);
      $(".MsoNormalTable").each(function(idx, table) {
        if (idx + 1 !== length) {
        } else {
          let data = {};
          let locationId = "";

          $("tbody", table)
            .children()
            .each(function(trIndex, tr) {
              if (trIndex !== 0) {
                let schoolData = {};

                console.log("trIndex", trIndex);

                $("td", tr).each(function(tdIndex, td) {
                  let locationEl = $("i", td);
                  let schoolEl = $("a", td);
                  let marjorId = $("span", td);

                  console.log("tdIndex", tdIndex);
                  console.log("locationEl", locationEl.text());

                  if (locationEl.text() != "") {
                    console.log("locationid");
                    locationId = "locationId" + trIndex;
                    data[locationId] = {
                      locationName: locationEl.text(),
                      list: []
                    };
                  } else {
                    if (schoolEl) {
                      schoolData.schoolName = schoolEl.text();
                      schoolData.link = schoolEl.attr("href");
                    } else {
                      schoolData.marjorId = marjorId.text();
                    }
                  }
                });

                data[locationId].list.push(schoolData);
              }
            });
          console.log("data", data);
          // console.log("data", data);
        }
      });
    }
  });
};

const URL =
  "https://thongtintuyensinh.vn/Tim-truong-theo-cac-nhom-nganh-dao-tao-trinh-do-dai-hoc_C128_D14907.htm";

module.exports = function() {
  request(URL, function(err, res, body) {
    if (err) {
      console.log(err);
    } else {
      let $ = cheerio.load(body);
      let data = {};
      let fieldId;
      let link;
      let listPromise = [];

      // get list group major
      $("tbody", ".MsoNormalTable")
        .children()
        .each(function(idx, el) {
          fieldId = "fieldId" + idx;
          link = $("a", el).attr("href");

          if (idx === 0) {
            console.log("dm link", $("a", el).attr("href"));
            getListSchool(link);
          }

          data[fieldId] = {
            fieldName: $("font", el).text(),
            link: $("a", el).attr("href")
          };
        });

      // get school data
    }
  });
};
