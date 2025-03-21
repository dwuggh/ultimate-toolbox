import { DropShadowFilter } from "pixi-filters";
import { Container, Point } from "pixi.js";

export default class SelectState {
  target?: Container;
  isDragging = false;
  dragOffset = new Point(0, 0);

  filter: DropShadowFilter = new DropShadowFilter({resolution: 4});

  select(target: Container, drag: boolean, eventPos?: Point) {
    // unselect original target
    this.unselect();
    this.isDragging = drag;
    this.target = target;
    if (drag) {
      this.setFilter(true);
      this.dragOffset = target.toLocal(eventPos || target.position);
    }
  }

  move(eventPos: Point) {
    if (this.isDragging && this.target) {
      const parent = this.target.parent;
      const newPosition = parent.toLocal(eventPos);
      this.target.position.x = newPosition.x - this.dragOffset.x;
      this.target.position.y = newPosition.y - this.dragOffset.y;
    }
  }

  unselect() {
    this.setFilter(false);
    this.target = undefined;
    this.unsetDrag();
  }

  unsetDrag() {
    this.isDragging = false;
    this.dragOffset.set(0, 0)
  }

  setFilter(add: boolean) {

    if (this.target) {
      if (add) {
      this.target.filters = [this.filter];
      } else {
      this.target.filters = [];
      }
    }
  }
}