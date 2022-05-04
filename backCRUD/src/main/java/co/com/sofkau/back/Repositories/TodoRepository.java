package co.com.sofkau.back.Repositories;

import co.com.sofkau.back.Models.Todo;
import org.springframework.data.repository.CrudRepository;

public interface TodoRepository extends CrudRepository<Todo, Long>{

}
