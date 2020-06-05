class Utils {
  dateToEuropean(date) {
    date = new Date(date);
    if (date === null) return null;
    return (`${date.getFullYear()}-${(`0${date.getMonth() + 1}`).slice(-2)}-${(`0${date.getDate()}`).slice(-2)}`);
  }
}

export default new Utils();
