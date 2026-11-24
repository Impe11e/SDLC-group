export interface IEmailSender {
    sendPasswordReset(to: string, link: string): Promise<void>;
}

// заглушка. замість справжньої пошти виводить лист у консоль бекенду
export class ConsoleEmailAdapter implements IEmailSender {
    async sendPasswordReset(to: string, link: string): Promise<void> {
        console.info(
            `[email] Для ${to}: скинути пароль можна за посиланням ${link} (діє 30 хвилин)`
        );
    }
}
