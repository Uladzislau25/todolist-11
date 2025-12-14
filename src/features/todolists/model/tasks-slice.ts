import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"
import { createAppSlice } from "@/app/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, TaskStatus } from "@/features/todolists/api/tasksApi.types.ts"

export const tasksSlice = createAppSlice({
  name: "tasks",
  initialState: {} as TasksState,
  selectors: {
    selectTasks: (state) => state,
  },
  reducers: (create) => {
    return {
      fetchTasksTC: create.asyncThunk(
        async (todolistId: string, thunkApi) => {
          try {
            const res = await tasksApi.getTasks(todolistId)
            return { tasks: res.data.items, todolistId }
          } catch (error) {
            return thunkApi.rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          },
        },
      ),
      createTasksTC: create.asyncThunk(
        async (arg: { todolistId: string; title: string }, thunkApi) => {
          try {
            const res = await tasksApi.createTask(arg)
            return { task: res.data.data.item, todolistId: res.data.data.item.todoListId }
          } catch (error) {
            return thunkApi.rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const { todolistId, task } = action.payload
            state[todolistId].unshift(task)
          },
        },
      ),
      deleteTaskTC: create.asyncThunk(
        async (arg: { todolistId: string; taskId: string }, thunkApi) => {
          try {
            await tasksApi.deleteTask(arg)
            return { taskId: arg.taskId, todolistId: arg.todolistId }
          } catch (error) {
            return thunkApi.rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) {
              tasks.splice(index, 1)
            }
          },
        },
      ),

      deleteTaskAC: create.reducer<{ todolistId: string; taskId: string }>((state, action) => {
        const tasks = state[action.payload.todolistId]
        const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        if (index !== -1) {
          tasks.splice(index, 1)
        }
      }),

      changeTaskStatusAC: create.reducer<{ todolistId: string; taskId: string; status: TaskStatus }>(
        (state, action) => {
          const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
          if (task) {
            task.status = action.payload.status
          }
        },
      ),
      changeTaskTitleAC: create.reducer<{ todolistId: string; taskId: string; title: string }>((state, action) => {
        const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
        if (task) {
          task.title = action.payload.title
        }
      }),
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state[action.payload.id] = []
      })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
})
export const { changeTaskStatusAC, changeTaskTitleAC, fetchTasksTC, createTasksTC, deleteTaskTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
export const { selectTasks } = tasksSlice.selectors
