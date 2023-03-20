import {Result, ResultJSON} from '@malloydata/malloy';
import {HTMLView} from '@malloydata/render';
import {ActivationFunction} from 'vscode-notebook-renderer';

export interface MalloyRendererProps {
  results: ResultJSON;
}

export const activate: ActivationFunction = () => {
  return {
    renderOutputItem(info, element) {
      const {data} = Result.fromJSON(info.json());
      const job = new HTMLView(document).render(data, {dataStyles: {}});
      job.then(html => {
        element.innerHTML = '';
        element.appendChild(html);
      });
    },
  };
};
