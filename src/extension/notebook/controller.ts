import {Runtime, URLReader} from '@malloydata/malloy';
import * as vscode from 'vscode';
import {ConnectionManager} from '../../common/connection_manager';

export class MalloyNotebookController {
  readonly controllerId = 'malloy-notebook-controller';
  readonly notebookType = 'malloy-notebook';
  readonly label = 'Malloy Notebook';
  readonly supportedLanguages = ['malloy'];

  private readonly _controller: vscode.NotebookController;
  private _executionOrder = 0;

  constructor(
    private connectionManager: ConnectionManager,
    private urlReader: URLReader
  ) {
    this._controller = vscode.notebooks.createNotebookController(
      this.controllerId,
      this.notebookType,
      this.label
    );

    this._controller.supportedLanguages = this.supportedLanguages;
    this._controller.supportsExecutionOrder = false;
    this._controller.executeHandler = this._execute.bind(this);
  }

  private _execute(
    cells: vscode.NotebookCell[],
    _notebook: vscode.NotebookDocument,
    _controller: vscode.NotebookController
  ): void {
    for (const cell of cells) {
      this._doExecution(cell);
    }
  }

  private async _doExecution(cell: vscode.NotebookCell): Promise<void> {
    const execution = this._controller.createNotebookCellExecution(cell);
    execution.executionOrder = ++this._executionOrder;
    execution.start(Date.now());

    const url = new URL(cell.document.uri.toString());

    try {
      const runtime = new Runtime(
        this.urlReader,
        this.connectionManager.getConnectionLookup(url)
      );
      const query = runtime.loadQuery(url);
      const results = await query.run();
      execution.replaceOutput([
        new vscode.NotebookCellOutput([
          vscode.NotebookCellOutputItem.json(
            results.toJSON(),
            'x-application/malloy'
          ),
        ]),
      ]);
      execution.end(true, Date.now());
    } catch (error) {
      execution.replaceOutput([
        new vscode.NotebookCellOutput([
          vscode.NotebookCellOutputItem.text(error.message),
        ]),
      ]);
      execution.end(false);
    }
  }

  dispose() {
    // TODO
  }
}
