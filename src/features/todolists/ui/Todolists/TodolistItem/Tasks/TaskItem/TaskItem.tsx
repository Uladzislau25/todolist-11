import { EditableSpan } from "@/common/components/EditableSpan/EditableSpan"
import { changeTaskStatusTC, changeTaskTitleAC, deleteTaskTC } from "@/features/todolists/model/tasks-slice.ts"
import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import type { ChangeEvent } from "react"
import { getListItemSx } from "./TaskItem.styles"
import { useAppDispatch } from "@/common/hooks"
import { DomainTask, TaskStatus } from "@/features/todolists/api/tasksApi.types.ts"

type Props = {
  task: DomainTask
  todolistId: string
}

export const TaskItem = ({ task, todolistId }: Props) => {
  const dispatch = useAppDispatch()

  const deleteTask = () => {
    dispatch(deleteTaskTC({ todolistId, taskId: task.id }))
  }

  const changeTaskStatus = (e: ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? TaskStatus.Completed : TaskStatus.New
    dispatch(changeTaskStatusTC({ todolistId, taskId: task.id, status: newStatus }))
  }

  const changeTaskTitle = (title: string) => {
    dispatch(changeTaskTitleAC({ todolistId, taskId: task.id, title }))
  }
  const checked = task.status === TaskStatus.Completed

  return (
    <ListItem sx={getListItemSx(checked)}>
      <div>
        <Checkbox checked={checked} onChange={changeTaskStatus} />
        <EditableSpan value={task.title} onChange={changeTaskTitle} />
      </div>
      <IconButton onClick={deleteTask}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
