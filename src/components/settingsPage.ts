class SettingsPage {
    private fillInput: HTMLInputElement = document.querySelector("#fill") as HTMLInputElement;
    private firstPageInput: HTMLInputElement = document.querySelector("#first-page-checkbox") as HTMLInputElement;

    private leftDimensionInput: HTMLInputElement = document.querySelector(".left-dimention") as HTMLInputElement;
    private rightDimensionInput: HTMLInputElement = document.querySelector(".right-dimention") as HTMLInputElement;
    private sameDimensionInput: HTMLInputElement = document.querySelector(".same-dimention") as HTMLInputElement;
    private spaceBetweenInput: HTMLInputElement = document.querySelector(".space-between") as HTMLInputElement;

    private leftCircle: HTMLElement = document.querySelector(".settings-left-circle") as HTMLElement;
    private rightCircle: HTMLElement = document.querySelector(".settings-right-circle") as HTMLElement;

    private closeButton: HTMLElement = document.querySelector("#settings-page .close-btn") as HTMLElement;
    private saveButton: HTMLElement = document.querySelector("#settings-page .save-btn") as HTMLElement;

    private defaulValues: Settings = {
        filled: false,
        leftDimension: 17,
        rightDimension: 30,
        sameDimension: 22.5,
        spaceBetween: 3,
        needFirstPage: false,
    }

    constructor(private closeCallback: () => void) {
        this.setDefaultValues();
        this.startListenings();
    }

    private setDefaultValues() {
        if (localStorage.getItem("settings")) {
            let settings: Settings = JSON.parse(localStorage.getItem("settings") as string);
            this.defaulValues = settings;
            this.fillInput.checked = this.defaulValues.filled;
            this.leftDimensionInput.value = this.defaulValues.leftDimension.toString();
            this.rightDimensionInput.value = this.defaulValues.rightDimension.toString();
            this.sameDimensionInput.value = this.defaulValues.sameDimension.toString();
            this.spaceBetweenInput.value = this.defaulValues.spaceBetween.toString();
            this.firstPageInput.checked = this.defaulValues.needFirstPage;
        }

        if (this.defaulValues.filled) {
            this.leftCircle.classList.add("filled");
            this.rightCircle.classList.add("filled");
        }

        this.leftCircle.style.width = `${this.defaulValues.leftDimension}em`;
        this.leftCircle.style.height = `${this.defaulValues.leftDimension}em`;

        this.rightCircle.style.width = `${this.defaulValues.rightDimension}em`;
        this.rightCircle.style.height = `${this.defaulValues.rightDimension}em`;

        this.leftCircle.style.marginRight = `${this.defaulValues.spaceBetween}em`;
    }

    private setSettingsInLocalStorage() {
        this.defaulValues.filled = this.fillInput.checked;
        this.defaulValues.leftDimension = +this.leftDimensionInput.value;
        this.defaulValues.rightDimension = +this.rightDimensionInput.value;
        this.defaulValues.sameDimension = +this.sameDimensionInput.value;
        this.defaulValues.spaceBetween = +this.spaceBetweenInput.value;
        this.defaulValues.needFirstPage = this.firstPageInput.checked;
        localStorage.setItem("settings", JSON.stringify(this.defaulValues));
    }

    private startListenings() {
        this.closeButton.addEventListener("click", this.closeCallback);
        this.saveButton.addEventListener("click", () => {
            this.setSettingsInLocalStorage();
            this.closeCallback();
        });

        this.fillInput.addEventListener("click", () => {
            this.leftCircle.classList.toggle("filled");
            this.rightCircle.classList.toggle("filled");
        });

        this.leftDimensionInput.addEventListener("change", () => {
            this.leftCircle.style.width = `${this.leftDimensionInput.value}em`;
            this.leftCircle.style.height = `${this.leftDimensionInput.value}em`;
        });

        this.rightDimensionInput.addEventListener("change", () => {
            this.rightCircle.style.width = `${this.rightDimensionInput.value}em`;
            this.rightCircle.style.height = `${this.rightDimensionInput.value}em`;
        });

        this.spaceBetweenInput.addEventListener("change", () => {
            this.leftCircle.style.marginRight = `${this.spaceBetweenInput.value}em`;
        });
    }
}

export default SettingsPage;

export type Settings = {
    filled: boolean,
    leftDimension: number,
    rightDimension: number,
    sameDimension: number,
    spaceBetween: number,
    needFirstPage: boolean,
}