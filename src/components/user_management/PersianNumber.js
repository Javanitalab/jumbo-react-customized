import React from "react";

export default function PersianNumber(number) {
  let en_number = number.toString();
  let persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  let persianMap = persianDigits.split("");
  let persian_number = en_number.replace(/\d/g, function(m) {
    return persianMap[parseInt(m)];
  });

  return <span>{persian_number}</span>;
}
