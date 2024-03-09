import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export const QuillEditor = (props: ReactQuillProps) => {
  return <ReactQuill theme="snow" {...props} />;
};
