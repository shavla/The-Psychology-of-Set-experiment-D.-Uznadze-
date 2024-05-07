class HomePage {
    private personName: HTMLInputElement = document.querySelector("#name-input") as HTMLInputElement;
    private personAge: HTMLInputElement = document.querySelector("#age-input") as HTMLInputElement;
    private personGender: HTMLSelectElement = document.querySelector(".form-select") as HTMLSelectElement;
    private validationErrorContainer: HTMLElement = document.querySelector(".validation-error") as HTMLElement;

    constructor(private startCallback: (info: PersonInfo) => void) {
        this.initStartButton();
    }

    private initStartButton() {
        const startButton = document.querySelector(".start-button");
        startButton?.addEventListener("click", () => {
            //this.startCallback({ id: 1, age: 1, gender: "male" })
            if (this.allInputIsFilled()) {
                this.startCallback(
                    {
                        id: +this.personName.value,
                        gender: this.personGender.value,
                        age: +this.personAge.value
                    }
                );
                this.clearAllInputs();
            } else {
                this.validationErrorContainer.classList.add("show");
                setTimeout(() => {
                    this.validationErrorContainer.classList.remove("show");
                }, 2000);
            }
        });
    }

    private clearAllInputs() {
        [this.personName, this.personAge, this.personGender].forEach(item => item.value = "");
    }

    private allInputIsFilled(): boolean {
        return [this.personName, this.personAge, this.personGender].every(item => item.value != "");
    }
}

export type PersonInfo = {
    id: number,
    age: number,
    gender: string,
}

export default HomePage;