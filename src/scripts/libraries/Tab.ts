export default class Tab {
	selector: HTMLElement;
	navigationItems: Array<HTMLElement>;
	contentList: Array<HTMLElement>;
	constructor(selector: string) {
		this.selector = document.querySelector(selector);
		if (this.selector) {
			this.navigationItems = Array.from(
				this.selector.querySelectorAll("[toggle-for]"),
			);
			this.contentList = Array.from(
				this.selector.querySelectorAll("[tab-id]"),
			);
			this.init();
		}
	}

	changeTabWhenClicked() {
		this.navigationItems.forEach((element: HTMLElement, index: number) => {
			element.addEventListener("click", (e) => {
				e.preventDefault();
				const tabTarget = element.attributes["toggle-for"].value;
				const targetDOM = Array.from(
					this.selector.querySelectorAll(`[tab-id='${tabTarget}']`),
				);
				this.navigationItems.forEach(
					(eleClicked: HTMLElement, eleClickedIndex: number) => {
						if (eleClickedIndex != index) {
							eleClicked.classList.remove("active");
						}
					},
				);
				this.contentList.forEach((tabContentElement: HTMLElement) => {
					if (
						tabContentElement.attributes["tab-id"].value !=
						tabTarget
					) {
						tabContentElement.style.display = "none";
						tabContentElement.classList.remove("show");
					}
				});
				element.classList.add("active");
				targetDOM.forEach((item: HTMLElement) => {
					item.style.display = "block";
				});
				setTimeout(() => {
					targetDOM.forEach((item: HTMLElement) => {
						item.classList.add("show");
					});
				}, 50);
			});
		});
	}

	activeFirstTab() {
		if (this.navigationItems.length > 0) {
			this.navigationItems[0].click();
		}
	}

	init() {
		this.changeTabWhenClicked();
		this.activeFirstTab();
	}
}
