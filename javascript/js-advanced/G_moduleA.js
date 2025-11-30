let name = "moduleA";

function setName(str) {
  name = str;
}

export { name, setName };

export const num = 1;

const arr = [];
const obj = {};
export { arr, obj };

export default "default";
