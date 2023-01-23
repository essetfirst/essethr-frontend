function filter(list = [], fields) {
  // cmpFn = (v1, v2) => v1 === v2
  return list.filter((element) => {
    let isIncluded = fields.every((field) => {
      const { value, cmpFn } = field;
      let isTrue = false;
      if (cmpFn) {
        isTrue = cmpFn(element, value);
      } else {
        isTrue = element[field] === value;
      }
      // console.log("Filter key: ", field);
      // console.log("Filter value: ", value);
      // console.log("Element value: ", element[field]);
      // console.log("Result: ", isTrue);
      return isTrue;
    });
    // console.log("Included: ", isIncluded);
    return isIncluded;
  });
}

export default filter;
