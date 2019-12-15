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
            // console.log("hello", el.tagName);
            return el.tagName === "div";
          });
        // console.log("tablecontent", data.toArray());

        return resolve(data.html());
      }
    });
  });
};

request(URL, async function(err, res, body) {
  if (err) {
    console.log(err);
  } else {
    let $ = cheerio.load(body);
    let data = {};
    let fieldId;

    const getListMajor = fieldId => (idx, element) => {
      console.log("fie", fieldId);
      $(element)
        .children()
        .each(getMajor(fieldId));
    };

    const getMajor = fieldId => (idx, element) => {
      $(element)
        .children()
        .each(async function(idx, ele) {
          const el = $("a", "span", ele);
          const content = await getMajorContent(el.attr("href"));
          // console.log("field", fieldId);
          // console.log("data", data);
          data[fieldId].major.push({
            content,
            major: $("font", el).text(),
            link: el.attr("href")
          });
          // console.log("content", content);
          // console.log("major", $("font", el).text());
          // console.log("link", el.attr("href"));
        });
    };

    $("tbody")
      .children()
      .each(function(idx, el) {
        if ((idx + 1) % 2 !== 0) {
          // console.log("job name", $("span", "p", el).text());
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

    fs.writeFile("data.txt", JSON.stringify(data), function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("success");
      }
    });
  }
});
