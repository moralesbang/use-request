# use-request

> Custom hooks for fetch data

[![NPM](https://img.shields.io/npm/v/use-request.svg)](https://www.npmjs.com/package/use-request) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<!---
## Install
```bash
npm install --save use-request
```
--->

## Usage

```jsx
function MyComponent() {
  const [todos, fetchTodos, setTodos] = useRequest({
    service: MyService.getTodos
  })

  if (todos.fetching) {
    return <h1>Loading...</h1>
  }

  if (todos.error) {
    return <h1>Oops! Something was wrong</h1>
  }

  const handleDeleteTodo = (todoId) => {
    const newTodos = todos.data.filter((todo) => todo.id !== todoId)
    setTodos({ data: newTodos })
  }

  return (
    <div>
      <TodoList todos={todos.data} onDelete={handleDeleteTodo} />
      <Button onClick={fetchTodos}>Refresh</Button>
    </div>
  )
}
```

## License

MIT © [moralesbang](https://github.com/moralesbang)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
