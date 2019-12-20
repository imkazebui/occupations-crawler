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

      let schoolInAreaData = {};

      const length = $(".MsoNormalTable").length;

      $(".MsoNormalTable").each(function(idx, table) {
        if (idx + 1 !== length) {
          let majorData = {
            title: $(this)
              .prev()
              .text(),
            list: []
          };

          $("tbody", table)
            .children()
            .each(function(trIndex, tr) {
              let rowData = [];
              $("td", tr).each(function(tdIndex, td) {
                rowData.push($(this).text());
              });
              majorData.list.push(rowData);
            });

          listMajor.push(majorData);
        } else {
          let locationId = "";

          $("tbody", table)
            .children()
            .each(function(trIndex, tr) {
              if (trIndex !== 0) {
                let schoolData = {};

                $("td", tr).each(function(tdIndex, td) {
                  let locationEl = $("i", td);
                  let schoolEl = $("a", td);
                  let marjorIdEl = $("span", td);

                  if (locationEl.text() != "") {
                    locationId = "locationId" + trIndex;

                    //  ? is there other way?
                    const locationName = $("td", tr)
                      .children()
                      .first()
                      .text();
                    schoolInAreaData[locationId] = {
                      locationName,
                      list: []
                    };
                  } else {
                    if (schoolEl.text() !== "") {
                      schoolData.schoolName = schoolEl.text();
                      schoolData.link = schoolEl.attr("href");

                      // get schoolContent
                      request.get(schoolData.link, function(err, res, body) {
                        if (err) {
                          console.log(err);
                        } else {
                          let $ = cheerio.load(body);

                          const schoolContent = $(".tabcontent")
                            .first()
                            .children()
                            .filter(function(idx, el) {
                              return (
                                el.tagName === !"ins" &&
                                !$(this).hasClass("itemblock") &&
                                el.tagName === !"script"
                              );
                            })
                            .map(function(idx, el) {
                              console.log("daa", $(this).html());
                              return $(this).html();
                            })
                            .get();
                          // .join("<br />");
                          console.log("schooll data content", schoolContent);
                          schoolData.content = schoolContent;
                          // return schoolContent;
                        }
                      });
                    } else {
                      schoolData.marjorId = marjorIdEl.text();
                    }
                  }
                });
                // console.log("school data", schoolData);
                schoolInAreaData[locationId].list.push(schoolData);
              }
            });
        }
        fs.writeFile("school.txt", JSON.stringify(schoolInAreaData), function(
          err
        ) {
          if (err) {
            console.log(err);
          } else {
            console.log("success");
          }
        });
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
    }
  });
};
