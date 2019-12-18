const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");

const URL =
  "https://thongtintuyensinh.vn/Gioi-thieu-mot-so-nganh-nghe-trong-xa-hoi_C217_D4955.htm";

const getMajorContent = async url => {
  if (!url) {
    return [];
  }

  return new Promise((resolve, reject) => {
    request(url, function(err, res, body) {
      if (err) {
        console.log(err);
        resolve([]);
      } else {
        let $ = cheerio.load(body);
        const data = $(".tabcontent")
          .children()
          .filter(function(idx, el) {
            return el.tagName === "div" && !$(this).hasClass("itemblock");
          });

        return resolve(
          data
            .map(function(idx, el) {
              return $(this).html();
            })
            .get()
            .join("<br />")
        );
      }
    });
  });
};

module.exports = function() {
  request(URL, async function(err, res, body) {
    if (err) {
      console.log(err);
    } else {
      let $ = cheerio.load(body);
      let data = {};
      let listPromise = [];

      let fieldId;

      const getListMajor = fieldId => async (idx, element) => {
        $(element)
          .children()
          .each(getMajor(fieldId));
      };

      const getMajor = fieldId => (idx, element) => {
        $(element)
          .children()
          .each(async function(idx, ele) {
            listPromise.push(
              new Promise(async function(resolve, reject) {
                const el = $("a", "span", ele);
                const content = await getMajorContent(el.attr("href"));
                data[fieldId].major.push({
                  content,
                  major: $("font", el).text(),
                  link: el.attr("href")
                });
                resolve();
              })
            );
          });
      };

      $("tbody")
        .children()
        .each(async function(idx, el) {
          if ((idx + 1) % 2 !== 0) {
            fieldId = "fieldId" + idx;
            data[fieldId] = {
              fieldName: $("span", "p", el).text(),
              major: []
            };
          } else {
            $(el)
              .children()
              .each(getListMajor(fieldId));
          }
        });

      Promise.all(listPromise).then(values => {
        fs.writeFile("data.txt", JSON.stringify(data), function(err) {
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
