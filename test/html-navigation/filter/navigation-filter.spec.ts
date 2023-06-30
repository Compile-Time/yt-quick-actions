import {
  AnyFilter,
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../../src/html-navigation/filter/navigation-filter";

class FakeHtmlCollection<T extends Element> implements HTMLCollection {
  elements: T[];

  [index: number]: Element;

  readonly length: number;

  constructor(elements: T[]) {
    this.elements = elements;
    this.length = elements.length;
  }

  [Symbol.iterator](): IterableIterator<Element> {
    return this.elements.values();
  }

  item(index: number): T | null {
    return this.elements[index];
  }

  namedItem(name: string): T | null {
    return null;
  }
}

class FakeDocument {
  private elementMap: Map<string, HTMLElement> = new Map<string, HTMLElement>();

  getHtmlCollection(): HTMLCollection {
    const div = document.createElement("div");
    const span = document.createElement("span");
    const span2 = document.createElement("span");
    const span2duplicate = document.createElement("span");
    const p = document.createElement("p");
    const i = document.createElement("i");

    div.id = "div";

    span.id = "span";
    span.textContent = "span";

    span2.id = "span2";
    span2.textContent = "span2";

    span2duplicate.id = "span2";
    span2duplicate.textContent = "span2duplicate";

    i.id = "image";
    p.id = "paragraph";

    div.appendChild(span);
    div.appendChild(i);
    div.appendChild(p);
    div.appendChild(span2);
    div.appendChild(span2duplicate);

    this.elementMap.set(div.id, div);
    this.elementMap.set(span.id, span);
    this.elementMap.set(span2.id, span2);
    this.elementMap.set("span2dup", span2duplicate);
    this.elementMap.set(p.id, p);
    this.elementMap.set(i.id, i);

    return div.children;
  }

  getSvg(drawPath = "M 10 10"): HTMLCollection {
    return this.getSvgAsElement(drawPath).children;
  }

  getSvgAsElement(drawPath = "M 10 10"): HTMLElement {
    const svg = document.createElement("svg");
    const path = document.createElement("path");

    svg.id = "svg";

    path.id = "path";
    path.setAttribute("d", drawPath);

    svg.appendChild(path);

    this.elementMap.set(svg.id, svg);
    this.elementMap.set(path.id, path);

    return svg;
  }

  getElementById(id: string): HTMLElement {
    return this.elementMap.get(id);
  }
}

describe("NavigationFilter", () => {
  const fakeDocument = new FakeDocument();

  describe("TagNavigationFilter", () => {
    it("should filter HTMLCollection by tag", () => {
      const filter = new TagNavigationFilter("p");
      const htmlCollection = fakeDocument.getHtmlCollection();

      const result: Element[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(fakeDocument.getElementById("paragraph"));
    });

    it("should filter single HTMLElement", () => {
      const filter = new TagNavigationFilter("p");
      const htmlElement: HTMLElement = document.createElement("p");

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe("IdNavigationFilter", () => {
    it("should filter HTMLCollection by id and tag", () => {
      const filter = new IdNavigationFilter("i", "image");
      const htmlCollection = fakeDocument.getHtmlCollection();

      const result: Element[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(fakeDocument.getElementById("image"));
    });

    it("should filter single HTMLElement", () => {
      const filter = new IdNavigationFilter("p", "paragraph");
      const htmlElement: HTMLElement = document.createElement("p");
      htmlElement.id = "paragraph";

      const result = filter.applySingle(htmlElement);
      expect(result).toEqual(htmlElement);
    });
  });

  describe("SvgDrawPathNavigationFilter", () => {
    it("should filter HTML collection by tag and svg draw path", () => {
      const filter = new SvgDrawPathNavigationFilter("M 10 10");
      const htmlCollection = fakeDocument.getSvg();

      const result: Element[] = filter.apply(htmlCollection);
      expect(result.length).toEqual(1);
      expect(result[0]).toEqual(fakeDocument.getElementById("path"));
    });

    it("should filter single HTMLElement", () => {
      const filter = new SvgDrawPathNavigationFilter("M 10 10");
      const path: HTMLElement = document.createElement("path");

      path.id = "path";
      path.setAttribute("d", "M 10 10");

      const result = filter.applySingle(path);
      expect(result).toEqual(path);
    });
  });

  describe("AnyFilter", () => {
    it("should be empty for draw path not present in filter", () => {
      const anyFilter = new AnyFilter([
        new SvgDrawPathNavigationFilter("M 10 10"),
        new SvgDrawPathNavigationFilter("M 20 20"),
        new SvgDrawPathNavigationFilter("M 30 30"),
      ]);
      const htmlCollection = fakeDocument.getSvg("M 40 40");

      const result: Element[] = anyFilter.apply(htmlCollection);
      expect(result.length).toEqual(0);
      expect(result[0]).toBeUndefined();
    });

    it("should find multiple svg elements matching filter", () => {
      const anyFilter = new AnyFilter([
        new SvgDrawPathNavigationFilter("M 10 10"),
        new SvgDrawPathNavigationFilter("M 20 20"),
        new SvgDrawPathNavigationFilter("M 30 30"),
      ]);

      const svg1 = fakeDocument.getSvgAsElement();
      const svg2 = fakeDocument.getSvgAsElement("M 20 20");
      const div = document.createElement("div");
      div.appendChild(svg1);
      div.appendChild(svg2);

      const res = Object.values(div.children).flatMap((svg) =>
        Object.values(svg.children)
      );

      const fakeHtmlCollection = new FakeHtmlCollection<Element>(res);

      const result: Element[] = anyFilter.apply(fakeHtmlCollection);
      expect(result.length).toEqual(2);
      expect(result[0]).toEqual(svg1.children.item(0));
      expect(result[1]).toEqual(svg2.children.item(0));
    });
  });
});
