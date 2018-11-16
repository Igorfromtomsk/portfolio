export class Terminal {
  private frameDoc: Document;
  private commands: Command[];
  private currentCommand: string;
  private history: string[] = [];
  private flow: HTMLElement;
  private path: string;

  constructor() {
    const self = this;

    this.commands = [
      {
        name: 'clear',
        action: () => {
          self.clearInput();
          self.clearFlow();
        }
      }, {
        name: 'help',
        action: () => {
          for (let i = 0; i < self.commands.length; ++i) {
            self.writeLn(self.commands[i].name);
          }

          self.clearInput();
        }
      }, {
        name: 'echo',
        action: () => {
          let echo_text = '';

          try {
            const words = this.currentCommand.split(' ');
            echo_text = words.splice(1, words.length - 1).join(' ');
          } catch {
            echo_text = '';
          }

          self.writeLn(echo_text);
          self.clearInput();
        }
      }
    ];
  }

  make() {
    const self = this;
    const frame = <HTMLIFrameElement>document.querySelectorAll('.js_npm')[0];
    this.path = document.getElementsByClassName('terminal__row-marker')[0].outerHTML;
    this.flow = <HTMLElement>document.querySelectorAll('.terminal__flow')[0];
    this.frameDoc = <Document>frame.contentDocument;

    const html = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
          <style>
            body {
              overflow: hidden;
              padding-top: .25rem;
              margin: 0;
              font-size: .875rem;
              font-family: 'Open Sans', sans-serif;
              color: white;
            }
          </style>
        </head>
        <body>
        </body>
      </html>
    `;

    this.frameDoc.open();
    this.frameDoc.write(html);
    this.frameDoc.close();

    this.frameDoc.designMode = 'on';

    this.frameDoc.addEventListener('keypress', (e) => {
      if (e.charCode === 13) {
        e.preventDefault();

        const command = this.frameDoc.getElementsByTagName('body')[0].innerHTML;
        self.doCommand(command);
      }
    });
  }

  doCommand(command) {
    if (!command) {
      return false;
    }

    this.history.push(command);

    this.writeLn(this.path + command);

    const commandName = command.split(' ')[0];
    const attrs = command.split(' ');
    attrs.shift();
    const commandIsExist = !!this.commands.filter(cmd => cmd.name === commandName).length;

    if (commandIsExist) {
      this.currentCommand = command;
      this.doAction(commandName);
    } else {
      this.writeLn(`Command not found: ${command}`);
      this.clearInput();
    }
  }

  doAction(commandName) {
    this.commands.filter(cmd => cmd.name === commandName)[0].action();
  }

  clearFlow(): void {
    this.flow.innerHTML = '';
  }

  clearInput(): void {
    this.frameDoc.getElementsByTagName('body')[0].innerText = '';
  }

  writeLn(text): void {
    this.flow.innerHTML += `<p class='terminal__line'>${text}</p>`;
  }
}

interface Command {
  message?: string;
  name: string;

  action(): void;
}
