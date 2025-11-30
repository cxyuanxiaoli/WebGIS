import { setName } from "./G_moduleA.js";
import { getName } from "./G_moduleB.js";
import * as moduleA from "./G_moduleA.js";

console.log(moduleA);

console.log(getName());

setName("A");

console.log(getName());
