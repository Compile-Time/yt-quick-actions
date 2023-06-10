import { HtmlTreeNavigator } from "../../src/html-navigation/html-tree-navigator";
import {
  IdNavigationFilter,
  SvgDrawPathNavigationFilter,
  TagNavigationFilter,
} from "../../src/html-navigation/filter/navigation-filter";
import { Tags } from "../../src/html-element-processing/element-data";

describe("HtmlTreeNavigator", () => {
  it("should return a child div when navigating from a parent div", () => {
    const div = document.createElement("div");
    div.id = "div1";
    const div2 = document.createElement("div");
    div2.id = "div2";
    div.appendChild(div2);

    const elements: Element[] = HtmlTreeNavigator.startFrom(div)
      .findAll(new TagNavigationFilter("div"))
      .map((result) => result.consume());

    expect(elements).toEqual([div2]);
  });

  it("should return no element when filters do not match", () => {
    const div = document.createElement("div");
    div.id = "div1";
    const div2 = document.createElement("div");
    div2.id = "div2";
    div.appendChild(div2);

    const elements: Element[] = HtmlTreeNavigator.startFrom(div)
      .findAll(new TagNavigationFilter("span"))
      .map((result) => result.consume());

    expect(elements).toEqual([]);
  });

  it("should return multiple elements if target is not unique", () => {
    const rootContainer = document.createElement("div");
    rootContainer.id = "root-container";

    const div1 = document.createElement("div");
    div1.id = "div1";
    const div2 = document.createElement("div");
    div2.id = "div2";
    const div3 = document.createElement("div");
    div3.id = "div3";

    rootContainer.appendChild(div1);
    rootContainer.appendChild(div2);
    rootContainer.appendChild(div3);

    const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
      .findAll(new TagNavigationFilter("div"))
      .map((result) => result.consume());

    expect(elements).toEqual([div1, div2, div3]);
  });

  it("should return a single element even when multiple similar paths exist", () => {
    const rootContainer = document.createElement("div");
    rootContainer.id = "root-container";

    const div1 = document.createElement("div");
    div1.id = "div1";
    const div2 = document.createElement("div");
    div2.id = "div2";
    const div3 = document.createElement("div");
    div3.id = "div3";

    const svg1 = document.createElement("svg");
    svg1.id = "svg1";
    const svg2 = document.createElement("svg");
    svg2.id = "svg2";
    const svg3 = document.createElement("svg");
    svg3.id = "svg3";

    const g1 = document.createElement("g");
    svg1.appendChild(g1);
    const g2 = document.createElement("g");
    svg2.appendChild(g2);
    const g3 = document.createElement("g");
    svg3.appendChild(g3);

    const path1 = document.createElement("path");
    path1.setAttribute("d", "M10 10");
    g1.appendChild(path1);
    const path2 = document.createElement("path");
    path2.setAttribute("d", "M20 20");
    g2.appendChild(path2);
    const path3 = document.createElement("path");
    path3.setAttribute("d", "M30 30");
    g3.appendChild(path3);

    div1.appendChild(svg1);
    div2.appendChild(svg2);
    div3.appendChild(svg3);

    rootContainer.appendChild(div1);
    rootContainer.appendChild(div2);
    rootContainer.appendChild(div3);

    const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
      .findAll(new SvgDrawPathNavigationFilter("M20 20"))
      .map((result) => result.consume());

    expect(elements).toEqual([path2]);
  });

  it("should return the element whose path matches the most with the given filters", () => {
    const rootContainer = document.createElement("div");
    rootContainer.id = "root-container";

    const div1 = document.createElement("div");
    div1.id = "div1";
    const div2 = document.createElement("div");
    div2.id = "div2";
    const div3 = document.createElement("div");
    div3.id = "div3";

    const button1 = document.createElement("button");
    const button2 = document.createElement("button");
    const button3 = document.createElement("button");

    const svg1 = document.createElement("svg");
    svg1.id = "svg1";
    const g1 = document.createElement("g");
    svg1.appendChild(g1);
    const path1 = document.createElement("path");
    path1.setAttribute("d", "M10 10");
    g1.appendChild(path1);

    button1.appendChild(svg1);

    div1.appendChild(button1);
    div2.appendChild(button2);
    div3.appendChild(button3);

    rootContainer.appendChild(div1);
    rootContainer.appendChild(div2);
    rootContainer.appendChild(div3);

    const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
      .filter(new TagNavigationFilter(Tags.BUTTON))
      .findAll(new SvgDrawPathNavigationFilter("M10 10"))
      .map((result) => result.consume());

    expect(elements).toEqual([path1]);
  });

  it(
    "should return the element whose path matches the most with the given filters even if it is not the" +
      " last element in the tree",
    () => {
      const rootContainer = document.createElement("div");
      rootContainer.id = "root-container";

      const div1 = document.createElement("div");
      div1.id = "div1";
      const div2 = document.createElement("div");
      div2.id = "div2";
      const div3 = document.createElement("div");
      div3.id = "div3";

      const button1 = document.createElement("button");
      button1.id = "button1";
      const button2 = document.createElement("button");
      const button3 = document.createElement("button");

      const span1 = document.createElement("span");
      span1.textContent = "Span1";

      button1.appendChild(span1);

      div1.appendChild(button1);
      div2.appendChild(button2);
      div3.appendChild(button3);

      rootContainer.appendChild(div1);
      rootContainer.appendChild(div2);
      rootContainer.appendChild(div3);

      const elements: Element[] = HtmlTreeNavigator.startFrom(rootContainer)
        .filter(new TagNavigationFilter(Tags.DIV))
        .findAll(new IdNavigationFilter("button", "button1"))
        .map((result) => result.consume());

      expect(elements).toEqual([button1]);
    }
  );
});
