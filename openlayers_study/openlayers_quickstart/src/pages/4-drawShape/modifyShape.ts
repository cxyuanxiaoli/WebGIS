import { map } from "../1-loadMap/loadMap";
import { Modify, Select } from "ol/interaction";
export default function modifyShape() {
  const select = new Select();
  const modify = new Modify({
    features: select.getFeatures(),
  });
  map.addInteraction(select);

  map.addInteraction(modify);

  select.setActive(true);
  modify.setActive(true);
}
