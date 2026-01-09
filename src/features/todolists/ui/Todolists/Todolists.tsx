import Grid from "@mui/material/Grid2"
import Paper from "@mui/material/Paper"

import { TodolistItem } from "./TodolistItem/TodolistItem"

import { useLazyGetTodolistsQuery } from "@/features/todolists/api/todolistsApi.ts"

export const Todolists = () => {
  const [trigger, { data }] = useLazyGetTodolistsQuery()

  const fetchTodolistsHandler = () => {
    trigger()
  }
  return (
    <>
      <div>
        <button onClick={fetchTodolistsHandler}>Download todolists</button>
      </div>
      {data?.map((todolist) => (
        <Grid key={todolist.id}>
          <Paper sx={{ p: "0 20px 20px 20px" }}>
            <TodolistItem todolist={todolist} />
          </Paper>
        </Grid>
      ))}
    </>
  )
}
