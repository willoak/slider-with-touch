import { SlideNav } from "./slide.js";

const slide = new SlideNav(".slide", ".wrapper-slider");
slide.init();
slide.addArrow(".prev", ".next");
slide.addControl();
