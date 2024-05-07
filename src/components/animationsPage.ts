import { Settings } from "./settingsPage";

class AnimationPage {
    private whiteCurtain: HTMLElement = document.querySelector(".black-curtain") as HTMLElement;
    private differentCirclesContainer: HTMLElement = document.querySelector(".different-circles") as HTMLElement;
    private sameCirclesContainer: HTMLElement = document.querySelector(".same-circles") as HTMLElement;

    private animationQuantity: number = 15; // 15
    private intervals: number = 2000;
    private whiteCurtainAppear: number = 1000;

    private canPressButton: boolean = false;
    private answers: number[] = [];

    private keyPressedAmount: number = 0;
    private maxSameCirclesDisplay: number = 30; // 30
    private needFirstPage: boolean = false;

    private spaceBetweenCircles: number = 3;

    constructor(private personAnswerCallback: (info: number[]) => void) {
        this.initAnswerButtons();
    }

    startAgain() {
        this.keyPressedAmount = 0;
        this.answers = [];
        this.setCirclesStyle();
        this.setStartPositions();
        if (this.needFirstPage) {
            this.showFirstPage();
        } else {
            this.startAnimations();
        }
    }

    private setCirclesStyle() {
        if (localStorage.getItem("settings")) {
            let settings: Settings = JSON.parse(localStorage.getItem("settings") as string);
            let leftCircle: HTMLElement = this.differentCirclesContainer.querySelector(".left-circle") as HTMLElement;
            let rightCircle: HTMLElement = this.differentCirclesContainer.querySelector(".right-circle") as HTMLElement;

            let sameLeftCircle: HTMLElement = this.sameCirclesContainer.querySelector(".same-left-circle") as HTMLElement;
            let sameRightCircle: HTMLElement = this.sameCirclesContainer.querySelector(".same-right-circle") as HTMLElement;

            if (settings.filled) {
                leftCircle.classList.add("filled");
                rightCircle.classList.add("filled");
                sameLeftCircle.classList.add("filled");
                sameRightCircle.classList.add("filled");
            }

            leftCircle.style.width = `${settings.leftDimension}em`;
            leftCircle.style.height = `${settings.leftDimension}em`;

            rightCircle.style.width = `${settings.rightDimension}em`;
            rightCircle.style.height = `${settings.rightDimension}em`;

            sameLeftCircle.style.width = `${settings.sameDimension}em`;
            sameLeftCircle.style.height = `${settings.sameDimension}em`;

            sameRightCircle.style.width = `${settings.sameDimension}em`;
            sameRightCircle.style.height = `${settings.sameDimension}em`;

            leftCircle.style.marginRight = `${settings.spaceBetween}em`;
            sameLeftCircle.style.marginRight = `${settings.spaceBetween}em`;

            this.spaceBetweenCircles = settings.spaceBetween;

            this.needFirstPage = settings.needFirstPage;
        }

        if (this.needFirstPage) {
            this.answers.push(1)
        } else {
            this.answers.push(0);
            this.answers.push(0);
        }
    }

    private startAnimations() {
        for (let i = 0; i < this.animationQuantity; i++) {
            setTimeout(() => {
                this.hidePage(this.whiteCurtain);
                setTimeout(() => {
                    this.showPage(this.whiteCurtain);
                    if (i == this.animationQuantity - 1) {
                        this.showSameBalls();
                    }
                }, this.whiteCurtainAppear);
            }, i * this.intervals);
        }
    }

    private showFirstPage() {
        this.canPressButton = true;
        this.hidePage(this.differentCirclesContainer);
        this.showPage(this.sameCirclesContainer);
    }

    private showSameBalls() {
        setTimeout(() => {
            this.canPressButton = true;
            this.hidePage(this.differentCirclesContainer);
            this.hidePage(this.whiteCurtain);
            this.showPage(this.sameCirclesContainer);
        }, this.intervals - this.whiteCurtainAppear);
    }

    private initAnswerButtons() {
        document.addEventListener("keydown", (e) => {
            if (this.canPressButton) {
                if (e.key == "ArrowLeft") {
                    this.answers.push(0);
                    if (this.needFirstPage) {
                        this.changeCirclesPositions();
                        this.firstPageClick();
                    } else {
                        this.checkForFinish();
                    }
                }
                if (e.key == "ArrowDown") {
                    this.answers.push(1);
                    if (this.needFirstPage) {
                        this.changeNormalCirclesPosition();
                        this.firstPageClick();
                    } else {
                        this.checkForFinish();
                    }
                }
                if (e.key == "ArrowRight") {
                    this.answers.push(2);
                    if (this.needFirstPage) {
                        this.changeNormalCirclesPosition();
                        this.firstPageClick();
                    } else {
                        this.checkForFinish();
                    }
                }
            }
        })
    }

    private changeCirclesPositions() {
        this.differentCirclesContainer.classList.add("flex-row-reverse");
        let leftCircle: HTMLElement = this.differentCirclesContainer.querySelector(".left-circle") as HTMLElement;
        let rightCircle: HTMLElement = this.differentCirclesContainer.querySelector(".right-circle") as HTMLElement;

        leftCircle.style.marginRight = "0em";
        rightCircle.style.marginRight = `${this.spaceBetweenCircles}em`;
    }

    private changeNormalCirclesPosition() {
        this.differentCirclesContainer.classList.remove("flex-row-reverse");
        let leftCircle: HTMLElement = this.differentCirclesContainer.querySelector(".left-circle") as HTMLElement;
        let rightCircle: HTMLElement = this.differentCirclesContainer.querySelector(".right-circle") as HTMLElement;

        rightCircle.style.marginRight = "0em";
        leftCircle.style.marginRight = `${this.spaceBetweenCircles}em`;
    }

    private firstPageClick() {
        this.canPressButton = false;
        this.needFirstPage = false;
        this.setStartPositions();
        this.startAnimations();
    }

    private checkForFinish() {
        this.keyPressedAmount++;

        if (this.keyPressedAmount == this.maxSameCirclesDisplay) {
            this.canPressButton = false;
            this.personAnswerCallback(this.answers);
        } else {
            this.displayThenHideWhiteCurtain();
        }
    }

    private displayThenHideWhiteCurtain() {
        this.showPage(this.whiteCurtain);
        this.canPressButton = false;
        setTimeout(() => {
            this.canPressButton = true;
            this.hidePage(this.whiteCurtain);
        }, 1000);
    }

    private setStartPositions() {
        this.hidePage(this.sameCirclesContainer);
        this.showPage(this.differentCirclesContainer);
    }

    private hidePage(page: HTMLElement) {
        page.classList.add("d-none");
    }

    private showPage(page: HTMLElement) {
        page.classList.remove("d-none");
    }
}

export enum PersonAnswer {
    LEFT = 0,
    SAME = 1,
    RIGHT = 2
}

export default AnimationPage;