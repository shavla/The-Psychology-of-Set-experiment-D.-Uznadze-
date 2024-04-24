class FinalPage {
    private addNewButton: HTMLButtonElement = document.querySelector(".add-new-button") as HTMLButtonElement;
    private finishButton: HTMLButtonElement = document.querySelector(".finish-button") as HTMLButtonElement;

    constructor(private finishCallback: () => void, private continueCallback: () => void) {
        this.initButtons();
    }

    private initButtons() {
        this.addNewButton.addEventListener("click", () => {
            this.continueCallback();
        });

        this.finishButton.addEventListener("click", () => {
            this.finishCallback();
        });
    }
}

export default FinalPage;