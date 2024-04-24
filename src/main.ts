import AnimationPage from './components/animationsPage';
import FinalPage from './components/finalPage';
import HomePage, { PersonInfo } from './components/homePage';
import './styles.scss';

class Game {
    private homePageContainer: HTMLElement = document.querySelector("#home-page") as HTMLElement;
    private animationPageContainer: HTMLElement = document.querySelector("#animations") as HTMLElement;
    private finalPageContainer: HTMLElement = document.querySelector("#final-page") as HTMLElement;

    private allPerson: PersonDate[] = [];

    constructor() {
        let animationPage = new AnimationPage((answers: number[]) => {
            this.allPerson[this.allPerson.length - 1].answers = answers;
            this.hidePage(this.animationPageContainer);
            this.showPage(this.finalPageContainer);
        });

        new HomePage((info: PersonInfo) => {
            this.allPerson.push({ info: info, answers: [] });
            this.hidePage(this.homePageContainer);
            this.showPage(this.animationPageContainer);
            animationPage.startAgain();
        });

        new FinalPage(() => {
            this.hidePage(this.finalPageContainer);
            this.showPage(this.homePageContainer);

            let data = this.getStorageData();
            const excelData = this.createExcelData(data);
            this.downloadExcelFile(excelData, 'example.xls');

            this.allPerson = [];
        }, () => {
            this.hidePage(this.finalPageContainer);
            this.showPage(this.homePageContainer);
            this.storageInLocalhost();
        });
    }

    private storageInLocalhost() {
        let oldData = [];
        if (localStorage.getItem("data")) {
            oldData = JSON.parse(localStorage.getItem("data") as string);
        }
        localStorage.setItem("data", JSON.stringify([...oldData, ...this.createXLSXItems([this.allPerson[this.allPerson.length - 1]])]));
    }

    private getStorageData(): (number[] | string[])[] {
        let oldData = [];
        if (localStorage.getItem("data")) {
            oldData = JSON.parse(localStorage.getItem("data") as string);
        }

        let onlyAnswers = [...oldData, ...this.createXLSXItems([this.allPerson[this.allPerson.length - 1]])];
        localStorage.setItem("data", JSON.stringify(onlyAnswers));

        let newData = [this.createXLSXHeader(), ...onlyAnswers];

        return newData;
    }

    private createXLSXItems(inbox: PersonDate[]): number[][] {
        let arr = [];
        for (let i = 0; i < inbox.length; i++) {
            arr.push([inbox[i].info.id, ...inbox[i].answers]);
        }
        return arr;
    }


    private createXLSXHeader(): string[] {
        let arr = ["id"];
        for (let i = 1; i < 31; i++) {
            arr.push(`${i}`);
        }
        return arr;
    }

    private createExcelData(data: any[][]) {
        let excelContent = '<?xml version="1.0"?>\n';
        excelContent += '<?mso-application progid="Excel.Sheet"?>\n';
        excelContent += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
        excelContent += ' xmlns:o="urn:schemas-microsoft-com:office:office"\n';
        excelContent += ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n';
        excelContent += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';

        excelContent += '<Worksheet ss:Name="Sheet1">\n';
        excelContent += '<Table>\n';
        for (const row of data) {
            excelContent += '<Row>\n';
            for (const cell of row) {
                excelContent += `<Cell><Data ss:Type="String">${cell}</Data></Cell>\n`;
            }
            excelContent += '</Row>\n';
        }
        excelContent += '</Table>\n';
        excelContent += '</Worksheet>\n';

        excelContent += '</Workbook>';

        return excelContent;
    }

    private downloadExcelFile(data: string, filename: string) {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    private hidePage(page: HTMLElement) {
        page.classList.add("d-none");
    }

    private showPage(page: HTMLElement) {
        page.classList.remove("d-none");
    }
}

new Game();

type PersonDate = {
    info: PersonInfo,
    answers: number[]
}
