import { Settings } from "./settingsPage";

class AnimationPage {
    private whiteCurtain: HTMLElement = document.querySelector(".black-curtain") as HTMLElement;
    private differentCirclesContainer: HTMLElement = document.querySelector(".different-circles") as HTMLElement;
    private sameCirclesContainer: HTMLElement = document.querySelector(".same-circles") as HTMLElement;

    private canPressButton: boolean = false;
    private answers: number[] = [];

    private keyPressedAmount: number = 0;
    private maxSameCirclesDisplay: number = 40; // 30

    private settings: Settings = {
        filled: false,
        leftDimension: 17,
        rightDimension: 30,
        sameDimension: 22.5,
        middleDimension: 4,
        spaceBetween: 3,
        needFirstPage: false
    };

    constructor(private personAnswerCallback: (info: number[]) => void) {
        this.initAnswerButtons();
        this.differentCirclesContainer.addEventListener("animationend", () => {
            this.showSameBalls();
        });
    }

    startAgain() {
        this.keyPressedAmount = 0;
        this.answers = [];
        this.setCirclesStyle();
        this.setStartPositions();
        if (this.settings.needFirstPage) {
            this.showFirstPage();
        } else {
            this.startAnimations();
        }
    }

    private setCirclesStyle() {
        if (localStorage.getItem("settings")) {
            this.settings = JSON.parse(localStorage.getItem("settings") as string);
            let leftCircle: HTMLElement = this.differentCirclesContainer.querySelector(".left-circle") as HTMLElement;
            let middleCircle: HTMLElement = this.differentCirclesContainer.querySelector(".middle-circle") as HTMLElement;
            let rightCircle: HTMLElement = this.differentCirclesContainer.querySelector(".right-circle") as HTMLElement;

            let sameLeftCircle: HTMLElement = this.sameCirclesContainer.querySelector(".same-left-circle") as HTMLElement;
            let sameMiddleCircle: HTMLElement = this.sameCirclesContainer.querySelector(".same-middle-circle") as HTMLElement;
            let sameRightCircle: HTMLElement = this.sameCirclesContainer.querySelector(".same-right-circle") as HTMLElement;

            if (this.settings.filled) {
                leftCircle.classList.add("filled");
                rightCircle.classList.add("filled");
                sameLeftCircle.classList.add("filled");
                sameRightCircle.classList.add("filled");
            }

            leftCircle.style.width = `${this.settings.leftDimension}em`;
            leftCircle.style.height = `${this.settings.leftDimension}em`;

            middleCircle.style.width = `${this.settings.middleDimension}em`;
            middleCircle.style.height = `${this.settings.middleDimension}em`;

            rightCircle.style.width = `${this.settings.rightDimension}em`;
            rightCircle.style.height = `${this.settings.rightDimension}em`;

            sameLeftCircle.style.width = `${this.settings.sameDimension}em`;
            sameLeftCircle.style.height = `${this.settings.sameDimension}em`;

            sameRightCircle.style.width = `${this.settings.sameDimension}em`;
            sameRightCircle.style.height = `${this.settings.sameDimension}em`;

            sameMiddleCircle.style.width = `${this.settings.middleDimension}em`;
            sameMiddleCircle.style.height = `${this.settings.middleDimension}em`;

            leftCircle.style.marginRight = `${this.settings.spaceBetween}em`;
            rightCircle.style.marginLeft = `${this.settings.spaceBetween}em`;
            sameLeftCircle.style.marginRight = `${this.settings.spaceBetween}em`;
            sameRightCircle.style.marginLeft = `${this.settings.spaceBetween}em`;

            let redCircle = this.whiteCurtain.querySelector(".red-circle") as HTMLElement;
            redCircle.style.width = `${this.settings.middleDimension}em`;
            redCircle.style.height = `${this.settings.middleDimension}em`;
        }

        if (this.settings.needFirstPage) {
            this.answers.push(1)
        } else {
            this.answers.push(0);
            this.answers.push(0);
        }
    }

    private startAnimations() {
        this.differentCirclesContainer.classList.remove("flash-animation");
        this.differentCirclesContainer.classList.add("flash-animation");
    }

    private showFirstPage() {
        this.canPressButton = true;
        this.hidePage(this.differentCirclesContainer);
        this.showPage(this.sameCirclesContainer);
    }

    private showSameBalls() {
        this.canPressButton = true;
        this.hidePage(this.differentCirclesContainer);
        this.hidePage(this.whiteCurtain);
        this.showPage(this.sameCirclesContainer);
    }

    private initAnswerButtons() {
        document.addEventListener("keydown", (e) => {
            if (this.canPressButton) {
                if (e.key == "ArrowLeft") {
                    this.answers.push(0);
                    if (this.settings.needFirstPage) {
                        this.changeCirclesPositions();
                        this.firstPageClick();
                    } else {
                        this.checkForFinish();
                    }
                }
                if (e.key == "ArrowDown") {
                    this.answers.push(1);
                    if (this.settings.needFirstPage) {
                        this.firstPageClick();
                    } else {
                        this.checkForFinish();
                    }
                }
                if (e.key == "ArrowRight") {
                    this.answers.push(2);
                    if (this.settings.needFirstPage) {
                        this.firstPageClick();
                    } else {
                        this.checkForFinish();
                    }
                }
            }
        })
    }

    private changeCirclesPositions() {
        let leftCircle: HTMLElement = this.differentCirclesContainer.querySelector(".left-circle") as HTMLElement;
        let rightCircle: HTMLElement = this.differentCirclesContainer.querySelector(".right-circle") as HTMLElement;

        leftCircle.style.width = `${this.settings.rightDimension}em`;
        leftCircle.style.height = `${this.settings.rightDimension}em`;

        rightCircle.style.width = `${this.settings.leftDimension}em`;
        rightCircle.style.height = `${this.settings.leftDimension}em`;

        leftCircle.style.marginRight = `${this.settings.spaceBetween}em`;
        rightCircle.style.marginLeft = `${this.settings.spaceBetween}em`;
    }

    private firstPageClick() {
        this.canPressButton = false;
        this.settings.needFirstPage = false;
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