class FinalPage {
    private homePage: HTMLElement = document.querySelector("#home-page") as HTMLElement;
    private finalPage: HTMLElement = document.querySelector("#final-page") as HTMLElement;
    private addNewButton: HTMLButtonElement = document.querySelector(".add-new-button") as HTMLButtonElement;
    private finishButton: HTMLButtonElement = document.querySelector(".finish-button") as HTMLButtonElement;

    constructor(private finishCallback: () => void) {
        this.initButtons();
    }

    private initButtons() {
        this.addNewButton.addEventListener("click", () => {
            this.hidePage(this.finalPage);
            this.showPage(this.homePage);
        });

        this.finishButton.addEventListener("click", () => {
            this.finishCallback();
        });
    }

    private hidePage(page: HTMLElement) {
        page.classList.add("d-none");
    }

    private showPage(page: HTMLElement) {
        page.classList.remove("d-none");
    }
}

export default FinalPage;