export default class Slide {
    constructor(slide, wrapper) {
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);

        //objeto que pega as distancias dos slides
        this.dist = {
            finalPosition: 0,
            startX: 0,
            movement: 0,
        };
    }

    transition(active) {
        this.slide.style.transition = active ? "transform 1s" : "";
    }

    moveSlide(distX) {
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px,0,0)`;
    }

    updatePosition(clientX) {
        // guardando a ultima posicao do slider quando movido
        this.dist.movement = (this.dist.startX - clientX) * 1.6;
        return this.dist.finalPosition - this.dist.movement;
    }

    onStart(event) {
        let moveType;
        if (event.type === "mousedown") {
            event.preventDefault();
            this.dist.startX = event.clientX;
            moveType = "mousemove";
        } else {
            this.dist.startX = event.changedTouches[0].clientX;
            moveType = "touchmove";
        }
        this.wrapper.addEventListener(moveType, this.onMove);
        this.transition(false);
    }

    onMove(event) {
        const pointerEvent = event.type === "mousemove" ? event.clientX : event.changedTouches[0].clientX;
        const finalPosition = this.updatePosition(pointerEvent);
        this.moveSlide(finalPosition);
    }

    onEnd(event) {
        const movetype = event.type === "mouseup" ? "mousemove" : "touchmove";
        this.wrapper.removeEventListener(movetype, this.onMove);
        this.dist.finalPosition = this.dist.movePosition;
        this.transition(true);
        this.changeSlideOnEnd();
    }

    changeSlideOnEnd() {
        if (this.dist.movement > 120 && this.index.next !== undefined) {
            this.activeNexteSlide();
        } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
            this.activePreveSlide();
        } else {
            this.changeSlide(this.index.active);
        }
    }

    //ativa os eventos do slide
    addSlideEvent() {
        this.wrapper.addEventListener("mousedown", this.onStart);
        this.wrapper.addEventListener("touchstart", this.onStart);
        this.wrapper.addEventListener("mouseup", this.onEnd);
        this.wrapper.addEventListener("touchend", this.onEnd);
    }

    bindEvents() {
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    slidePosition(slide) {
        const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
        return -(slide.offsetLeft - margin);
    }

    slidesConfig() {
        this.slideArray = [...this.slide.children].map((element) => {
            return {
                position: this.slidePosition(element),
                element,
            };
        });
    }

    slideIndexNav(index) {
        const last = this.slideArray.length - 1;
        this.index = {
            prev: index ? index - 1 : undefined,
            active: index,
            next: index === last ? undefined : index + 1,
        };
    }

    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(activeSlide.position);
        this.slideIndexNav(index);
        this.dist.finalPosition = activeSlide.position;
    }

    activePreveSlide() {
        if (this.index.prev !== undefined) {
            this.changeSlide(this.index.prev);
        }
    }

    activeNexteSlide() {
        if (this.index.next !== undefined) {
            this.changeSlide(this.index.next);
        }
    }

    init() {
        this.bindEvents();
        this.slidesConfig();
        this.addSlideEvent();
        this.transition(true);
        this.changeSlide(3);
        this.activeNexteSlide();
        return this;
    }
}
