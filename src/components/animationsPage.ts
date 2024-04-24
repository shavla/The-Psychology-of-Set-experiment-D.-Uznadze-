class AnimationPage {
    private whiteCurtain: HTMLElement = document.querySelector(".black-curtain") as HTMLElement;
    private differentCirclesContainer: HTMLElement = document.querySelector(".different-circles") as HTMLElement;
    private sameCirclesContainer: HTMLElement = document.querySelector(".same-circles") as HTMLElement;

    // 15
    private animationQuantity: number = 15;
    private intervals: number = 2000;
    private whiteCurtainAppear: number = 1000;

    private canPressButton: boolean = false;
    private answers: number[] = [];

    private keyPressedAmount: number = 0;
    private maxSameCirclesDisplay: number = 30;

    constructor(private personAnswerCallback: (info: number[]) => void) {
        this.initAnswerButtons();
    }

    startAgain() {
        this.keyPressedAmount = 0;
        this.answers = [];
        this.setStartPositions();
        this.startAnimations();
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
                    this.checkForFinish();
                }
                if (e.key == "ArrowDown") {
                    this.answers.push(1);
                    this.checkForFinish();
                }
                if (e.key == "ArrowRight") {
                    this.answers.push(2);
                    this.checkForFinish();
                }
            }
        })
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