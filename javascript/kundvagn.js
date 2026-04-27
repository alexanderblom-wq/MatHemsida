
// funktion för att visa dagens datum
function ShowDate() {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    // formatera datumet som "yyyy/dd/mm"
    var formattedDate = year + "/" + day + "/" + month;
    // visa datumet i elementet med id "date"
    document.getElementById("date").innerHTML = formattedDate;
}