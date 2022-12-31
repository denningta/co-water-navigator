/* eslint-disable react-hooks/exhaustive-deps */
import { Tooltip } from "@mui/material"
import { text } from "node:stream/consumers"
import { MouseEvent, useEffect, useRef, useState } from "react"
import { BiCommentAdd, BiTrash } from "react-icons/bi"
import { FaCommentSlash } from "react-icons/fa"
import { IoIosSend } from "react-icons/io"
import useFocus from "../../../hooks/useFocus"
import useKeyPress from "../../../hooks/useKeyPress"

interface Props {
  comments: string[]
  onCommentsChange?: (comments: string[]) => void
}

const AddCommentButton = ({ comments = [], onCommentsChange = () => {} }: Props) => {
  const [expanded, setExpanded] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const focus = useFocus(menuRef)
  const enter = useKeyPress('Enter')
  const [newComment, setNewComment] = useState<string | null>(null)
  const [commentsList, setCommentsList ] = useState<string[]>(comments)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const commentsEndRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    onCommentsChange(commentsList)
  }, [commentsList])

  useEffect(() => {
    if (focus.state) {
      if (enter.pressed) handleNewComment(newComment)
    }
  }, [enter])

  useEffect(() => {
    if (!expanded) return
    textAreaRef.current?.focus()
  }, [expanded])

  useEffect(() => {
    if (!expanded) return
    if (focus.state === false) setExpanded(false)
  }, [focus])

  const handleNewComment = (comment: string | null) => {
    if (!comment) return
    commentsList.push(comment)
    setCommentsList([...commentsList])
    setNewComment(null)
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  const handleDeleteComment = (event: MouseEvent, index: number) => {
    event.preventDefault()
    commentsList.splice(index, 1)
    setCommentsList([...commentsList])
  }

  return (
    <div ref={menuRef}>
      <div className="relative px-2">
        <div 
          onClick={handleClick}
          className="ml-3 w-fit h-fit btn-round cursor-pointer">
          <BiCommentAdd />
        </div>
        { commentsList.length > 0 &&
          <div className="absolute top-0 left-3 h-4 w-4 bg-primary-500 rounded-full text-white text-xs font-bold flex items-center justify-center">
            { commentsList.length }
          </div>
        }
      </div>
      <div className="relative">
        <div  className={`absolute top-1 right-3 bg-white z-50 w-[350px] drop-shadow-lg rounded overflow-hidden transition-all ease-in-out ${expanded ? 'w-[350px] max-h-[250px]' : 'w-0 max-h-0'}`}>
          <div className="w-[350px] max-h-[250px]">
            <div className="max-h-[200px] overflow-y-auto">
              <ol>
                {commentsList.map((comment, i) =>
                  <div key={i} className="flex hover:bg-primary-500 hover:bg-opacity-10">
                    <li className="grow px-2 py-1 rounded" >{ comment }</li>
                    <button onClick={(e) => handleDeleteComment(e, i)}
                      className="px-1">
                      <BiTrash />
                    </button>
                  </div>
                )}
              </ol>
              <div ref={commentsEndRef}></div>
            </div>
            <div className="flex h-[50px] mx">
                <textarea
                  ref={textAreaRef}
                  onChange={(e) => setNewComment(e.target.value)}
                  value={newComment ?? ''}
                  className="w-full outline-none px-2 rounded-b"
                  placeholder="Add a comment...">
                </textarea>
                <div
                  onClick={() => handleNewComment(newComment)}
                  className="flex items-center justify-center text-white text-xl bg-primary-500 -ml-4 w-[40px] cursor-pointer">
                    <IoIosSend />
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCommentButton