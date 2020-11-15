interface FullpageCallback {
	beforeSlideChange: (
		currentSlide?: HTMLElement,
		nextSlide?: HTMLElement,
		currentIndex?: number,
		nextIndex?: number,
	) => void;
	afterSlideChange: (
		currentSlide?: HTMLElement,
		currentIndex?: number,
	) => void;
}

interface FullpageState {
	currentIndex: number;
	nextIndex: number;
	canScroll: boolean;
	scrollDirection: string;
	setCanScroll: (params: boolean) => void;
}

export interface FullpageOptions {
	prevEl?: string;
	nextEl?: string;
	speed?: number;
	slideClass?: string;
	dots?: boolean;
	on?: FullpageCallback;
}

export class Fullpage {
	private $el: HTMLElement;
	private $elWrapper: HTMLElement;
	private prevEl: HTMLElement;
	private nextEl: HTMLElement;
	private slides: Array<HTMLElement> = [];
	private slidesLength: number;
	private titles: Array<string> = [];
	private options: FullpageOptions = {};
	private state: FullpageState = {
		currentIndex: 0,
		nextIndex: 0,
		canScroll: true,
		scrollDirection: "down",
		setCanScroll: (canScroll: boolean) => {
			this.state.canScroll = canScroll;
		},
	};
	afterSlideChange: Function;
	beforeSlideChange: Function;

	constructor($el: string, options: FullpageOptions) {
		this.$el = document.querySelector($el);
		if (this.$el) {
			this.options = [].concat(options)[0];
			this.prevEl = this.$el.querySelector(this.options.prevEl);
			this.nextEl = this.$el.querySelector(this.options.nextEl);
			this.slides = Array.from(
				this.$el.querySelectorAll(this.options.slideClass),
			);
			if (typeof options.on.afterSlideChange == "function") {
				this.afterSlideChange = options.on.afterSlideChange;
			}
			if (typeof options.on.beforeSlideChange == "function") {
				this.beforeSlideChange = options.on.beforeSlideChange;
			}
			this.slides.forEach((slide) => {
				this.titles.push(slide.getAttribute("fp-title"));
			});
			this.slidesLength = this.slides.length;
			this.init();
		}
	}

	private init() {
		for (let i = 0; i < this.slidesLength; i++) {
			this.slides[i].setAttribute("fp-index", i.toString());
			if (i === 0) {
				this.slides[i].classList.add("active");
			}
		}
		this.generateDots();
		this.setStateForButtons();
		this.mouseOnScroll();
		this.buttonsOnClick();
		this.activeDotWhenChangeSlide();
	}

	private generateDots() {
		if (this.options.dots) {
			this.$elWrapper = document.createElement("div");
			this.$elWrapper.classList.add("fp-dots");
			let dotItemString = "";
			for (let i = 0; i < this.slidesLength; i++) {
				dotItemString += `<div class="fp-dot" fp-target=${i}>
					<span class="fp-number">${i + 1}</span>
					<span class="fp-title">${this.titles[i]}</span>
				</div>`;
			}
			this.$elWrapper.innerHTML = dotItemString;
			this.$el.append(this.$elWrapper);

			this.dotsClicked();
		}
	}

	private setStateForButtons() {
		if (this.state.currentIndex >= this.slidesLength - 1) {
			this.nextEl.classList.add("disabled");
		} else {
			this.nextEl.classList.remove("disabled");
		}

		if (this.state.currentIndex <= 0) {
			this.prevEl.classList.add("disabled");
		} else {
			this.prevEl.classList.remove("disabled");
		}
	}

	private mouseOnScroll() {
		document.addEventListener("wheel", (e) => {
			if (this.state.canScroll) {
				this.state.canScroll = false;
				if (e.deltaY > 0) {
					if (this.state.nextIndex < this.slidesLength - 1) {
						this.state.nextIndex += 1;
						this.state.scrollDirection = "down";
					}
				} else {
					if (this.state.nextIndex > 0) {
						this.state.nextIndex -= 1;
						this.state.scrollDirection = "up";
					}
				}
				this.changeSlide();
				setTimeout(() => {
					this.state.canScroll = true;
				}, this.options.speed + 400);
			}
		});
	}

