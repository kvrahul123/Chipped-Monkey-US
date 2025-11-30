import type { Editor } from '@tiptap/core'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
      return null
    }
  
    return (
      <div className='flex flex-wrap gap-x-3 gap-y-1 p-2'>
        <button type="button"
          {...(editor.isActive('bold') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
        <i className="fa-solid fa-bold"></i>
        </button>
        <button type="button"
          {...(editor.isActive('underline') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
         <i className="fa-solid fa-underline"></i>
        </button>
        <button type="button"
          {...(editor.isActive('italic') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <i className="fa-solid fa-italic"></i>
        </button>
        <button type="button"
          {...(editor.isActive('strike') && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <i className="fa-solid fa-strikethrough"></i>
        </button>
        <button type="button"
          {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
         <i className="fa-solid fa-align-left"></i>
        </button>
        <button type="button"
          {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
         <i className="fa-solid fa-align-center"></i>
        </button>
        <button type="button"
          {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
         <i className="fa-solid fa-align-right"></i>
        </button>
        <button type="button"
          {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
          variant='outlined'
          size='small'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          <i className="fa-solid fa-align-justify"></i>
        </button>
      </div>
    )
}
  
export default EditorToolbar;