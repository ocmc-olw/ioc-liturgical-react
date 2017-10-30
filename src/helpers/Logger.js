/**
 * Created by mac002 on 1/2/17.
 */


module.exports = {
  debug: (className, methodName, varName, value) => {
    let msg = className + "." + methodName + "." + varName + " = ";
      if (typeof value === "object"
      || typeof value === "function"
      ) {
        console.log(msg + "(see below):");
        console.log(value);
      } else {
        console.log(msg + value);
      }
  }
  , info: (info) => {
    console.log(info);
  }
}
