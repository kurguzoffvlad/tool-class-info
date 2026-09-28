import { ClassInfo } from "./index.js";

class ClassTest extends ClassInfo {
  public name: string = 'service';
  private _count: number = 0;

  constructor(name?: string) {
    super();
    if (name) this.name = name;
  }

  public doWork(): void { this._count++; }
  public get count(): number { return this._count; }
  private _secret(): void {}
}

const s = new ClassTest('demo');
s.logStructure();
