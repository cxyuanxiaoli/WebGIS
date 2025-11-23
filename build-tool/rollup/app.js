import { addNum } from "./mode";
import { compact } from "lodash-es";

compact([0, 1, false, 2, '', 3]); // output: [1, 2, 3]

console.log(addNum()); // output: 2