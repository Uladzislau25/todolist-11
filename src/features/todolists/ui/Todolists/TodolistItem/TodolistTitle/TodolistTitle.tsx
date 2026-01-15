import { EditableSpan } from "@/common/components"
import DeleteIcon from "@mui/icons-material/Delete"
import IconButton from "@mui/material/IconButton"
import styles from "./TodolistTitle.module.css"
import {
  todolistsApi,
  useChangeTodolistMutation,
  useDeleteTodolistMutation,
} from "@/features/todolists/api/todolistsApi.ts"
import { RequestStatus } from "@/common/types"
import { useAppDispatch } from "@/common/hooks"
import { DomainTodolist } from "@/features/todolists/lib/types"

type Props = {
  todolist: DomainTodolist
}

export const TodolistTitle = ({ todolist }: Props) => {
  const { id, title, entityStatus } = todolist
  const [removeTodolist] = useDeleteTodolistMutation()
  const [updateTodolist] = useChangeTodolistMutation()
  const dispatch = useAppDispatch()

  const changeTodolistStatus = (entityStatus: RequestStatus) => {
    dispatch(
      todolistsApi.util.updateQueryData("getTodolists", undefined, (todolists) => {
        const todolist = todolists.find((tl) => tl.id === id)
        if (todolist) {
          todolist.entityStatus = entityStatus
        }
      }),
    )
  }

  const deleteTodolist = () => {
    changeTodolistStatus("loading")
    removeTodolist(id)
      .unwrap()
      .catch(() => {
        changeTodolistStatus("idle")
      })
  }

  const changeTodolistTitle = (title: string) => {
    updateTodolist({ id, title })
  }

  return (
    <div className={styles.container}>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitle} />
      </h3>
      <IconButton onClick={deleteTodolist} disabled={entityStatus === "loading"}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
