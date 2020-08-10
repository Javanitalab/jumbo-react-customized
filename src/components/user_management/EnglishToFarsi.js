const daysNumberMap = [{ eng: "1", fa: "۱" }, { eng: "2", fa: "۲" }, { eng: "3", fa: "۳" }, { eng: "4", fa: "۴" }, { eng: "5", fa: "۵" }, { eng: "6", fa: "۶" }, { eng: "7", fa: "۷" }, { eng: "8", fa: "۸" }, { eng: "9", fa: "۹" }, { eng: "0", fa: "۰" }]

export default function EnglishNumberToFarsi(enString) {
    var faString = "";
    for (var i = 0; i < (enString + "").length; i++) {
        var engChar = daysNumberMap.find((obj) => obj.eng === (enString + "").charAt(i))
        if (engChar)
            faString += engChar.fa;
        else
            faString += (enString + "").charAt(i)
    }
    return faString;

}