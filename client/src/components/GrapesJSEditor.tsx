import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import 'grapesjs-preset-webpage';
import 'grapesjs-blocks-basic';
import 'grapesjs-plugin-forms';
import 'grapesjs-component-countdown';
import 'grapesjs-plugin-export';
import 'grapesjs-tui-image-editor';
import 'grapesjs-typed';
import 'grapesjs-style-bg';

interface GrapesJSEditorProps {
  value?: string;
  onChange: (html: string, css: string) => void;
  height?: string;
  className?: string;
}

export function GrapesJSEditor({ 
  value = '', 
  onChange, 
  height = '600px',
  className = ''
}: GrapesJSEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const grapesEditor = grapesjs.init({
      container: editorRef.current,
      height,
      width: '100%',
      storageManager: false,
      plugins: [
        'grapesjs-preset-webpage',
        'grapesjs-blocks-basic',
        'grapesjs-plugin-forms',
        'grapesjs-component-countdown',
        'grapesjs-plugin-export',
        'grapesjs-tui-image-editor',
        'grapesjs-typed',
        'grapesjs-style-bg'
      ],
      pluginsOpts: {
        'grapesjs-preset-webpage': {
          modalImportTitle: 'Import Template',
          modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
          modalImportContent: function(editor: any) {
            return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
          }
        },
        'grapesjs-blocks-basic': {
          blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video']
        },
        'grapesjs-plugin-forms': {},
        'grapesjs-component-countdown': {},
        'grapesjs-plugin-export': {},
        'grapesjs-tui-image-editor': {},
        'grapesjs-typed': {},
        'grapesjs-style-bg': {}
      },
      blockManager: {
        appendTo: '.blocks-container',
        blocks: [
          {
            id: 'section',
            label: '<i class="fa fa-square-o"></i> Section',
            attributes: { class: 'gjs-fonts gjs-f-b1' },
            content: '<section class="container mx-auto px-4 py-8"><h2>Section Title</h2><p>Your content here...</p></section>'
          },
          {
            id: 'text',
            label: '<i class="fa fa-text-width"></i> Text',
            content: '<div class="text-component"><p>Insert your text here</p></div>'
          },
          {
            id: 'image',
            label: '<i class="fa fa-image"></i> Image',
            content: '<img src="https://via.placeholder.com/300x200" alt="placeholder" class="img-responsive"/>'
          },
          {
            id: 'button',
            label: '<i class="fa fa-hand-pointer-o"></i> Button',
            content: '<button class="btn btn-primary">Click me</button>'
          },
          {
            id: 'hero',
            label: '<i class="fa fa-star"></i> Hero Section',
            content: '<section class="hero-section bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20"><div class="container mx-auto text-center"><h1 class="text-4xl font-bold mb-4">Hero Title</h1><p class="text-xl mb-8">Your amazing subtitle</p><button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">Get Started</button></div></section>'
          }
        ]
      },
      canvas: {
        styles: [
          'https://cdn.tailwindcss.com/3.3.2/tailwind.min.css'
        ]
      }
    });

    // Set initial content if provided
    if (value) {
      grapesEditor.setComponents(value);
    }

    // Listen for content changes
    grapesEditor.on('update', () => {
      const html = grapesEditor.getHtml();
      const css = grapesEditor.getCss();
      onChange(html, css);
    });

    setEditor(grapesEditor);

    return () => {
      if (grapesEditor) {
        grapesEditor.destroy();
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHtml()) {
      editor.setComponents(value);
    }
  }, [value, editor]);

  return (
    <div className={`grapes-editor-container ${className}`}>
      <div className="grapes-editor-wrapper" style={{ height }}>
        <div ref={editorRef} className="grapes-editor" />
      </div>
      <style jsx>{`
        .grapes-editor-container {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }
        .grapes-editor-wrapper {
          position: relative;
        }
        .grapes-editor {
          height: 100%;
          width: 100%;
        }
        .gjs-one-bg {
          background-color: #f8fafc;
        }
        .gjs-two-color {
          color: #334155;
        }
        .gjs-three-bg {
          background-color: #ffffff;
        }
        .gjs-four-color {
          color: #64748b;
        }
        .gjs-four-color-h:hover {
          color: #475569;
        }
      `}</style>
    </div>
  );
}