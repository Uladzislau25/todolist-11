import { createTodolistTC, deleteTodolistTC } from "./todolists-slice.ts"
import { createAppSlice } from "@/app/createAppSlice.ts"
import { tasksApi } from "@/features/todolists/api/tasksApi.ts"
import { DomainTask, TaskPriority, TaskStatus, UpdateTaskModel } from "@/features/todolists/api/tasksApi.types.ts"
import { RootState } from "@/app/store.ts"
import { changeStatusAC } from "@/app/app-slice.ts"
import { UpdateTaskArgs } from "@/common/components/types"

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
        async (arg: { todolistId: string; title: string }, { dispatch, rejectWithValue }) => {
          try {
            dispatch(changeStatusAC({ status: "loading" }))
            await new Promise((resolve) => setTimeout(resolve, 3000))
            const res = await tasksApi.createTask(arg)
            dispatch(changeStatusAC({ status: "succeeded" }))
            return { task: res.data.data.item, todolistId: res.data.data.item.todoListId }
          } catch (error) {
            dispatch(changeStatusAC({ status: "failed" }))
            return rejectWithValue(null)
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
            return arg
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
      changeTaskStatusTC: create.asyncThunk(
        async (arg: { todolistId: string; taskId: string; status: TaskStatus }, { getState, rejectWithValue }) => {
          try {
            const allTasks = (getState() as RootState).tasks
            const tasksForTodolist = allTasks[arg.todolistId]
            const task = tasksForTodolist.find((task) => {
              return task.id === arg.taskId
            })

            if (!task) {
              return rejectWithValue(null)
            }

            const model: UpdateTaskModel = {
              description: task.description,
              title: task.title,
              status: arg.status,
              priority: TaskPriority.Low,
              startDate: task.startDate,
              deadline: task.deadline,
            }
            await tasksApi.updateTask({ taskId: arg.taskId, todolistId: arg.todolistId, model })
            return arg
          } catch (error) {
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
            if (task) {
              task.status = action.payload.status
            }
          },
        },
      ),
      changeTaskTitleTC: create.asyncThunk(
        async (arg: { todolistId: string; taskId: string; title: string }, { getState, rejectWithValue }) => {
          try {
            const allTasks = (getState() as RootState).tasks
            const tasksForTodolist = allTasks[arg.todolistId]
            const task = tasksForTodolist.find((task) => {
              return task.id === arg.taskId
            })

            if (!task) {
              return rejectWithValue(null)
            }

            const model: UpdateTaskModel = {
              description: task.description,
              title: arg.title,
              status: task.status,
              priority: TaskPriority.Low,
              startDate: task.startDate,
              deadline: task.deadline,
            }
            await tasksApi.updateTask({ taskId: arg.taskId, todolistId: arg.todolistId, model })
            return arg
          } catch (error) {
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const task = state[action.payload.todolistId].find((task) => task.id === action.payload.taskId)
            if (task) {
              task.title = action.payload.title
            }
          },
        },
      ),
      updateTaskTC: create.asyncThunk(
        async ({ todolistId, taskId, domainModel }: UpdateTaskArgs, { getState, rejectWithValue }) => {
          const allTasks = (getState() as RootState).tasks
          const task = allTasks[todolistId].find((t) => t.id === taskId)
          if (!task) {
            return rejectWithValue(null)
          }
          const model: UpdateTaskModel = {
            description: task.description,
            title: task.title,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel,
          }
          await tasksApi.updateTask({ todolistId, taskId, model })
          return { todolistId, taskId, domainModel }
        },
        {
          fulfilled: (state, action) => {
            const task = state[action.payload.todolistId].find((t) => t.id === action.payload.taskId)
            if (task) {
              Object.assign(task, action.payload.domainModel)
            }
          },
        },
      ),
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
export const { changeTaskTitleTC, fetchTasksTC, createTasksTC, deleteTaskTC, changeTaskStatusTC, updateTaskTC } =
  tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type TasksState = Record<string, DomainTask[]>
export const { selectTasks } = tasksSlice.selectors
