/*
 * Copyright 2023 Google LLC
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import {TextFieldType} from '@vscode/webview-ui-toolkit';
import React, {FormEvent} from 'react';
import {VSCodeTextField} from '@vscode/webview-ui-toolkit/react';

interface TextFieldProps {
  value: string;
  type?: TextFieldType;
  setValue: (value: string) => void;
  placeholder?: string;
  id?: string;
  style?: React.CSSProperties;
}

type OnChange<T> = (event: Event & FormEvent<T>) => void;

export const TextField: React.FC<TextFieldProps> = ({
  value,
  setValue,
  type,
  placeholder,
  id,
  style,
}) => {
  const onChange: OnChange<HTMLInputElement> = event => {
    setValue(event.currentTarget.value);
  };

  return (
    <VSCodeTextField
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
      id={id}
      style={style}
    />
  );
};
