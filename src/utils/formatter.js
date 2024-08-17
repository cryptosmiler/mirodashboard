export default {
  formatBrand: function (brand) {
    return brand.toUpperCase();
  },
  formatTime: function(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = date + " " + month + " " + year;
    return time;
  },
  timestampAsDate: function (timestamp) {
    return new Date(timestamp*1000).toLocaleDateString('en-us', {month: "short", day : "numeric", weekday : "short", year : "numeric"})
  },
  usdFormat: function(amount) {
    let usdFormat = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    let total = amount / 100
    return `${usdFormat.format(total)}`
  },
  formatNumber : function(val) {
    return new Intl.NumberFormat('en-US').format(val);
  },
  formatDate(date) {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    let d = new Date(date),
      month = monthNames[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return `${day} ${month}, ${year}`;
  }
}
