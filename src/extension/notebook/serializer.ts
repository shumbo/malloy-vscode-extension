import * as vscode from 'vscode';

const SPLITTER = '\n// -------------------\n';

export class MalloyNotebookSerializer implements vscode.NotebookSerializer {
  private readonly decoder = new TextDecoder();
  private readonly encoder = new TextEncoder();

  static providerOptions: vscode.NotebookDocumentContentOptions = {
    transientCellMetadata: {
      runnable: true,
      editable: true,
      custom: true,
    },
    transientOutputs: true,
  };

  deserializeNotebook(
    content: Uint8Array,
    _token: vscode.CancellationToken
  ): vscode.NotebookData | Thenable<vscode.NotebookData> {
    const str = this.decoder.decode(content);
    const blocks = splitBlocks(str);
    const cells: vscode.NotebookCellData[] = blocks.map(block => {
      const isMarkdown = block.startsWith('/*markdown') && block.endsWith('*/');
      if (isMarkdown) {
        const lines = block.split('\n');
        const innerMarkdown =
          lines.length > 2 ? lines.slice(1, lines.length - 1).join('\n') : '';
        return new vscode.NotebookCellData(
          vscode.NotebookCellKind.Markup,
          innerMarkdown,
          'markdown'
        );
      }
      return new vscode.NotebookCellData(
        vscode.NotebookCellKind.Code,
        block,
        'malloy'
      );
    });
    return {cells};
  }
  serializeNotebook(
    data: vscode.NotebookData,
    _token: vscode.CancellationToken
  ): Uint8Array | Thenable<Uint8Array> {
    const str = data.cells
      .map(({value, kind}) =>
        kind === vscode.NotebookCellKind.Code
          ? value
          : `/*markdown\n${value}\n*/`
      )
      .join(SPLITTER);
    return this.encoder.encode(str);
  }
}

function splitBlocks(raw: string): string[] {
  const blocks: string[] = [];
  for (const block of raw.split(SPLITTER)) {
    if (block.trim().length > 0) {
      blocks.push(block);
      continue;
    }
    if (blocks.length < 1) {
      continue;
    }
    blocks[blocks.length - 1] += SPLITTER;
  }
  return blocks;
}