	private buttonsOnClick() {
		this.prevEl.addEventListener("click", () => {
			if (this.state.canScroll) {
				this.state.canScroll = false;
				if (this.state.nextIndex > 0) {
					this.state.nextIndex -= 1;
				}
				this.changeSlide();
				setTimeout(() => {
					this.state.canScroll = true;
				}, this.options.speed + 400);
			}
		});
		this.nextEl.addEventListener("click", () => {
			if (this.state.canScroll) {
				this.state.canScroll = false;
				if (this.state.nextIndex < this.slidesLength - 1) {
					this.state.nextIndex += 1;
				}
				this.changeSlide();
				setTimeout(() => {
					this.state.canScroll = true;
				}, this.options.speed + 400);
			}
		});
	}

	private dotsClicked() {
		const navigationItems = Array.from(
			this.$elWrapper.querySelectorAll(".fp-dot"),
		);
		navigationItems.forEach((navItem) => {
			navItem.addEventListener("click", () => {
				if (this.state.canScroll) {
					this.state.canScroll = false;
					const target = navItem.getAttribute("fp-target");
					this.state.nextIndex = Number(target);
					if (this.state.nextIndex > this.state.currentIndex) {
						this.state.scrollDirection = "down";
					} else {
						this.state.scrollDirection = "up";
					}
					this.changeSlide();
					setTimeout(() => {
						this.state.canScroll = true;
					}, this.options.speed + 400);
				}
			});
		});
	}

	private activeDotWhenChangeSlide() {
		const currentIndex = this.state.currentIndex;
		const navigationItems = Array.from(
			this.$elWrapper.querySelectorAll(".fp-dot"),
		);
		navigationItems.forEach((navItem, navItemIndex) => {
			if (navItemIndex == currentIndex) {
				navItem.classList.add("active");
			} else {
				navItem.classList.remove("active");
			}
		});
	}

	private changeSlide() {
		if (this.state.currentIndex != this.state.nextIndex) {
			if (typeof this.beforeSlideChange == "function") {
				this.beforeSlideChange(
					this.slides[this.state.currentIndex],
					this.slides[this.state.nextIndex],
					this.state.currentIndex,
					this.state.nextIndex,
				);
			}
			const element = this.slides[this.state.nextIndex];
			const prevElement = this.slides[this.state.currentIndex];
			let start: number;
			element.classList.add("changing");
			const slide = (timestamp: number) => {
				if (start === undefined) {
					start = timestamp;
				}
				const elapsed = timestamp - start;
				let elementTransformY;
				let prevElementTransformY;
				// `Math.min()` is used here to make sure that the element stops at exactly windowHeight.
				if (this.state.scrollDirection == "down") {
					// slideUp when scroll down
					elementTransformY =
						window.innerHeight -
						Math.min(
							(window.innerHeight / this.options.speed) * elapsed,
							window.innerHeight,
						);

					prevElementTransformY =
						-1 *
						Math.min(
							(window.innerHeight / this.options.speed) * elapsed,
							window.innerHeight,
						);
				} else {
					// slideUp down scroll up
					elementTransformY =
						Math.min(
							(window.innerHeight / this.options.speed) * elapsed,
							window.innerHeight,
						) - window.innerHeight;

					prevElementTransformY = Math.min(
						(window.innerHeight / this.options.speed) * elapsed,
						window.innerHeight,
					);
				}
				prevElement.style.transform = `translateY(${prevElementTransformY}px)`;
				element.style.transform = `translateY(${elementTransformY}px)`;

				if (elapsed < this.options.speed) {
					window.requestAnimationFrame(slide);
				} else {
					// Stop the animation after 1 seconds
					element.classList.remove("changing");
					element.classList.add("active");
					prevElement.classList.remove("active");
					this.state.currentIndex = this.state.nextIndex;
					this.setStateForButtons();
					this.activeDotWhenChangeSlide();

					if (typeof this.afterSlideChange == "function") {
						this.afterSlideChange(
							this.slides[this.state.currentIndex],
							this.state.currentIndex,
						);
					}
				}
			};
			window.requestAnimationFrame(slide);
		}
	}

	// method
	public slideTo(i: number) {
		this.state.nextIndex = Number(i);
		this.changeSlide();
	}

	public getIndex() {
		return this.state.currentIndex;
	}

	public canScroll(canScroll: boolean) {
		this.state.setCanScroll(canScroll);
	}
}
