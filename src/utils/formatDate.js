const formatDate = (date) => {
    const d = new Date(date);
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;
    const year = d.getFullYear();
    console.log("day: " + day + " month: " + month + " year: " + year);
  
    if (month.length < 2) { month = `0${month}`; }
    if (day.length < 2) { day = `0${day}`; }
    let result = [year, month, day].join('-');
    console.log(result);
    return result;
  };

  export default formatDate;