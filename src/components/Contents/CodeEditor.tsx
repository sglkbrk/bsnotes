import { highlight, languages } from 'prismjs';
import React, { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { FaCode } from 'react-icons/fa';
import '../../assets/css/prism-tomorrow.css';
import { ContentUpdate } from '../../services/ContentService';
import { Content } from '../../interface/Content';

const CodeNote = ({ item, editable }: { item: Content; editable: boolean }) => {
  const [code, setCode] = useState('// Write your code here');
  useEffect(() => {
    if (item && item.contentValue) {
      setCode(item.contentValue);
    }
  }, [item]);
  const handleBlur = () => {
    if (item) {
      item.contentValue = code;
      ContentUpdate(item);
    }
  };
  return (
    <div className="group flex items-center justify-center ">
      <p className="font-semibold text-gray-200 uppercase min-w-12">
        <FaCode />
      </p>
      <Editor
        disabled={editable}
        value={code}
        onBlur={handleBlur}
        onValueChange={(code) => setCode(code)}
        highlight={(code) => highlight(code, languages.javascript, 'javascript')}
        padding={10}
        className="border border-gray-300 w-full rounded-md bg-gray-800 text-white font-mono"
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14
        }}
      />
    </div>
  );
};

export default CodeNote;
