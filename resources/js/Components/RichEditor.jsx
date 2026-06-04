import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

export default function RichEditor({ value, onChange, placeholder = 'Tulis persyaratan pendaftaran...' }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [3, 4] },
            }),
            Placeholder.configure({ placeholder }),
        ],
        content: value || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value]);

    if (!editor) return null;

    const ToolButton = ({ onClick, active, label }) => (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="flex flex-wrap gap-1.5 border-b border-gray-100 bg-gray-50/50 px-3 py-2.5">
                <ToolButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    label={<span className="font-bold">B</span>}
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    label={<span className="italic">I</span>}
                />
                <div className="w-px bg-gray-200" />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    label="H3"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                    active={editor.isActive('heading', { level: 4 })}
                    label="H4"
                />
                <div className="w-px bg-gray-200" />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    label="• List"
                />
                <ToolButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    label="1. List"
                />
            </div>
            <EditorContent
                editor={editor}
                className="prose prose-sm max-w-none px-4 py-3 [&_.ProseMirror]:min-h-[180px] [&_.ProseMirror]:outline-none [&_.ProseMirror_p]:leading-relaxed [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-300 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
            />
        </div>
    );
}
