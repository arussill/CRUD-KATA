package co.com.sofkau.back.Controllers;

import co.com.sofkau.back.Models.Todo;
import co.com.sofkau.back.Services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
public class TodoControntroller {

    @Autowired
    private TodoService service;

    @GetMapping(value = "api/todos")
    public Iterable<Todo> List() {
        return service.List();
    }

    @PostMapping(value = "api/todo")
    public Todo save(@RequestBody Todo todo) {
        return service.save(todo);
    }

    @DeleteMapping(value = "api/{id}/todo")
    public void delete(@PathVariable("id") Long id) {
        service.delete(id);
    }

    @GetMapping(value = "api/{id}/todo")
    public Todo get(@PathVariable("id") Long id) {
        return service.get(id);
    }

    @PutMapping(value = "api/todo")
    public Todo update(@RequestBody Todo todo) {
        if (todo.getId() != null) {
            return service.save(todo);
        }
        throw new RuntimeException("No exxite el id para actualizar");
    }
}
